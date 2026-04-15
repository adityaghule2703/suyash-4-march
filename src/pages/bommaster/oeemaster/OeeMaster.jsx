// OeeMaster.jsx
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
  TableSortLabel
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
  Close as CloseIcon,
  Factory as FactoryIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddOee from './AddOee';
import EditOee from './EditOee';
import MachineLoading from './MachineLoading';
import MachineOEETrend from './MachineOEETrend';
import AddDowntime from './AddDowntime';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    light: '#6B7280'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF',
    hover: '#F3F4F6',
    tableHeader: '#F9FAFB'
  }
};

const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Afternoon', 'Night'];

// Action Menu Component
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onLoadingAnalysis, onTrendAnalysis, onAddDowntime }) => {
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

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

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
  const [selectedMachine, setSelectedMachine] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
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

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch machines on component mount
  useEffect(() => {
    fetchMachines();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch records when dependencies change
  useEffect(() => {
    if (selectedMachine) {
      fetchRecords();
    }
  }, [selectedMachine, page, rowsPerPage, searchTerm, dateRange, shiftFilter]);

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines?page=1&limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMachines(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedMachine(response.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
      showNotification('Failed to load machines', 'error');
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams();
      params.append('machine_id', selectedMachine);
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
  };

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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(records.map(record => record._id));
    } else {
      setSelected([]);
    }
  };

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
    setSelectedRecord(record);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditRecordModal = (record) => {
    setSelectedRecord(record);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openDeleteRecordDialog = (record) => {
    setSelectedRecord(record);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openLoadingAnalysis = (record) => {
    setSelectedRecord(record);
    setOpenLoadingDialog(true);
    handleActionMenuClose();
  };

  const openTrendAnalysis = (record) => {
    setSelectedRecord(record);
    setOpenTrendDialog(true);
    handleActionMenuClose();
  };

  const openDowntimeModalFunc = (record) => {
    console.log('Opening downtime modal for record:', record);
    setSelectedRecordForDowntime(record);
    setOpenDowntimeModal(true);
    handleActionMenuClose();
  };
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/oee-records/${selectedRecord._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        handleDeleteSuccess();
        setOpenDeleteDialog(false);
        setSelectedRecord(null);
      } else {
        showNotification(response.data.message || 'Failed to delete record', 'error');
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      showNotification('Failed to delete record', 'error');
    } finally {
      setDeleteLoading(false);
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

  const getStatusColor = (oee) => {
    const status = getOEEStatus(oee);
    return status.color;
  };

  const getMachineName = (machineId) => {
    const machine = machines.find(m => m._id === machineId);
    return machine ? `${machine.machine_name} (${machine.machine_code})` : 'N/A';
  };

  const getSelectedMachineDetails = () => {
    return machines.find(m => m._id === selectedMachine);
  };

  const exportToCSV = () => {
    if (records.length === 0) return;

    const headers = ['Date', 'Shift', 'OEE (%)', 'Availability (%)', 'Performance (%)', 'Quality (%)', 'Planned Time', 'Run Time', 'Total Qty', 'Good Qty', 'Downtime (min)', 'Notes'];
    const csvData = records.map(record => [
      formatDate(record.date),
      record.shift,
      record.oee || 0,
      record.availability || 0,
      record.performance || 0,
      record.quality || 0,
      record.planned_production_time || 0,
      record.actual_run_time || 0,
      record.total_qty || 0,
      record.good_qty || 0,
      record.total_downtime_min || 0,
      record.notes || ''
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oee_records_${getSelectedMachineDetails()?.machine_code}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setShiftFilter('All');
    setDateRange({
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    });
    setPage(0);
  };

  const selectedMachineDetails = getSelectedMachineDetails();
  const oeeStatus = getOEEStatus(summary.avgOEE);
  const StatusIcon = oeeStatus.icon;

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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
            {/* Filters Row */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by shift, notes..."
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: 250 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
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
                  }
                }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Shift</InputLabel>
                <Select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  label="Shift"
                  sx={{ height: 36, fontSize: '0.75rem' }}
                >
                  {SHIFT_OPTIONS.map(shift => (
                    <MenuItem key={shift} value={shift}>{shift}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="From Date"
                value={dateRange.from}
                onChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                slotProps={{ textField: { size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 36 } } } }}
              />

              <DatePicker
                label="To Date"
                value={dateRange.to}
                onChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                slotProps={{ textField: { size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 36 } } } }}
              />

              <Button
                size="small"
                onClick={handleClearFilters}
                sx={{ height: 36, textTransform: 'none', fontSize: '0.7rem' }}
              >
                Clear Filters
              </Button>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              {selected.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderColor: '#fee2e2',
                    color: '#991b1b',
                  }}
                >
                  Delete ({selected.length})
                </Button>
              )}
              <Tooltip title="Export to CSV">
                <IconButton onClick={exportToCSV} size="small" disabled={records.length === 0} sx={{ height: 36, width: 36 }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint} size="small" disabled={records.length === 0} sx={{ height: 36, width: 36 }}>
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleAddRecord}
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
              >
                Add OEE Record
              </Button>
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
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Shift</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>OEE (%)</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Availability</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Performance</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Quality</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Production</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>Downtime</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                        Loading OEE records...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AssessmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                        <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                          {searchTerm ? 'No OEE records found' : 'No OEE records available'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                          {searchTerm ? 'Try adjusting your search terms' : 'Add your first OEE record to get started'}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddRecord}
                          sx={{ mt: 2 }}
                        >
                          Add OEE Record
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => {
                    const isSelected = selected.includes(record._id);
                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRecordForAction?._id === record._id;
                    const recordStatus = getOEEStatus(record.oee);
                    const RecordStatusIcon = recordStatus.icon;

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
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.shift}
                            size="small"
                            sx={{ height: 24, fontSize: '0.7rem', bgcolor: COLORS.background.light }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 600, color: recordStatus.color }}>
                              {record.oee}%
                            </Typography>
                            <RecordStatusIcon sx={{ fontSize: '0.9rem', color: recordStatus.color }} />
                          </Box>
                        </TableCell>
                        <TableCell>{record.availability}%</TableCell>
                        <TableCell>{record.performance}%</TableCell>
                        <TableCell>{record.quality}%</TableCell>
                        <TableCell>
                          <Tooltip title={`Good: ${record.good_qty} / Total: ${record.total_qty}`}>
                            <Typography variant="body2">
                              {record.good_qty}/{record.total_qty}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={record.total_downtime_min > 0 ? COLORS.warning : COLORS.success}>
                            {record.total_downtime_min} min
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
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

        {/* Modal Components */}
        <AddOee
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddSuccess}
        />

        {selectedRecord && (
          <>
            {/* View Record Dialog */}
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
                <Button variant="contained" onClick={() => {
                  setOpenViewModal(false);
                  openEditRecordModal(selectedRecord);
                }} size="small">Edit Record</Button>
              </DialogActions>
            </Dialog>

            {/* Edit OEE Dialog */}
            <EditOee
              open={openEditModal}
              onClose={() => setOpenEditModal(false)}
              onUpdate={handleEditSuccess}
              recordData={selectedRecord}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this OEE record? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)} disabled={deleteLoading}>Cancel</Button>
                <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteLoading}>
                  {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Machine Loading Analysis Dialog */}
            <Dialog
              open={openLoadingDialog}
              onClose={() => setOpenLoadingDialog(false)}
              maxWidth="lg"
              fullWidth
              PaperProps={{ sx: { borderRadius: 2, height: '80vh' } }}
            >
              <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600 }}>Machine Loading Analysis</Typography>
                <IconButton onClick={() => setOpenLoadingDialog(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <MachineLoading machineId={selectedMachine} onClose={() => setOpenLoadingDialog(false)} />
              </DialogContent>
            </Dialog>

            {/* OEE Trend Analysis Dialog */}
            <Dialog
              open={openTrendDialog}
              onClose={() => setOpenTrendDialog(false)}
              maxWidth="xl"
              fullWidth
              PaperProps={{ sx: { borderRadius: 2, height: '85vh' } }}
            >
              <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600 }}>OEE Trend Analysis</Typography>
                <IconButton onClick={() => setOpenTrendDialog(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <MachineOEETrend machineId={selectedMachine} onClose={() => setOpenTrendDialog(false)} />
              </DialogContent>
            </Dialog>

           

          </>
        )}
         <AddDowntime
              open={openDowntimeModal}
              onClose={() => {
                setOpenDowntimeModal(false);
                setSelectedRecordForDowntime(null);
              }}
              onAdd={(data) => {
                console.log('Downtime logged:', data);
                fetchRecords(); // Refresh the records to show updated OEE
              }}
              oeeRecordId={selectedRecordForDowntime?._id}
              machineName={getMachineName(selectedRecordForDowntime?.machine_id)}
              recordDate={selectedRecordForDowntime?.date}
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
    </LocalizationProvider>
  );
};

export default OeeMaster;