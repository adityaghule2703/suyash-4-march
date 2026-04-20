import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    tertiary: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  }
};

const SHIFT_OPTIONS = ['General', 'Morning', 'Evening', 'Night'];
const STATUS_OPTIONS = ['Planned', 'In Progress', 'Completed', 'Cancelled'];

const EditProductionSchedule = ({ open, onClose, schedule, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null);
  
  const [formData, setFormData] = useState({
    scheduled_date: '',
    shift: 'General',
    start_time: '08:00',
    end_time: '12:00',
    planned_hours: '',
    planned_qty: '',
    status: 'Planned'
  });

  // Initialize form with schedule data
  useEffect(() => {
    if (schedule && open) {
      const scheduledDate = schedule.scheduled_date 
        ? new Date(schedule.scheduled_date).toISOString().split('T')[0] 
        : '';
      
      setFormData({
        scheduled_date: scheduledDate,
        shift: schedule.shift || 'General',
        start_time: schedule.start_time || '08:00',
        end_time: schedule.end_time || '12:00',
        planned_hours: schedule.planned_hours || '',
        planned_qty: schedule.planned_qty || '',
        status: schedule.status || 'Planned'
      });
      setConflictWarning(null);
      setError('');
      setSuccess(false);
    }
  }, [schedule, open]);

  // Recalculate planned hours when start/end time changes
  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      const start = formData.start_time.split(':');
      const end = formData.end_time.split(':');
      const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
      const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
      const hours = (endMinutes - startMinutes) / 60;
      if (hours > 0) {
        setFormData(prev => ({ ...prev, planned_hours: hours.toFixed(2) }));
      }
    }
  }, [formData.start_time, formData.end_time]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear conflict warning when user modifies form
    if (conflictWarning) {
      setConflictWarning(null);
    }
    
    // Clear error
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.scheduled_date) {
      setError('Please select scheduled date');
      return;
    }
    if (!formData.shift) {
      setError('Please select shift');
      return;
    }
    if (!formData.start_time) {
      setError('Please select start time');
      return;
    }
    if (!formData.end_time) {
      setError('Please select end time');
      return;
    }
    if (!formData.planned_qty || formData.planned_qty <= 0) {
      setError('Please enter valid planned quantity');
      return;
    }

    setLoading(true);
    setError('');
    setConflictWarning(null);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        scheduled_date: formData.scheduled_date,
        shift: formData.shift,
        start_time: formData.start_time,
        end_time: formData.end_time,
        planned_hours: parseFloat(formData.planned_hours),
        planned_qty: parseInt(formData.planned_qty),
        status: formData.status
      };

      const response = await axios.put(
        `${BASE_URL}/api/production-schedule/${schedule._id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        
        // Check if there was a conflict
        if (response.data.conflict) {
          setConflictWarning({
            message: response.data.message,
            conflict: response.data.conflict
          });
        }
        
        // Call onUpdate callback
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to update production schedule');
      }
    } catch (err) {
      console.error('Error updating production schedule:', err);
      
      // Handle conflict error from backend
      if (err.response?.data?.conflict) {
        setConflictWarning({
          message: err.response.data.message,
          conflict: err.response.data.conflict
        });
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Failed to update production schedule. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setConflictWarning(null);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#D1FAE5', color: '#059669' };
      case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Planned': return { bg: '#FEF3C7', color: '#D97706' };
      case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const getMachineName = () => {
    if (typeof schedule?.machine_id === 'object') {
      return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
    }
    return schedule?.machine_id || '-';
  };

  const getWONumber = () => {
    if (typeof schedule?.wo_id === 'object') {
      return schedule.wo_id?.wo_number || '-';
    }
    return schedule?.wo_id || '-';
  };

  const getPartNo = () => {
    if (typeof schedule?.wo_id === 'object') {
      return schedule.wo_id?.part_no || schedule?.part_no || '-';
    }
    return schedule?.part_no || '-';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
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
          <EditIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Production Reschedule
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity={conflictWarning ? "warning" : "success"} 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={conflictWarning ? <WarningIcon /> : <CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                {conflictWarning ? 'Schedule Updated with Conflict' : 'Schedule Updated Successfully!'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                {conflictWarning ? conflictWarning.message : 'The production schedule has been updated'}
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Updated Schedule Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {schedule?.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                  <Chip
                    label={formData.status}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      mt: 0.5,
                      bgcolor: getStatusColor(formData.status).bg,
                      color: getStatusColor(formData.status).color
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(formData.scheduled_date)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift</Typography>
                  <Chip
                    label={formData.shift}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      mt: 0.5,
                      bgcolor: getShiftColor(formData.shift).bg,
                      color: getShiftColor(formData.shift).color
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        ) : (
          // Form State
          <Stack spacing={2.5}>
            {conflictWarning && (
              <Alert 
                severity="warning" 
                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                icon={<WarningIcon />}
                onClose={() => setConflictWarning(null)}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Schedule Conflict Detected
                </Typography>
                <Typography sx={{ fontSize: '0.7rem' }}>
                  {conflictWarning.message}
                </Typography>
              </Alert>
            )}

            {/* Schedule Information Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {schedule?.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <MachineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Machine
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getMachineName()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <WOIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Work Order
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getWONumber()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getPartNo()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    Operation {schedule?.operation_seq}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Edit Form */}
            <Grid container spacing={1.5}>
              {/* Scheduled Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Scheduled Date *"
                  type="date"
                  size="small"
                  value={formData.scheduled_date}
                  onChange={(e) => handleChange('scheduled_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Status *</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    label="Status *"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {STATUS_OPTIONS.map((status) => {
                      const statusColors = getStatusColor(status);
                      return (
                        <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>
                          <Chip
                            label={status}
                            size="small"
                            sx={{ bgcolor: statusColors.bg, color: statusColors.color, fontSize: '0.65rem' }}
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              {/* Shift */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Shift *</InputLabel>
                  <Select
                    value={formData.shift}
                    onChange={(e) => handleChange('shift', e.target.value)}
                    label="Shift *"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {SHIFT_OPTIONS.map((shift) => {
                      const shiftColors = getShiftColor(shift);
                      return (
                        <MenuItem key={shift} value={shift} sx={{ fontSize: '0.75rem' }}>
                          <Chip
                            label={shift}
                            size="small"
                            sx={{ bgcolor: shiftColors.bg, color: shiftColors.color, fontSize: '0.65rem' }}
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              {/* Planned Quantity */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Planned Quantity *"
                  type="number"
                  size="small"
                  value={formData.planned_qty}
                  onChange={(e) => handleChange('planned_qty', e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>

              {/* Start Time */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Start Time *"
                  type="time"
                  size="small"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>

              {/* End Time */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="End Time *"
                  type="time"
                  size="small"
                  value={formData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>

              {/* Planned Hours (Auto-calculated) */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Planned Hours"
                  type="number"
                  size="small"
                  value={formData.planned_hours}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.75rem', bgcolor: COLORS.background.light }
                  }}
                  helperText="Auto-calculated from start and end time"
                  disabled
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Saving...' : 'Reschedule'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditProductionSchedule;