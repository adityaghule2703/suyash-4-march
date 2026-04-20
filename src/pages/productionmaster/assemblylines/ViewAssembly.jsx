import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Stack, Chip, Paper, Divider, Grid
} from '@mui/material';
import {
  Factory as FactoryIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  DateRange as DateRangeIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF'
};

const STATUS_COLORS = {
  'Active': { bg: '#D1FAE5', color: '#059669' },
  'Inactive': { bg: '#FEE2E2', color: '#DC2626' }
};

const LINE_TYPE_COLORS = {
  'Busbar': { bg: '#E8F0F1', color: COLORS.primary },
  'General': { bg: '#E0F2FE', color: '#0284C7' },
  'Assembly': { bg: '#FEF3C7', color: '#D97706' },
  'Testing': { bg: '#F3E8FF', color: '#9333EA' },
  'Packaging': { bg: '#D1FAE5', color: '#059669' }
};

const ViewAssembly = ({ open, onClose, assemblyLine, onEdit }) => {
  if (!assemblyLine) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? STATUS_COLORS['Active'] : STATUS_COLORS['Inactive'];
  };

  const getLineTypeColor = (lineType) => {
    return LINE_TYPE_COLORS[lineType] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircleIcon sx={{ fontSize: '1rem' }} /> : <CancelIcon sx={{ fontSize: '1rem' }} />;
  };

  const statusColors = getStatusColor(assemblyLine.is_active);
  const lineTypeColors = getLineTypeColor(assemblyLine.line_type);

  // Get person name from created_by/updated_by
  const getPersonName = (person) => {
    if (!person) return '—';
    if (typeof person === 'string') return person;
    if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
    if (person.FirstName) return person.FirstName;
    if (person.name) return person.name;
    if (person.Username) return person.Username;
    if (person.Email) return person.Email;
    return person._id?.slice(-6) || '—';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
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
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Assembly Line Details
        </Typography>
        <Chip
          icon={getStatusIcon(assemblyLine.is_active)}
          label={assemblyLine.is_active ? 'Active' : 'Inactive'}
          size="small"
          sx={{ 
            fontSize: '0.7rem', 
            fontWeight: 500, 
            height: 28, 
            bgcolor: statusColors.bg, 
            color: statusColors.color 
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Header Info */}
          <Paper sx={{ p: 1, bgcolor: COLORS.primaryLight, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FactoryIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Line Code
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary, fontFamily: 'monospace' }}>
                      {assemblyLine.line_code || `AL-${String(assemblyLine._id?.slice(-4) || '0001')}`}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Line Name
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {assemblyLine.line_name}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Line Details */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Line Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Line Type
                </Typography>
                <Chip
                  label={assemblyLine.line_type || '—'}
                  size="small"
                  sx={{ 
                    mt: 0.5, 
                    fontSize: '0.7rem', 
                    fontWeight: 500, 
                    bgcolor: lineTypeColors.bg, 
                    color: lineTypeColors.color 
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Work Centre
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary, mt: 0.5 }}>
                  {assemblyLine.work_centre || '—'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Description */}
          {assemblyLine.description && (
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Description
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                {assemblyLine.description}
              </Typography>
            </Paper>
          )}

          {/* Audit Information */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Audit Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Created By
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {getPersonName(assemblyLine.created_by)}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  {formatDate(assemblyLine.created_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Last Updated By
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {getPersonName(assemblyLine.updated_by)}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  {formatDate(assemblyLine.updated_at)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Info (if any) */}
          {(assemblyLine.capacity_per_hour || assemblyLine.efficiency_percentage || assemblyLine.line_supervisor) && (
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Additional Information
              </Typography>
              <Grid container spacing={1.5}>
                {assemblyLine.capacity_per_hour && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Capacity (per hour)
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {assemblyLine.capacity_per_hour.toLocaleString()} units
                    </Typography>
                  </Grid>
                )}
                {assemblyLine.efficiency_percentage && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Efficiency
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {assemblyLine.efficiency_percentage}%
                    </Typography>
                  </Grid>
                )}
                {assemblyLine.line_supervisor && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Line Supervisor
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {getPersonName(assemblyLine.line_supervisor)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
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
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            if (onEdit) onEdit();
          }}
          startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          Edit Assembly Line
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAssembly;