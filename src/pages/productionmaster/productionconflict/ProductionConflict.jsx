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
  TablePagination,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  DateRange as DateIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  ReportProblem as ConflictIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    light: '#FFFFFF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF',
    hover: '#F3F4F6',
    tableHeader: '#F9FAFB'
  }
};

const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Evening', 'Night'];

// View Conflict Details Dialog (Inner dialog)
const ViewConflictDialog = ({ open, onClose, schedule }) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#D1FAE5', color: '#059669' };
      case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Planned': return { bg: '#FEF3C7', color: '#D97706' };
      default: return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const statusColors = getStatusColor(schedule.status);

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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConflictIcon sx={{ fontSize: '1.2rem', color: COLORS.warning }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Schedule Conflict Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              Schedule Conflict Detected
            </Typography>
            <Typography sx={{ fontSize: '0.7rem' }}>
              This schedule overlaps with another production schedule on the same machine.
            </Typography>
          </Alert>

          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Schedule Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {schedule.schedule_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                <Chip label={schedule.status} size="small" sx={{ fontSize: '0.7rem', mt: 0.5, bgcolor: statusColors.bg, color: statusColors.color }} />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <MachineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Machine Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.machine_id === 'object' ? schedule.machine_id?.machine_name : schedule.machine_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.machine_id === 'object' ? schedule.machine_id?.machine_code : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <WOIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Work Order Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.wo_id === 'object' ? schedule.wo_id?.wo_number : schedule.wo_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.part_no || (typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_no : '-')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Operation {schedule.operation_seq}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{schedule.planned_qty}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <DateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Schedule Details
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{formatDate(schedule.scheduled_date)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift</Typography>
                <Chip label={schedule.shift} size="small" sx={{ fontSize: '0.7rem', mt: 0.5 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{schedule.planned_hours} hours</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Start Time</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{schedule.start_time}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>End Time</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{schedule.end_time}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>{formatDateTime(schedule.createdAt)}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(schedule.updatedAt)}</Typography>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
        <Button onClick={onClose} size="small">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Conflict Dialog Component
const ProductionConflict = ({ open, onClose }) => {
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

  // Fetch conflicts when dialog opens
  useEffect(() => {
    if (open) {
      fetchConflicts();
    }
  }, [open, page, rowsPerPage, searchTerm, shiftFilter]);

  const fetchConflicts = useCallback(async () => {
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
      }
    } catch (err) {
      console.error('Error fetching conflicts:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, shiftFilter]);

  const handleViewConflict = (conflict) => {
    setSelectedConflict(conflict);
    setOpenViewDialog(true);
  };

  const handleRefresh = () => {
    setPage(0);
    fetchConflicts();
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setShiftFilter('All');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#D1FAE5', color: '#059669' };
      case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Planned': return { bg: '#FEF3C7', color: '#D97706' };
      default: return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const getShiftColor = (shift) => {
    const colors = {
      General: { bg: '#E0E7FF', color: '#4338CA' },
      Morning: { bg: '#FEF3C7', color: '#D97706' },
      Evening: { bg: '#FCE7F3', color: '#BE185D' },
      Night: { bg: '#E0E7FF', color: '#3730A3' }
    };
    return colors[shift] || { bg: '#F1F5F9', color: '#475569' };
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
          overflow: 'hidden',
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConflictIcon sx={{ fontSize: '1.2rem', color: COLORS.warning }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Production Schedule Conflicts
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {/* Filters Bar */}
        <Paper sx={{
          p: 1.5,
          mb: 2.5,
          borderRadius: 2,
          bgcolor: COLORS.background.white,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflowX: 'auto'
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 'max-content' }}>
            <TextField
              placeholder="Search by schedule ID, WO number..."
              size="small"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                const timer = setTimeout(() => setSearchTerm(e.target.value), 500);
                return () => clearTimeout(timer);
              }}
              sx={{ width: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { height: 36, bgcolor: COLORS.background.light }
              }}
            />

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Shift</InputLabel>
              <Select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                label="Shift"
                sx={{ height: 36, fontSize: '0.75rem' }}
              >
                {SHIFT_OPTIONS.map(shift => (
                  <MenuItem key={shift} value={shift} sx={{ fontSize: '0.75rem' }}>{shift}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button size="small" onClick={clearFilters} sx={{ height: 36, textTransform: 'none', fontSize: '0.7rem' }}>
              Clear Filters
            </Button>

            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleRefresh}
              sx={{ height: 36, textTransform: 'none', fontSize: '0.7rem' }}
            >
              Refresh
            </Button>
          </Stack>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{height: '80px'}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Conflicts</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.error }}>{totalItems}</Typography>
                  </Box>
                  <ConflictIcon sx={{ fontSize: 20, color: COLORS.error, opacity: 0.7 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{height: '80px'}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Affected Machines</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                      {new Set(conflicts.map(c => typeof c.machine_id === 'object' ? c.machine_id?._id : c.machine_id)).size}
                    </Typography>
                  </Box>
                  <MachineIcon sx={{ fontSize: 40, color: COLORS.primary, opacity: 0.7 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{height: '80px'}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Pending Resolution</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.warning }}>
                      {conflicts.filter(c => c.status !== 'Completed').length}
                    </Typography>
                  </Box>
                  <WarningIcon sx={{ fontSize: 40, color: COLORS.warning, opacity: 0.7 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Conflicts Table */}
        <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          <TableContainer sx={{ maxHeight: 'calc(90vh - 300px)' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Schedule ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Machine</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Work Order</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Part / Operation</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Scheduled Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Shift / Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 80 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading conflicts...</Typography>
                    </TableCell>
                  </TableRow>
                ) : conflicts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CheckCircleIcon sx={{ fontSize: 48, color: COLORS.success, mb: 1 }} />
                        <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                          No Conflicts Found
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                          All production schedules are properly arranged
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  conflicts.map((conflict) => {
                    const statusColors = getStatusColor(conflict.status);
                    const shiftColors = getShiftColor(conflict.shift);
                    return (
                      <TableRow key={conflict._id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <WarningIcon sx={{ fontSize: '0.8rem', color: COLORS.warning }} />
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                              {conflict.schedule_id}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <MachineIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{getMachineName(conflict)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{getWONumber(conflict)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>{getPartNo(conflict)}</Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Op {conflict.operation_seq}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>{formatDate(conflict.scheduled_date)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={conflict.shift} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: shiftColors.bg, color: shiftColors.color }} />
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                            {conflict.start_time} - {conflict.end_time}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={conflict.status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: statusColors.bg, color: statusColors.color }} />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewConflict(conflict)} sx={{ color: COLORS.primary }}>
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
        <Button onClick={onClose} size="small">Close</Button>
      </DialogActions>

      {/* Inner View Dialog */}
      <ViewConflictDialog
        open={openViewDialog}
        onClose={() => { setOpenViewDialog(false); setSelectedConflict(null); }}
        schedule={selectedConflict}
      />
    </Dialog>
  );
};

export default ProductionConflict;