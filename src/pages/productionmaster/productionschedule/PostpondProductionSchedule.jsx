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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon,
  EventRepeat as EventRepeatIcon,
  Comment as CommentIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  BusinessCenter as ShiftIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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

// Shift options
const SHIFT_OPTIONS = [
  { value: 'Morning', label: 'Morning Shift', start: '08:00', end: '16:00' },
  { value: 'Afternoon', label: 'Afternoon Shift', start: '16:00', end: '00:00' },
  { value: 'Night', label: 'Night Shift', start: '00:00', end: '08:00' },
  { value: 'General', label: 'General Shift', start: '09:00', end: '17:00' },
  // { value: 'Custom', label: 'Custom Timing', start: '', end: '' }
];

// Postpone reasons
const POSTPONE_REASONS = [
  { value: 'machine_breakdown', label: 'Machine Breakdown / Maintenance'},
  { value: 'material_shortage', label: 'Material Shortage'},
  { value: 'operator_unavailability', label: 'Operator Unavailability'},
  { value: 'power_outage', label: 'Power Outage / Utility Issue'},
  { value: 'quality_issue', label: 'Quality Issue Detected'},
  { value: 'priority_change', label: 'Higher Priority Order'},
  { value: 'customer_request', label: 'Customer Request'},
  { value: 'tooling_issue', label: 'Tooling / Setup Issue' },
  { value: 'inspection_delay', label: 'Quality Inspection Delay' },
  { value: 'other', label: 'Other Reason'}
];

