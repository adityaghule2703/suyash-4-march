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
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
  Comment as CommentIcon,
  EventBusy as EventBusyIcon
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

// Predefined cancellation reasons
const CANCELLATION_REASONS = [
  { value: 'work_order_cancelled', label: 'Work Order Cancelled by Customer', icon: '📋' },
  { value: 'machine_breakdown', label: 'Machine Breakdown / Maintenance Issue', icon: '🔧' },
  { value: 'material_shortage', label: 'Material Shortage / Unavailable', icon: '📦' },
  { value: 'priority_change', label: 'Production Priority Changed', icon: '⚡' },
  { value: 'quality_issue', label: 'Quality Issue Detected', icon: '⚠️' },
  { value: 'operator_unavailable', label: 'Operator / Staff Unavailable', icon: '👥' },
  { value: 'power_outage', label: 'Power Outage / Utility Issue', icon: '💡' },
  { value: 'customer_request', label: 'Customer Requested Cancellation', icon: '👤' },
  { value: 'schedule_conflict', label: 'Schedule Conflict / Double Booking', icon: '📅' },
  { value: 'other', label: 'Other Reason', icon: '📝' }
];

const CancelProductionSchedule = ({ open, onClose, schedule, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cancellationData, setCancellationData] = useState(null);
  
  const [formData, setFormData] = useState({
    cancel_reason: '',
    custom_reason: '',
    reason_category: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    cancel_reason: ''
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (schedule && open) {
      setFormData({
        cancel_reason: '',
        custom_reason: '',
        reason_category: ''
      });
      setError('');
      setSuccess(false);
      setCancellationData(null);
      setValidationErrors({ cancel_reason: '' });
    }
  }, [schedule, open]);

  const handleReasonChange = (event) => {
    const selectedCategory = event.target.value;
    const selectedReason = CANCELLATION_REASONS.find(r => r.value === selectedCategory);
    
    setFormData({
      ...formData,
      reason_category: selectedCategory,
      cancel_reason: selectedCategory === 'other' ? '' : (selectedReason?.label || '')
    });
    
    // Clear validation error
    if (validationErrors.cancel_reason) {
      setValidationErrors({ ...validationErrors, cancel_reason: '' });
    }
  };

  const handleCustomReasonChange = (event) => {
    const customReason = event.target.value;
    setFormData({
      ...formData,
      custom_reason: customReason,
      cancel_reason: customReason
    });
    
    // Clear validation error
    if (validationErrors.cancel_reason) {
      setValidationErrors({ ...validationErrors, cancel_reason: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.cancel_reason || formData.cancel_reason.trim() === '') {
      errors.cancel_reason = 'Please provide a cancellation reason';
    } else if (formData.cancel_reason.length < 5) {
      errors.cancel_reason = 'Cancellation reason must be at least 5 characters';
    } else if (formData.cancel_reason.length > 500) {
      errors.cancel_reason = 'Cancellation reason cannot exceed 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        cancel_reason: formData.cancel_reason.trim()
      };

      const response = await axios.post(
        `${BASE_URL}/api/production-schedule/${schedule._id}/cancel`,
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
        setCancellationData(response.data.data);
        
        // Call onCancel callback
        if (onCancel) {
          onCancel(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to cancel production schedule');
      }
    } catch (err) {
      console.error('Error cancelling production schedule:', err);
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Cannot cancel this schedule. Only Planned, Confirmed, or Postponed schedules can be cancelled.');
      } else {
        setError(err.response?.data?.message || 'Failed to cancel production schedule. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setCancellationData(null);
    setFormData({
      cancel_reason: '',
      custom_reason: '',
      reason_category: ''
    });
    onClose();
  };

  const formatDate = (dateString) => {
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
      case 'Cancelled':
        return { bg: '#FEE2E2', color: '#DC2626' };
      case 'Confirmed':
        return { bg: '#D1FAE5', color: '#059669' };
      case 'In Progress':
        return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Planned':
        return { bg: '#E0E7FF', color: '#4F46E5' };
      case 'Postponed':
        return { bg: '#FEF3C7', color: '#D97706' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const isCancellable = () => {
    const cancellableStatuses = ['Planned', 'Confirmed', 'Postponed'];
    return cancellableStatuses.includes(schedule?.status);
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
          <CancelIcon sx={{ fontSize: '1.2rem', color: COLORS.error }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Cancel Production Schedule
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && cancellationData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Production Schedule Cancelled Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                The production schedule has been cancelled and removed from production queue
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 1.5 }}>
                Cancellation Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <ScheduleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {cancellationData.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <CancelIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Status
                  </Typography>
                  <Chip 
                    label={cancellationData.status}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      mt: 0.5,
                      bgcolor: getStatusColor(cancellationData.status).bg,
                      color: getStatusColor(cancellationData.status).color,
                      fontWeight: 600
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <EventBusyIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Cancelled At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(cancellationData.cancelled_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <CommentIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Cancelled By
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {cancellationData.cancelled_by || 'Current User'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <WarningIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Cancellation Reason
                  </Typography>
                  <Paper sx={{ 
                    p: 1.5, 
                    mt: 0.5, 
                    bgcolor: '#FEF2F2', 
                    borderRadius: 1,
                    border: `1px solid #FECACA`
                  }}>
                    <Typography sx={{ fontSize: '0.8rem', color: COLORS.error }}>
                      {cancellationData.cancel_reason}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* Impact Notification Card */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#FEF2F2', 
              borderRadius: 1.5, 
              border: `1px solid #FECACA` 
            }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 0.5 }}>
                    Schedule Cancelled
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    This schedule has been removed from production planning. 
                    Resources have been released and can be reassigned to other production slots.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          // Form State - Cancellation Form
          <Stack spacing={2.5}>
            {/* Status Check Alert */}
            {schedule && !isCancellable() && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                icon={<ErrorIcon />}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Cannot Cancel This Schedule
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                  Only schedules with status 'Planned', 'Confirmed', or 'Postponed' can be cancelled. 
                  Current status: <strong>{schedule.status}</strong>
                </Typography>
              </Alert>
            )}

            <Alert 
              severity="warning" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Warning: This Action Cannot Be Undone
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Cancelling this production schedule will remove it from the production queue. 
                Please provide a valid reason for cancellation for audit purposes.
              </Typography>
            </Alert>

            {/* Schedule Information Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Information
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

            {/* Cancellation Reason Form */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 1.5 }}>
                <CommentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Cancellation Reason (Required)
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
                    {CANCELLATION_REASONS.map((reason) => (
                      <MenuItem key={reason.value} value={reason.value} sx={{ fontSize: '0.8rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{reason.icon}</span>
                          <span>{reason.label}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ fontSize: '0.7rem' }}>
                    Select a category to auto-fill the cancellation reason
                  </FormHelperText>
                </FormControl>

                {formData.reason_category === 'other' && (
                  <TextField
                    fullWidth
                    label="Custom Cancellation Reason *"
                    multiline
                    rows={3}
                    size="small"
                    value={formData.custom_reason}
                    onChange={handleCustomReasonChange}
                    placeholder="Please provide detailed reason for cancellation..."
                    error={!!validationErrors.cancel_reason}
                    helperText={validationErrors.cancel_reason}
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
                    label="Cancellation Reason"
                    multiline
                    rows={2}
                    size="small"
                    value={formData.cancel_reason}
                    onChange={(e) => {
                      setFormData({ ...formData, cancel_reason: e.target.value });
                      if (validationErrors.cancel_reason) {
                        setValidationErrors({ ...validationErrors, cancel_reason: '' });
                      }
                    }}
                    placeholder="You can modify the auto-filled reason or add more details..."
                    error={!!validationErrors.cancel_reason}
                    helperText={validationErrors.cancel_reason || `${formData.cancel_reason.length}/500 characters`}
                    disabled={loading}
                    inputProps={{ maxLength: 500 }}
                    sx={{ 
                      '& .MuiInputBase-root': { fontSize: '0.8rem' },
                      '& .MuiInputLabel-root': { fontSize: '0.75rem' }
                    }}
                  />
                )}

                {!formData.reason_category && (
                  <Alert severity="info" sx={{ fontSize: '0.7rem', borderRadius: 1 }}>
                    Please select or enter a cancellation reason. This information is required for audit purposes.
                  </Alert>
                )}
              </Stack>
            </Paper>

            {/* Impact Assessment */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#FEF3C7', 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <WarningIcon sx={{ fontSize: '1.2rem', color: COLORS.warning, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.warning, mb: 0.5 }}>
                    Cancellation Impact
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                    Cancelling this schedule will have the following impact:
                  </Typography>
                  <Box component="ul" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, pl: 2, m: 0 }}>
                    <li>Machine capacity will be freed up for other schedules</li>
                    <li>Work order may need to be rescheduled</li>
                    <li>Material allocations will be released</li>
                    <li>Cancellation will be recorded in audit trail</li>
                    <li>Notifications will be sent to relevant stakeholders</li>
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
          {success ? 'Close' : 'Back'}
        </Button>
        {!success && isCancellable() && (
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={loading || !formData.cancel_reason.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <CancelIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.error,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#B71C1C' }
            }}
          >
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CancelProductionSchedule;