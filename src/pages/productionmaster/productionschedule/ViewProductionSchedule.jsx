// ViewProductionSchedule.jsx
import React from 'react';
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
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Factory as MachineIcon,
  Assignment as WOrderIcon,
  DateRange as DateIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
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

const ViewProductionSchedule = ({ open, onClose, schedule }) => {
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
      case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
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

  const statusColors = getStatusColor(schedule.status);
  const shiftColors = getShiftColor(schedule.shift);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <ScheduleIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Production Schedule Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Header Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {schedule.schedule_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                <Chip
                  label={schedule.status}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    mt: 0.5,
                    bgcolor: statusColors.bg,
                    color: statusColors.color
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Machine Information */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <MachineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Machine Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.machine_id === 'object' 
                    ? schedule.machine_id?.machine_name 
                    : schedule.machine_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.machine_id === 'object' 
                    ? schedule.machine_id?.machine_code 
                    : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Work Order Information */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <WOrderIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Work Order Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.wo_id === 'object' 
                    ? schedule.wo_id?.wo_number 
                    : schedule.wo_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.part_no || (typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_no : '-')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Name</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {typeof schedule.wo_id === 'object' ? schedule.wo_id?.part_name || '-' : '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  Operation {schedule.operation_seq}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.planned_qty}
                </Typography>
              </Grid>
              {typeof schedule.wo_id === 'object' && schedule.wo_id?.priority && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Priority</Typography>
                  <Chip
                    label={schedule.wo_id?.priority}
                    size="small"
                    sx={{ fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Schedule Details */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <DateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Schedule Details
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {formatDate(schedule.scheduled_date)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift</Typography>
                <Chip
                  label={schedule.shift}
                  size="small"
                  sx={{ fontSize: '0.7rem', mt: 0.5, bgcolor: shiftColors.bg, color: shiftColors.color }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.planned_hours} hours
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Start Time</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.start_time}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>End Time</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {schedule.end_time}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Actual Production (if completed) */}
          {schedule.actual_hours > 0 && (
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle', color: COLORS.success }} />
                Actual Production
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Hours</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {schedule.actual_hours} hours
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Quantity</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {schedule.actual_qty || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Variance</Typography>
                  <Typography sx={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 500, 
                    color: schedule.actual_hours > schedule.planned_hours ? '#DC2626' : '#059669' 
                  }}>
                    {schedule.actual_hours > schedule.planned_hours ? '+' : ''}
                    {(schedule.actual_hours - schedule.planned_hours).toFixed(2)} hours
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Conflict Warning */}
          {schedule.conflict && (
            <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                <WarningIcon sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Conflict Detected
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                This schedule overlaps with another production schedule on the same machine.
                Please review and resolve the conflict.
              </Typography>
            </Alert>
          )}

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Timestamps */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>
              {formatDateTime(schedule.createdAt)}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created By</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>
              {typeof schedule.created_by === 'object' ? schedule.created_by?.username : schedule.created_by || '-'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
              {formatDateTime(schedule.updatedAt)}
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end'
      }}>
        <Button
          onClick={onClose}
          size="small"
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

export default ViewProductionSchedule;