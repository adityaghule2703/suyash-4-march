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
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon
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

const CompleteProductionSchedule = ({ open, onClose, schedule, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  
  const [formData, setFormData] = useState({
    actual_hours: '',
    actual_qty: ''
  });

  // Initialize form with schedule data
  useEffect(() => {
    if (schedule && open) {
      setFormData({
        actual_hours: schedule.planned_hours || '',
        actual_qty: schedule.planned_qty || ''
      });
      setError('');
      setSuccess(false);
      setCompletionData(null);
    }
  }, [schedule, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user modifies form
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.actual_hours || formData.actual_hours <= 0) {
      setError('Please enter valid actual hours');
      return;
    }
    if (!formData.actual_qty || formData.actual_qty <= 0) {
      setError('Please enter valid actual quantity');
      return;
    }
    if (parseFloat(formData.actual_qty) > (schedule?.planned_qty || 0)) {
      setError(`Actual quantity cannot exceed planned quantity (${schedule?.planned_qty})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        actual_hours: parseFloat(formData.actual_hours),
        actual_qty: parseInt(formData.actual_qty)
      };

      const response = await axios.post(
        `${BASE_URL}/api/production-schedule/${schedule._id}/complete`,
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
        setCompletionData(response.data.data);
        
        // Call onComplete callback
        if (onComplete) {
          onComplete(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to complete production schedule');
      }
    } catch (err) {
      console.error('Error completing production schedule:', err);
      setError(err.response?.data?.message || 'Failed to complete production schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setCompletionData(null);
    setFormData({
      actual_hours: '',
      actual_qty: ''
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

  const getEfficiencyColor = (utilization) => {
    if (utilization >= 100) return { bg: '#D1FAE5', color: '#059669' };
    if (utilization >= 85) return { bg: '#E0F2FE', color: '#0284C7' };
    if (utilization >= 70) return { bg: '#FEF3C7', color: '#D97706' };
    return { bg: '#FEE2E2', color: '#DC2626' };
  };

  const calculateCompletionPercent = () => {
    if (!schedule?.planned_qty) return 0;
    return (parseFloat(formData.actual_qty) / schedule.planned_qty) * 100;
  };

  const calculateVariance = () => {
    const planned = schedule?.planned_hours || 0;
    const actual = parseFloat(formData.actual_hours) || 0;
    const variance = actual - planned;
    return {
      value: variance.toFixed(2),
      percent: planned > 0 ? ((variance / planned) * 100).toFixed(1) : 0,
      isPositive: variance > 0
    };
  };

  const variance = calculateVariance();

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
          <CheckCircleIcon sx={{ fontSize: '1.2rem', color: COLORS.success }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Complete Production Schedule
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && completionData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Production Completed Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                The production schedule has been marked as completed
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
                Completion Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <ScheduleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {completionData.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Planned Hours
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {completionData.planned_hours} hrs
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Actual Hours
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {completionData.actual_hours} hrs
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Utilization Card */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: getEfficiencyColor(completionData.utilization).bg, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TrendingUpIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule Utilization
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: getEfficiencyColor(completionData.utilization).color }}>
                    {completionData.utilization}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
                    Efficiency Rating
                  </Typography>
                  <Chip 
                    label={completionData.utilization >= 90 ? 'Excellent' : completionData.utilization >= 75 ? 'Good' : completionData.utilization >= 60 ? 'Average' : 'Needs Improvement'}
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem', 
                      mt: 0.5,
                      bgcolor: getEfficiencyColor(completionData.utilization).bg,
                      color: getEfficiencyColor(completionData.utilization).color,
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          // Form State
          <Stack spacing={2.5}>
            <Alert 
              severity="info" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Confirm Production Completion
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Please enter the actual production details to mark this schedule as completed.
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
              </Grid>
            </Paper>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Planned vs Actual Preview */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Planned vs Actual
              </Typography>
              <Grid container spacing={1.5}>
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

            {/* Form Fields */}
            <Grid container spacing={1.5}>
              {/* Actual Hours */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Actual Hours *"
                  type="number"
                  size="small"
                  value={formData.actual_hours}
                  onChange={(e) => handleChange('actual_hours', e.target.value)}
                  placeholder="Enter actual production hours"
                  inputProps={{ min: 0, step: 0.25 }}
                  helperText={`Planned: ${schedule?.planned_hours || 0} hours`}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>

              {/* Actual Quantity */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Actual Quantity *"
                  type="number"
                  size="small"
                  value={formData.actual_qty}
                  onChange={(e) => handleChange('actual_qty', e.target.value)}
                  placeholder="Enter actual produced quantity"
                  inputProps={{ min: 0, max: schedule?.planned_qty || 0 }}
                  helperText={`Planned: ${schedule?.planned_qty || 0} units`}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
            </Grid>

            {/* Live Calculation Preview */}
            {formData.actual_hours && formData.actual_qty && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  Live Calculation Preview
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Completion Rate</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.success }}>
                      {calculateCompletionPercent().toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Time Variance</Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      color: variance.isPositive ? COLORS.error : COLORS.success 
                    }}>
                      {variance.isPositive ? '+' : ''}{variance.value} hrs ({variance.isPositive ? '+' : ''}{variance.percent}%)
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Estimated Efficiency</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.info }}>
                      {schedule?.planned_hours > 0 
                        ? Math.min(100, ((parseFloat(formData.actual_qty) / schedule.planned_qty) * 
                            (schedule.planned_hours / parseFloat(formData.actual_hours)) * 100)).toFixed(1)
                        : 0}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

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
            startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.success,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1E5A2A' }
            }}
          >
            {loading ? 'Completing...' : 'Complete Production'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CompleteProductionSchedule;