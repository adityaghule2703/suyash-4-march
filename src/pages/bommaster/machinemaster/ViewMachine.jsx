// ViewMachine.jsx
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
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { COLORS, MACHINE_STATUS_COLORS, MACHINE_TYPE_COLORS, CAPACITY_UNIT_OPTIONS } from './constants';

const ViewMachine = ({ open, onClose, machine }) => {
  if (!machine) return null;

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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Idle':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Under Maintenance':
        return <BuildIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
      case 'Breakdown':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };

  const getStatusColor = (status) => {
    return MACHINE_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getTypeColor = (type) => {
    return MACHINE_TYPE_COLORS[type] || { bg: '#F1F5F9', color: '#475569' };
  };

  const statusColors = getStatusColor(machine.status);
  const typeColors = getTypeColor(machine.machine_type);
  const totalHoursPerDay = (machine.shifts_per_day || 0) * (machine.hours_per_shift || 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Machine Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Header Section */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}` 
          }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {machine.machine_name}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {machine.machine_code}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip
                      icon={getStatusIcon(machine.status)}
                      label={machine.status || 'Active'}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: statusColors.bg,
                        color: statusColors.color,
                        '& .MuiChip-icon': {
                          fontSize: '0.8rem'
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(machine.created_at)}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Basic Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Type</Typography>
                <Chip
                  label={machine.machine_type || '-'}
                  size="small"
                  sx={{ 
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    mt: 0.5,
                    bgcolor: typeColors.bg,
                    color: typeColors.color
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.work_centre || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <LocationIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Location
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.location || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Capacity & Schedule */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <SettingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Capacity & Schedule
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Capacity</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  {machine.capacity_value} {machine.capacity_unit}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shifts per Day</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.shifts_per_day || 0}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Hours per Shift</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.hours_per_shift || 0} hrs</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Available Hours/Day</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>
                  {totalHoursPerDay} hrs
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>OEE Target</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.oee_target_percent || 0}%</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Technical Details */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Technical Details
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Make</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.make || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Model</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.model || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Serial Number</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{machine.serial_number || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Installation Date
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(machine.installation_date)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <MoneyIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Operating Cost (per hour)
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  ₹{machine.operating_cost_per_hour || 0}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  <MoneyIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Maintenance Cost (per hour)
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  ₹{machine.maintenance_cost_per_hour || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Additional Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine ID</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{machine.machine_id}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Is Active</Typography>
                <Chip
                  label={machine.is_active ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{ 
                    fontSize: '0.6rem',
                    height: 20,
                    bgcolor: machine.is_active ? '#D1FAE5' : '#FEE2E2',
                    color: machine.is_active ? '#059669' : '#DC2626'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
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

export default ViewMachine;