const PostponeProductionSchedule = ({ open, onClose, schedule, onPostpone }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [postponeData, setPostponeData] = useState(null);
  
  const [formData, setFormData] = useState({
    new_scheduled_date: null,
    new_shift: '',
    new_start_time: '',
    new_end_time: '',
    postpone_reason: '',
    reason_category: '',
    custom_reason: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showCustomTiming, setShowCustomTiming] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (schedule && open) {
      // Initialize with default shift timing
      const defaultShift = SHIFT_OPTIONS[0];
      setFormData({
        new_scheduled_date: new Date(),
        new_shift: defaultShift.value,
        new_start_time: defaultShift.start,
        new_end_time: defaultShift.end,
        postpone_reason: '',
        reason_category: '',
        custom_reason: ''
      });
      setShowCustomTiming(false);
      setError('');
      setSuccess(false);
      setPostponeData(null);
      setValidationErrors({});
    }
  }, [schedule, open]);

  const handleShiftChange = (event) => {
    const selectedShift = event.target.value;
    const shift = SHIFT_OPTIONS.find(s => s.value === selectedShift);
    
    setFormData({
      ...formData,
      new_shift: selectedShift,
      new_start_time: shift?.start || '',
      new_end_time: shift?.end || ''
    });
    
    setShowCustomTiming(selectedShift === 'Custom');
    
    // Clear validation errors for time fields
    if (validationErrors.new_start_time || validationErrors.new_end_time) {
      setValidationErrors({
        ...validationErrors,
        new_start_time: '',
        new_end_time: ''
      });
    }
  };

  const handleReasonChange = (event) => {
    const selectedCategory = event.target.value;
    const selectedReason = POSTPONE_REASONS.find(r => r.value === selectedCategory);
    
    setFormData({
      ...formData,
      reason_category: selectedCategory,
      postpone_reason: selectedCategory === 'other' ? '' : (selectedReason?.label || '')
    });
    
    // Clear validation error
    if (validationErrors.postpone_reason) {
      setValidationErrors({ ...validationErrors, postpone_reason: '' });
    }
  };

  const handleCustomReasonChange = (event) => {
    const customReason = event.target.value;
    setFormData({
      ...formData,
      custom_reason: customReason,
      postpone_reason: customReason
    });
    
    // Clear validation error
    if (validationErrors.postpone_reason) {
      setValidationErrors({ ...validationErrors, postpone_reason: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.new_scheduled_date) {
      errors.new_scheduled_date = 'Please select a new scheduled date';
    } else if (formData.new_scheduled_date < new Date()) {
      errors.new_scheduled_date = 'New scheduled date cannot be in the past';
    }
    
    if (!formData.new_shift) {
      errors.new_shift = 'Please select a shift';
    }
    
    if (!formData.new_start_time) {
      errors.new_start_time = 'Please specify start time';
    }
    
    if (!formData.new_end_time) {
      errors.new_end_time = 'Please specify end time';
    }
    
    if (formData.new_start_time && formData.new_end_time && 
        formData.new_start_time >= formData.new_end_time) {
      errors.new_end_time = 'End time must be after start time';
    }
    
    if (!formData.postpone_reason || formData.postpone_reason.trim() === '') {
      errors.postpone_reason = 'Please provide a reason for postponement';
    } 
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostpone = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Format date to YYYY-MM-DD
      const formattedDate = formData.new_scheduled_date.toISOString().split('T')[0];
      
      const payload = {
        new_scheduled_date: formattedDate,
        new_shift: formData.new_shift,
        new_start_time: formData.new_start_time,
        new_end_time: formData.new_end_time,
        postpone_reason: formData.postpone_reason.trim()
      };

      const response = await axios.post(
        `${BASE_URL}/api/production-schedule/${schedule._id}/postpone`,
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
        setPostponeData(response.data.data);
        
        // Call onPostpone callback
        if (onPostpone) {
          onPostpone(response.data.data);
        }
        
        // Auto close after 3 seconds on success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to postpone production schedule');
      }
    } catch (err) {
      console.error('Error postponing production schedule:', err);
      if (err.response?.status === 409) {
        setError(err.response?.data?.message || 'Schedule conflict detected on the new date/time. Please choose a different time slot.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Cannot postpone this schedule. Only Planned, Confirmed, or In Progress schedules can be postponed.');
      } else {
        setError(err.response?.data?.message || 'Failed to postpone production schedule. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setPostponeData(null);
    setFormData({
      new_scheduled_date: null,
      new_shift: '',
      new_start_time: '',
      new_end_time: '',
      postpone_reason: '',
      reason_category: '',
      custom_reason: ''
    });
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

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMachineName = () => {
    if (typeof schedule?.machine_id === 'object') {
      return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
    }
    return schedule?.machine_id || '-';
  };

  const getMachineCode = () => {
    if (typeof schedule?.machine_id === 'object') {
      return schedule.machine_id?.machine_code || '-';
    }
    return '-';
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Postponed':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Planned':
        return { bg: '#E0E7FF', color: '#4F46E5' };
      case 'Confirmed':
        return { bg: '#D1FAE5', color: '#059669' };
      case 'In Progress':
        return { bg: '#E0F2FE', color: '#0284C7' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const isPostponable = () => {
    const postponableStatuses = ['Planned', 'Confirmed', 'In Progress'];
    return postponableStatuses.includes(schedule?.status);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <EventRepeatIcon sx={{ fontSize: '1.2rem', color: COLORS.warning }} />
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Postpone Production Schedule
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          {success && postponeData ? (
            // Success State
            <Stack spacing={2}>
              <Alert 
                severity="success" 
                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                icon={<CheckCircleIcon />}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Schedule Postponed Successfully!
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                  Original schedule has been marked as postponed and a new schedule has been created
                </Typography>
              </Alert>

              {/* Original Slot Information */}
              <Paper sx={{ p: 2, bgcolor: '#FEF3C7', borderRadius: 1.5, border: `1px solid #FDE68A` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.warning, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningIcon sx={{ fontSize: '0.9rem' }} />
                  Original Schedule (Postponed)
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                      {postponeData.original_slot.schedule_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip 
                      label={postponeData.original_slot.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        mt: 0.5,
                        bgcolor: getStatusColor(postponeData.original_slot.status).bg,
                        color: getStatusColor(postponeData.original_slot.status).color,
                        fontWeight: 600
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Original Date</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {formatDate(postponeData.original_slot.original_date)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Postpone Reason</Typography>
                    <Paper sx={{ p: 1, mt: 0.5, bgcolor: '#FEF2F2', borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem' }}>
                        {postponeData.original_slot.postpone_reason}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* New Slot Information */}
              <Paper sx={{ p: 2, bgcolor: '#E0E7FF', borderRadius: 1.5, border: `1px solid #C7D2FE` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: '0.9rem' }} />
                  New Schedule (Planned)
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                      {postponeData.new_slot.schedule_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip 
                      label={postponeData.new_slot.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        mt: 0.5,
                        bgcolor: getStatusColor(postponeData.new_slot.status).bg,
                        color: getStatusColor(postponeData.new_slot.status).color,
                        fontWeight: 600
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      <DateRangeIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                      New Date
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {formatDate(postponeData.new_slot.scheduled_date)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      <ShiftIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Shift
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {postponeData.new_slot.shift}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      <AccessTimeIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Start Time
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {postponeData.new_slot.start_time}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      <AccessTimeIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                      End Time
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {postponeData.new_slot.end_time}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          ) : (
            // Form State - Postpone Form
            <Stack spacing={2.5}>
              {/* Status Check Alert */}
              {schedule && !isPostponable() && (
                <Alert 
                  severity="error" 
                  sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                  icon={<WarningIcon />}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    Cannot Postpone This Schedule
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                    Only schedules with status 'Planned', 'Confirmed', or 'In Progress' can be postponed. 
                    Current status: <strong>{schedule.status}</strong>
                  </Typography>
                </Alert>
              )}

              <Alert 
                severity="info" 
                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                icon={<EventRepeatIcon />}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Postpone Operation
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                  This will mark the current schedule as 'Postponed' and create a new schedule with 'Planned' status on the selected date/time.
                </Typography>
              </Alert>

              {/* Schedule Information Summary */}
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Original Schedule Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                      {schedule?.schedule_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Status</Typography>
                    <Chip 
                      label={schedule?.status || 'Unknown'}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        mt: 0.5,
                        bgcolor: getStatusColor(schedule?.status).bg,
                        color: getStatusColor(schedule?.status).color,
                        fontWeight: 600
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {formatDate(schedule?.scheduled_date)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      <MachineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Machine
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {getMachineName()} ({getMachineCode()})
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {schedule?.planned_hours || 0} hrs
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {schedule?.planned_qty || 0} units
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ borderColor: COLORS.border }} />

              {/* New Schedule Details */}
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <EventRepeatIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  New Schedule Details
                </Typography>
                
                <Stack spacing={2}>
                  {/* New Scheduled Date */}
                  <DatePicker
                    label="New Scheduled Date *"
                    value={formData.new_scheduled_date}
                    onChange={(newValue) => {
                      setFormData({ ...formData, new_scheduled_date: newValue });
                      if (validationErrors.new_scheduled_date) {
                        setValidationErrors({ ...validationErrors, new_scheduled_date: '' });
                      }
                    }}
                    minDate={new Date()}
                    disabled={loading}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!validationErrors.new_scheduled_date,
                        helperText: validationErrors.new_scheduled_date,
                        sx: { '& .MuiInputBase-root': { fontSize: '0.8rem' } }
                      }
                    }}
                  />

                  {/* Shift Selection */}
                  <FormControl fullWidth size="small" error={!!validationErrors.new_shift}>
                    <InputLabel id="shift-label">Select Shift *</InputLabel>
                    <Select
                      labelId="shift-label"
                      value={formData.new_shift}
                      onChange={handleShiftChange}
                      label="Select Shift *"
                      disabled={loading}
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {SHIFT_OPTIONS.map((shift) => (
                        <MenuItem key={shift.value} value={shift.value} sx={{ fontSize: '0.8rem' }}>
                          {shift.label} {shift.start && shift.end && `(${shift.start} - ${shift.end})`}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.new_shift && (
                      <FormHelperText sx={{ fontSize: '0.7rem' }}>{validationErrors.new_shift}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Custom Timing or Standard Timing Display */}
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Start Time *"
                        type="time"
                        size="small"
                        value={formData.new_start_time}
                        onChange={(e) => {
                          setFormData({ ...formData, new_start_time: e.target.value });
                          if (validationErrors.new_start_time) {
                            setValidationErrors({ ...validationErrors, new_start_time: '' });
                          }
                        }}
                        disabled={loading || (!showCustomTiming && formData.new_shift !== 'Custom')}
                        error={!!validationErrors.new_start_time}
                        helperText={validationErrors.new_start_time}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.8rem' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="End Time *"
                        type="time"
                        size="small"
                        value={formData.new_end_time}
                        onChange={(e) => {
                          setFormData({ ...formData, new_end_time: e.target.value });
                          if (validationErrors.new_end_time) {
                            setValidationErrors({ ...validationErrors, new_end_time: '' });
                          }
                        }}
                        disabled={loading || (!showCustomTiming && formData.new_shift !== 'Custom')}
                        error={!!validationErrors.new_end_time}
                        helperText={validationErrors.new_end_time}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.8rem' } }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>

              {/* Postpone Reason */}
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.warning, mb: 1.5 }}>
                  <CommentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Postpone Reason (Required)
                </Typography>
                
                <Stack spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="reason-category-label">Select Reason Category</InputLabel>
                    <Select
                      labelId="reason-category-label"
                      value={formData.reason_category}
                      onChange={handleReasonChange}
                      label="Select Reason Category"
                      disabled={loading}
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {POSTPONE_REASONS.map((reason) => (
                        <MenuItem key={reason.value} value={reason.value} sx={{ fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{reason.icon}</span>
                            <span>{reason.label}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ fontSize: '0.7rem' }}>
                      Select a category to auto-fill the postpone reason
                    </FormHelperText>
                  </FormControl>

                  {formData.reason_category === 'other' && (
                    <TextField
                      fullWidth
                      label="Custom Postpone Reason *"
                      multiline
                      rows={3}
                      size="small"
                      value={formData.custom_reason}
                      onChange={handleCustomReasonChange}
                      placeholder="Please provide detailed reason for postponement..."
                      error={!!validationErrors.postpone_reason}
                      helperText={validationErrors.postpone_reason}
                      disabled={loading}
                      sx={{ 
                        '& .MuiInputBase-root': { fontSize: '0.8rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.75rem' }
                      }}
                    />
                  )}

                  {formData.reason_category && formData.reason_category !== 'other' && (
                    <TextField
                      fullWidth
                      label="Postpone Reason"
                      multiline
                      rows={2}
                      size="small"
                      value={formData.postpone_reason}
                      onChange={(e) => {
                        setFormData({ ...formData, postpone_reason: e.target.value });
                        if (validationErrors.postpone_reason) {
                          setValidationErrors({ ...validationErrors, postpone_reason: '' });
                        }
                      }}
                      placeholder="You can modify the auto-filled reason or add more details..."
                      error={!!validationErrors.postpone_reason}
                     
                      disabled={loading}
                      
                      sx={{ 
                        '& .MuiInputBase-root': { fontSize: '0.8rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.75rem' }
                      }}
                    />
                  )}

                  {!formData.reason_category && (
                    <Alert severity="info" sx={{ fontSize: '0.7rem', borderRadius: 1 }}>
                      Please select or enter a postpone reason. This information is required for audit and planning purposes.
                    </Alert>
                  )}
                </Stack>
              </Paper>

              {/* Impact Notification */}
              <Paper sx={{ 
                p: 2, 
                bgcolor: '#FEF3C7', 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}` 
              }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <EventRepeatIcon sx={{ fontSize: '1.2rem', color: COLORS.warning, mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.warning, mb: 0.5 }}>
                      Postpone Impact
                  </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                      Postponing this schedule will:
                    </Typography>
                    <Box component="ul" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, pl: 2, m: 0 }}>
                      <li>Mark current schedule as 'Postponed' with reason for audit trail</li>
                      <li>Create a new schedule with 'Planned' status on the new date/time</li>
                      <li>Check for conflicts on the new schedule automatically</li>
                      <li>Maintain all work order and machine assignments</li>
                      <li>Notify relevant stakeholders about the change</li>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

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
          {!success && isPostponable() && (
            <Button
              variant="contained"
              onClick={handlePostpone}
              disabled={loading || !formData.new_scheduled_date || !formData.new_shift || !formData.postpone_reason}
              startIcon={loading ? <CircularProgress size={16} /> : <EventRepeatIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.warning,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: '#E65100' }
              }}
            >
              {loading ? 'Postponing...' : 'Postpone Schedule'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default PostponeProductionSchedule;