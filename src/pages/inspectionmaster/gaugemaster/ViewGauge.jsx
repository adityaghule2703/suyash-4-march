import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Close as CloseIcon,
  Straighten as GaugeIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const ViewGauge = ({ open, onClose, gauge }) => {
  if (!gauge) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    const colors = {
      Calibrated: { bg: '#D1FAE5', color: '#065F46' },
      'Due for Calibration': { bg: '#FEF3C7', color: '#B45309' },
      Overdue: { bg: '#FEE2E2', color: '#991B1B' }
    };
    const style = colors[status] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 600,
          height: 26,
          bgcolor: style.bg,
          color: style.color
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Gauge Details
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
            Code: {gauge.gauge_code || gauge.gauge_id}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Basic Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <GaugeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Gauge Name
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.gauge_name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Gauge Type
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.gauge_type}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Make
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.make}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Model
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.model}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Serial No
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.serial_no}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Technical Details */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <SettingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Technical Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Range
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.range}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Least Count
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.least_count}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Accuracy
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.accuracy}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Location
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.location}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Department
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.department}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Custodian
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.custodian_id || 'Not assigned'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Calibration Details */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Calibration Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Last Calibration Date
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {formatDate(gauge.last_calibration_date)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Next Calibration Date
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {formatDate(gauge.next_calibration_date)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Calibration Frequency
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.calibration_frequency_days} days
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Calibration Agency
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.calibration_agency}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  NABL Accredited
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge.nabl_accredited ? 'Yes' : 'No'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getStatusChip(gauge.status)}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* MSA Details */}
          {gauge.msa_required && (
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <PeopleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                MSA (Measurement System Analysis)
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Gage R&R (%)
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                    {gauge.gage_r_and_r_percent ? `${gauge.gage_r_and_r_percent}%` : '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Bias
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                    {gauge.bias || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Linearity
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                    {gauge.linearity || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Audit Info */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              Created At: {formatDate(gauge.createdAt)}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mt: 0.5 }}>
              Last Updated: {formatDate(gauge.updatedAt)}
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewGauge;