import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
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
  PlayArrow as PlayArrowIcon,
  Engineering as EngineeringIcon,
  Timer as TimerIcon
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

const StartProductionSchedule = ({ open, onClose, schedule, onStart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [startData, setStartData] = useState(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (schedule && open) {
      setError('');
      setSuccess(false);
      setStartData(null);
    }
  }, [schedule, open]);

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/production-schedule/${schedule._id}/start`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setStartData(response.data.data);
        
        // Call onStart callback
        if (onStart) {
          onStart(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to start production schedule');
      }
    } catch (err) {
      console.error('Error starting production schedule:', err);
      setError(err.response?.data?.message || 'Failed to start production schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setStartData(null);
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

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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
      case 'In Progress':
        return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Confirmed':
        return { bg: '#D1FAE5', color: '#059669' };
      case 'Pending':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Completed':
        return { bg: '#D1FAE5', color: '#059669' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const getProgressStatus = () => {
    if (!schedule) return 0;
    const plannedQty = schedule.planned_qty || 0;
    const completedQty = schedule.completed_qty || 0;
    if (plannedQty === 0) return 0;
    return (completedQty / plannedQty) * 100;
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
          <PlayArrowIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Start Production Schedule
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && startData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Production Started Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                The production schedule is now in progress
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Production Start Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <ScheduleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {startData.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <EngineeringIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Status
                  </Typography>
                  <Chip 
                    label={startData.status}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      mt: 0.5,
                      bgcolor: getStatusColor(startData.status).bg,
                      color: getStatusColor(startData.status).color,
                      fontWeight: 600
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimerIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Started At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(startData.started_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <PlayArrowIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Started By
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {startData.started_by || 'Current User'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Production Running Card */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <PlayArrowIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Production Status
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success }}>
                    In Progress
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
                    Started {formatTimeAgo(startData.started_at)}
                  </Typography>
                  <Chip 
                    label="Running"
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem', 
                      mt: 0.5,
                      bgcolor: COLORS.success,
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          // Form State - Start Confirmation Dialog
          <Stack spacing={2.5}>
            <Alert 
              severity="info" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Ready to Start Production?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Please review the schedule details before starting production. Once started, you can track the progress and record completion.
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
                    label={schedule?.status || 'Pending'}
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

            {/* Production Progress Preview (if any completed) */}
            {(schedule?.completed_qty > 0) && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.info, mb: 1.5 }}>
                  <TimelineIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Current Progress
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Completion: {schedule.completed_qty} / {schedule.planned_qty} units
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.info }}>
                      {getProgressStatus().toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    bgcolor: '#E5E7EB', 
                    borderRadius: 1, 
                    overflow: 'hidden',
                    height: '6px'
                  }}>
                    <Box sx={{ 
                      width: `${getProgressStatus()}%`, 
                      bgcolor: COLORS.info, 
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }} />
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Start Production Checklist */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#FFF9C4', 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <PlayArrowIcon sx={{ fontSize: '1.2rem', color: COLORS.warning, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.warning, mb: 0.5 }}>
                    Pre-Start Checklist
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                    Before starting production, please ensure:
                  </Typography>
                  <Box component="ul" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, pl: 2, m: 0 }}>
                    <li>Machine is operational and calibrated</li>
                    <li>Raw materials are available and ready</li>
                    <li>Quality check instruments are ready</li>
                    <li>Operator is assigned and trained</li>
                    <li>Safety protocols are in place</li>
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
        {!success && (
          <Button
            variant="contained"
            onClick={handleStart}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <PlayArrowIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Starting...' : 'Start Production'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StartProductionSchedule;