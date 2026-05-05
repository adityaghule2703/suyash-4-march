// MachineMaster.jsx
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
 
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  TrendingUp as TrendingUpIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddMachine from './AddMachine';
import ViewMachine from './ViewMachine';
import EditMachine from './EditMachine';
import DeleteMachine from './DeleteMachine';
import { COLORS, MACHINE_TYPE_COLORS, MACHINE_STATUS_COLORS, MACHINE_STATUS_OPTIONS } from './constants';

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
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onCapacityReport, onStatusUpdate, permissions, isSuperAdmin }) => {
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.MACHINE_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.MACHINE_MASTER, ACTIONS.UPDATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.MACHINE_MASTER, ACTIONS.DELETE);

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
        {/* View Details - VIEW permission */}
        {canView && (
          <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
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
        
        {/* Edit - UPDATE permission */}
        {canUpdate && (
          <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
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
        
        {/* Update Status - UPDATE permission */}
        {canUpdate && (
          <MenuItem onClick={() => { onStatusUpdate(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Update Status
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Capacity Report - VIEW permission */}
        {canView && (
          <MenuItem onClick={() => { onCapacityReport(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Capacity Report
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        {/* Delete - DELETE permission */}
        {canDelete && (
          <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
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

// Capacity Report Modal
const CapacityReportModal = ({ open, onClose, machine, reportData, loading, fromDate, toDate, onFromDateChange, onToDateChange, onGenerateReport, canView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.7rem', color: '#059669' }} />;
      case 'Idle':
        return <PendingIcon sx={{ fontSize: '0.7rem', color: '#D97706' }} />;
      case 'Under Maintenance':
        return <BuildIcon sx={{ fontSize: '0.7rem', color: '#4F46E5' }} />;
      case 'Breakdown':
        return <CancelIcon sx={{ fontSize: '0.7rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.7rem', color: '#4F46E5' }} />;
    }
  };
  
  const getStatusColor = (status) => {
    const colors = MACHINE_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
    return colors;
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
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Capacity Report
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Machine Info */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}` 
          }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {machine?.machine_name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {machine?.machine_code}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                  {machine?.work_centre || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                <Chip
                  icon={getStatusIcon(machine?.status)}
                  label={machine?.status || 'Active'}
                  size="small"
                  sx={{ 
                    fontSize: '0.65rem',
                    height: 24,
                    bgcolor: getStatusColor(machine?.status).bg,
                    color: getStatusColor(machine?.status).color
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Date Range Selector */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Select Date Range
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  size="small"
                  value={fromDate}
                  onChange={(e) => onFromDateChange(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  size="small"
                  value={toDate}
                  onChange={(e) => onToDateChange(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={onGenerateReport}
              disabled={!fromDate || !toDate || loading || !canView}
              sx={{
                mt: 2,
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none'
              }}
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </Button>
          </Paper>
          
          {/* Report Data */}
          {reportData && (
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Capacity Report
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Available Hours/Day</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {reportData.available_hours_per_day || 0} hrs
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Shifts/Day</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {reportData.shifts_per_day || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Hours/Shift</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {reportData.hours_per_shift || 0} hrs
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Utilization %</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#F59E0B' }}>
                      {reportData.utilization_percent || 0}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>OEE Today</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981' }}>
                      {reportData.oee_today || 0}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Scheduled Hours Today</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                      {reportData.scheduled_hours_today || 0} hrs
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {reportData.note && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
                  {reportData.note}
                </Alert>
              )}
            </Paper>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Status Update Modal
const StatusUpdateModal = ({ open, onClose, machine, onStatusUpdate, loading, canUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (open && machine) {
      setSelectedStatus(machine.status || 'Active');
      setError('');
    }
  }, [open, machine]);
  
  const handleSubmit = () => {
    if (!canUpdate) {
      setError('You don\'t have permission to update status');
      return;
    }
    if (!selectedStatus) {
      setError('Please select a status');
      return;
    }
    onStatusUpdate(selectedStatus);
  };
  
  const statusColors = {
    Active: { bg: '#D1FAE5', color: '#059669' },
    Idle: { bg: '#FEF3C7', color: '#D97706' },
    'Under Maintenance': { bg: '#E0E7FF', color: '#4F46E5' },
    Breakdown: { bg: '#FEE2E2', color: '#DC2626' },
    Decommissioned: { bg: '#F1F5F9', color: '#475569' }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Update Machine Status
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
          Machine: <strong>{machine?.machine_name} ({machine?.machine_code})</strong>
        </Typography>
        
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
          Current Status: 
          <Chip
            label={machine?.status}
            size="small"
            sx={{ 
              ml: 1,
              fontSize: '0.65rem',
              height: 22,
              bgcolor: statusColors[machine?.status]?.bg || '#F1F5F9',
              color: statusColors[machine?.status]?.color || '#475569'
            }}
          />
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel sx={{ fontSize: '0.75rem' }}>New Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setError('');
            }}
            label="New Status"
            error={!!error}
            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
          >
            {MACHINE_STATUS_OPTIONS.map(status => (
              <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: statusColors[status]?.color || '#475569' 
                  }} />
                  <span>{status}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          {error && (
            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
              {error}
            </Typography>
          )}
        </FormControl>
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedStatus || loading || !canUpdate}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MachineMaster = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedMachineForAction, setSelectedMachineForAction] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCapacityReportModal, setOpenCapacityReportModal] = useState(false);
  const [openStatusUpdateModal, setOpenStatusUpdateModal] = useState(false);
  
  // Report states
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusLoading, setStatusLoading] = useState(false);

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
    return hasPermission(
      userPermissions,
      MODULES.BOM_MASTER,
      PAGES.MACHINE_MASTER,
      action
    );
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

  // Fetch Machines from API
  const fetchMachines = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    if (!isSearchingRef.current) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/machines?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMachines(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load machines', 'error');
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
      showNotification('Failed to load machines', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchMachines();
    }
  }, [fetchMachines, permissionsLoaded, canViewPage, isSuperAdmin]);

  // Handle refresh
  const handleRefresh = () => {
    fetchMachines();
    showNotification('Data refreshed', 'success');
  };

  // Handle selection - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(machines.map(machine => machine._id));
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
  
  const handleAddMachine = () => {
    fetchMachines();
    showNotification('Machine added successfully!', 'success');
  };
  
  const handleEditMachine = () => {
    fetchMachines();
    showNotification('Machine updated successfully!', 'success');
  };
  
  const handleDeleteMachine = () => {
    fetchMachines();
    setSelected([]);
    showNotification('Machine deleted successfully!', 'success');
  };
  
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedMachine) return;
    
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/machines/${selectedMachine._id}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showNotification(`Status updated to ${newStatus} successfully!`, 'success');
        fetchMachines();
        setOpenStatusUpdateModal(false);
        setSelectedMachine(null);
      } else {
        showNotification(response.data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification('Failed to update status', 'error');
    } finally {
      setStatusLoading(false);
    }
  };
  
  const handleCapacityReport = async () => {
    if (!selectedMachine) return;
    
    setReportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/machines/capacity-report?from_date=${fromDate}&to_date=${toDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        const machineReport = response.data.data.find(r => r.machine_id === selectedMachine.machine_id);
        setReportData(machineReport || response.data.data[0]);
      } else {
        showNotification('Failed to load capacity report', 'error');
      }
    } catch (err) {
      console.error('Error fetching capacity report:', err);
      showNotification('Failed to load capacity report', 'error');
    } finally {
      setReportLoading(false);
    }
  };
  
  const handleActionMenuOpen = (event, machine) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedMachineForAction(machine);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedMachineForAction(null);
  };

  const openViewMachineModal = (machine) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view machine details', 'error');
      return;
    }
    setSelectedMachine(machine);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openEditMachineModal = (machine) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to edit machines', 'error');
      return;
    }
    setSelectedMachine(machine);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteMachineDialog = (machine) => {
    if (!canDelete) {
      showNotification('You don\'t have permission to delete machines', 'error');
      return;
    }
    setSelectedMachine(machine);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const openCapacityReportModalFunc = (machine) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view capacity report', 'error');
      return;
    }
    setSelectedMachine(machine);
    setReportData(null);
    setOpenCapacityReportModal(true);
    handleActionMenuClose();
  };
  
  const openStatusUpdateModalFunc = (machine) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to update status', 'error');
      return;
    }
    setSelectedMachine(machine);
    setOpenStatusUpdateModal(true);
    handleActionMenuClose();
  };
  
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/machines/bulk-delete`,
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setSelected([]);

      if (machines.length === selected.length && page > 0) {
        setPage(prev => prev - 1);
      }
      fetchMachines();
      showNotification(`${selected.length} machine(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete machines', 'error');
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
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Idle':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Under Maintenance':
        return <BuildIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
      case 'Breakdown':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };
  
  const getStatusColor = (status) => {
    const colors = {
      Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
      Idle: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
      'Under Maintenance': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
      Breakdown: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      Decommissioned: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
    };
    return colors[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };
  
  const getMachineInitials = (machine) => {
    if (!machine.machine_name) return 'MC';
    return machine.machine_name.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (machine) => {
    if (!machine.machine_name) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = machine.machine_name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const getMachineTypeColor = (type) => {
    const colors = {
      Press: { bg: '#FEF3C7', color: '#D97706' },
      CNC: { bg: '#DBEAFE', color: '#1E40AF' },
      Lathe: { bg: '#E0E7FF', color: '#4F46E5' },
      Milling: { bg: '#D1FAE5', color: '#059669' },
      Drilling: { bg: '#FEE2E2', color: '#DC2626' },
      Grinding: { bg: '#FEF3C7', color: '#92400E' },
      Welding: { bg: '#FFE4E6', color: '#BE123C' },
      Bending: { bg: '#E0F2FE', color: '#0369A1' },
      'Laser Cutting': { bg: '#E9F5E9', color: '#2E7D32' },
      Plating: { bg: '#F3E5F5', color: '#7B1FA2' },
      Assembly: { bg: '#FFF3E0', color: '#ED6C02' },
      Inspection: { bg: '#E8EAF6', color: '#283593' },
      Other: { bg: '#F1F5F9', color: '#475569' }
    };
    return colors[type] || { bg: '#F1F5F9', color: '#475569' };
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
          Machine Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage machines, track capacity, and monitor performance
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
              placeholder="Search by Machine Name, Code, or Work Centre..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
              sx={{ 
                width: { xs: '100%', sm: 450 },
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
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
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

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Refresh Button */}
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Bulk Delete Button - DELETE permission */}
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

            {/* Add Machine Button - CREATE permission */}
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
                Add Machine
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Machines Table */}
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
                      indeterminate={selected.length > 0 && selected.length < machines.length}
                      checked={machines.length > 0 && selected.length === machines.length}
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
                      disabled={loading || machines.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Machine Name / Code
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Capacity
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Work Centre
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Schedule
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  OEE Target
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
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
                      Loading machines...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : machines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No machines found' : 'No machines available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first machine to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                machines.map((machine) => {
                  const isSelected = selected.includes(machine._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedMachineForAction?._id === machine._id;
                  const avatarColor = getAvatarColor(machine);
                  const statusColors = getStatusColor(machine.status);
                  const typeColors = getMachineTypeColor(machine.machine_type);
                  const totalHoursPerDay = (machine.shifts_per_day || 0) * (machine.hours_per_shift || 0);
                  
                  return (
                    <TableRow
                      key={machine._id}
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
                            onChange={() => handleSelect(machine._id)}
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
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getMachineInitials(machine)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {machine.machine_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Code: {machine.machine_code} | ID: {machine.machine_id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={machine.machine_type || '-'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: typeColors.bg,
                            color: typeColors.color
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {machine.capacity_value} {machine.capacity_unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {machine.work_centre || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Location: {machine.location || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {machine.shifts_per_day || 0} shifts
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {machine.hours_per_shift || 0} hrs/shift
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#059669' }}>
                          Total: {totalHoursPerDay} hrs/day
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(machine.status)}
                          label={machine.status || 'Active'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`,
                            '& .MuiChip-icon': {
                              fontSize: '0.8rem'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {machine.oee_target_percent || 0}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={machine}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, machine)}
                          onClose={handleActionMenuClose}
                          onView={openViewMachineModal}
                          onEdit={openEditMachineModal}
                          onDelete={openDeleteMachineDialog}
                          onCapacityReport={openCapacityReportModalFunc}
                          onStatusUpdate={openStatusUpdateModalFunc}
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
      {canCreate && (
        <AddMachine 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddMachine}
        />
      )}

      {selectedMachine && (
        <>
          {/* View Modal - VIEW permission */}
          {canViewPage && (
            <ViewMachine 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedMachine(null);
              }}
              machine={selectedMachine}
            />
          )}

          {/* Edit Modal - UPDATE permission */}
          {canUpdate && (
            <EditMachine 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedMachine(null);
              }}
              machine={selectedMachine}
              onUpdate={handleEditMachine}
            />
          )}

          {/* Delete Modal - DELETE permission */}
          {canDelete && (
            <DeleteMachine 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedMachine(null);
              }}
              machine={selectedMachine}
              onDelete={handleDeleteMachine}
            />
          )}

          {/* Capacity Report Modal - VIEW permission */}
          {canViewPage && (
            <CapacityReportModal
              open={openCapacityReportModal}
              onClose={() => {
                setOpenCapacityReportModal(false);
                setSelectedMachine(null);
                setReportData(null);
              }}
              machine={selectedMachine}
              reportData={reportData}
              loading={reportLoading}
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onGenerateReport={handleCapacityReport}
              canView={canViewPage}
            />
          )}

          {/* Status Update Modal - UPDATE permission */}
          {canUpdate && (
            <StatusUpdateModal
              open={openStatusUpdateModal}
              onClose={() => {
                setOpenStatusUpdateModal(false);
                setSelectedMachine(null);
              }}
              machine={selectedMachine}
              onStatusUpdate={handleStatusUpdate}
              loading={statusLoading}
              canUpdate={canUpdate}
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MachineMaster;