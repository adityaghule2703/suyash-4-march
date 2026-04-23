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
  TrendingUp as TrendingUpIcon,
  ConfirmationNumber as ConfirmationIcon
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

const ConfirmedProductionSchedule = ({ open, onClose, schedule, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (schedule && open) {
      setError('');
      setSuccess(false);
      setConfirmationData(null);
    }
  }, [schedule, open]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/production-schedule/${schedule._id}/confirm`,
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
        setConfirmationData(response.data.data);
        
        // Call onConfirm callback
        if (onConfirm) {
          onConfirm(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to confirm production schedule');
      }
    } catch (err) {
      console.error('Error confirming production schedule:', err);
      setError(err.response?.data?.message || 'Failed to confirm production schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setConfirmationData(null);
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
      case 'Confirmed':
        return { bg: '#D1FAE5', color: '#059669' };
      case 'Pending':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Completed':
        return { bg: '#E0F2FE', color: '#0284C7' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
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
          <ConfirmationIcon sx={{ fontSize: '1.2rem', color: COLORS.success }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Confirm Production Schedule
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && confirmationData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Production Schedule Confirmed Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                The production schedule has been confirmed and is ready for execution
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
                Confirmation Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <ScheduleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Schedule ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {confirmationData.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <ConfirmationIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Status
                  </Typography>
                  <Chip 
                    label={confirmationData.status}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      mt: 0.5,
                      bgcolor: getStatusColor(confirmationData.status).bg,
                      color: getStatusColor(confirmationData.status).color,
                      fontWeight: 600
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Confirmed At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(confirmationData.confirmed_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <CheckCircleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Confirmed By
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {confirmationData.confirmed_by || 'Current User'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Confirmation Message Card */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#E8F5E9', 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TrendingUpIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Confirmation Status
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success }}>
                    Ready for Production
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>
                    Production can now begin
                  </Typography>
                  <Chip 
                    label="Confirmed"
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
          // Form State - Confirmation Dialog
          <Stack spacing={2.5}>
            <Alert 
              severity="warning" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Please Confirm Production Schedule
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Review the schedule details below before confirming. This action cannot be undone.
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

            {/* Confirmation Warning Box */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#FFF3E0', 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <WarningIcon sx={{ fontSize: '1.2rem', color: COLORS.warning, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.warning, mb: 0.5 }}>
                    Confirmation Notice
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    By confirming this production schedule, you acknowledge that:
                  </Typography>
                  <Box component="ul" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1, pl: 2 }}>
                    <li>All resources and materials are available</li>
                    <li>The machine is ready for production</li>
                    <li>Work order details have been verified</li>
                    <li>This schedule is ready to be executed</li>
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
            onClick={handleConfirm}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <ConfirmationIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Confirming...' : 'Confirm Schedule'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmedProductionSchedule;