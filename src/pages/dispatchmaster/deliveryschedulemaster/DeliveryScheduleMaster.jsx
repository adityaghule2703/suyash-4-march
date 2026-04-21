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
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  LocalShipping as LocalShippingIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddDeliverySchedule from './AddDeliverySchedule';
import ViewDeliverySchedule from './ViewDeliverySchedule';
import DeleteDeliverySchedule from './DeleteDeliverySchedule';

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
    Draft: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    Confirmed: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
    'In Transit': { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
    Delivered: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
  }
};

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Action Menu Component
const ActionMenu = ({ schedule, onView, onEdit, onDelete, onConfirm, anchorEl, onClose, onOpen }) => {
  const isConfirmed = schedule?.status === 'Confirmed';
  const isCancelled = schedule?.status === 'Cancelled';

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
            onView(schedule);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {!isConfirmed && !isCancelled && (
          <MenuItem 
            onClick={() => {
              onEdit(schedule);
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

        {!isConfirmed && !isCancelled && (
          <MenuItem 
            onClick={() => {
              onConfirm(schedule);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Confirm Schedule
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(schedule);
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

// Confirm Schedule Dialog
const ConfirmScheduleDialog = ({ open, onClose, schedule, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/delivery-schedules/${schedule._id}/confirm`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to confirm schedule');
      }
    } catch (err) {
      console.error('Error confirming schedule:', err);
      setError(err.response?.data?.message || 'Failed to confirm schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Confirm Delivery Schedule
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          Schedule: {schedule?.schedule_id}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem', mb: 2 }}>
          Are you sure you want to confirm this delivery schedule? Once confirmed, it cannot be edited.
        </Alert>
        
        {error && (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#10B981',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#059669' }
          }}
        >
          {loading ? 'Confirming...' : 'Confirm Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeliveryScheduleMaster = () => {
  // State for data
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedScheduleForAction, setSelectedScheduleForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  // Selected schedule
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch delivery schedules from API
  const fetchDeliverySchedules = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/delivery-schedules?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSchedules(response.data.data || []);
        setFilteredSchedules(response.data.data || []);
      } else {
        showNotification('Failed to load delivery schedules', 'error');
      }
    } catch (err) {
      console.error('Error fetching delivery schedules:', err);
      showNotification('Failed to load delivery schedules. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliverySchedules();
  }, [fetchDeliverySchedules]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDeliverySchedules();
    showNotification('Data refreshed', 'success');
  };

  // Handle search and filters
  useEffect(() => {
    let filtered = [...schedules];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(schedule =>
        schedule.schedule_id?.toLowerCase().includes(value) ||
        schedule.so_number?.toLowerCase().includes(value) ||
        schedule.transporter_preference?.toLowerCase().includes(value)
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(schedule => schedule.status === statusFilter);
    }
    
    setFilteredSchedules(filtered);
  }, [searchTerm, statusFilter, schedules]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredSchedules.map(schedule => schedule._id));
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

  const handleActionMenuOpen = (event, schedule) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedScheduleForAction(schedule);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedScheduleForAction(null);
  };

  const openViewModalHandler = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditModalHandler = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openDeleteDialogHandler = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openConfirmDialogHandler = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenConfirmDialog(true);
    handleActionMenuClose();
  };

  const handleAddSuccess = () => {
    setOpenAddModal(false);
    fetchDeliverySchedules();
    showNotification('Delivery schedule created successfully!', 'success');
  };

  const handleEditSuccess = () => {
    setOpenEditModal(false);
    setSelectedSchedule(null);
    fetchDeliverySchedules();
    showNotification('Delivery schedule updated successfully!', 'success');
  };

  const handleDeleteSuccess = () => {
    setOpenDeleteDialog(false);
    setSelectedSchedule(null);
    fetchDeliverySchedules();
    showNotification('Delivery schedule deleted successfully!', 'success');
  };

  const handleConfirmSuccess = () => {
    setOpenConfirmDialog(false);
    setSelectedSchedule(null);
    fetchDeliverySchedules();
    showNotification('Delivery schedule confirmed successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/delivery-schedules/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSelected([]);
      fetchDeliverySchedules();
      showNotification(`${selected.length} schedule(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete schedules', 'error');
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    const colors = COLORS.status[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`
        }}
      />
    );
  };

  const getVehicleTypeChip = (vehicleType) => {
    const colors = {
      'Regular': { bg: '#E0F2FE', color: '#0369A1' },
      'Over Dimensional Cargo (ODC)': { bg: '#FEF3C7', color: '#B45309' },
      'Water Vessel': { bg: '#D1FAE5', color: '#065F46' },
      'Air Cargo': { bg: '#F3E8FF', color: '#7E22CE' }
    };
    const style = colors[vehicleType] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={vehicleType}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: style.bg,
          color: style.color
        }}
      />
    );
  };

  const paginatedSchedules = filteredSchedules.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          Delivery Schedule Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage delivery schedules, track shipments, and monitor dispatch status
        </Typography>
      </Box>

      {/* Filter and Action Bar */}
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
              placeholder="Search by schedule ID, SO number..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 280 },
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
            
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ 
                width: 140,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
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
              Create Schedule
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Delivery Schedules Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredSchedules.length}
                    checked={filteredSchedules.length > 0 && selected.length === filteredSchedules.length}
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
                    disabled={loading || filteredSchedules.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Schedule ID
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Dispatch Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  SO Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Transporter
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Vehicle Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Total Qty
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
                      Loading delivery schedules...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LocalShippingIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || statusFilter !== 'All' ? 'No delivery schedules found' : 'No delivery schedules available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || statusFilter !== 'All' ? 'Try adjusting your search terms' : 'Create your first delivery schedule'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSchedules.map((schedule, index) => {
                  const isSelected = selected.includes(schedule._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedScheduleForAction?._id === schedule._id;

                  return (
                    <TableRow
                      key={schedule._id || index}
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
                          onChange={() => handleSelect(schedule._id)}
                          disabled={schedule.status === 'Confirmed' || schedule.status === 'In Transit'}
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
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {schedule.schedule_id}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(schedule.dispatch_date)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {schedule.so_number}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {schedule.transporter_preference || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {getVehicleTypeChip(schedule.vehicle_type)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {schedule.total_scheduled_qty || 0}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(schedule.status)}
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          schedule={schedule}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onConfirm={openConfirmDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, schedule)}
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
          count={filteredSchedules.length}
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
      <AddDeliverySchedule 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedSchedule && (
        <>
          <AddDeliverySchedule 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedSchedule(null);
            }}
            onSuccess={handleEditSuccess}
            initialData={selectedSchedule}
            isEditMode={true}
          />

          <ViewDeliverySchedule 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedSchedule(null);
            }}
            schedule={selectedSchedule}
          />

          <DeleteDeliverySchedule 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedSchedule(null);
            }}
            schedule={selectedSchedule}
            onDelete={handleDeleteSuccess}
          />

          <ConfirmScheduleDialog
            open={openConfirmDialog}
            onClose={() => {
              setOpenConfirmDialog(false);
              setSelectedSchedule(null);
            }}
            schedule={selectedSchedule}
            onSuccess={handleConfirmSuccess}
          />
        </>
      )}

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

export default DeliveryScheduleMaster;