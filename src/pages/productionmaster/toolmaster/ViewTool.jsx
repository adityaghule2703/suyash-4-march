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
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon
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
  border: '#E3E8EF',
  status: {
    Active: { bg: '#D1FAE5', color: '#065F46' },
    'Under Maintenance': { bg: '#FEF3C7', color: '#B45309' },
    Scrapped: { bg: '#FEE2E2', color: '#991B1B' },
    'In Use': { bg: '#E0F2FE', color: '#0369A1' },
    Retired: { bg: '#F1F5F9', color: '#475569' }
  }
};

const ViewTool = ({ open, onClose, tool }) => {
  if (!tool) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    const colors = COLORS.status[status] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 600,
          height: 26,
          bgcolor: colors.bg,
          color: colors.color
        }}
      />
    );
  };

  const getUsagePercentage = () => {
    if (!tool.max_shots || tool.max_shots === 0) return 0;
    return (tool.current_shots / tool.max_shots) * 100;
  };

  const needsMaintenance = tool.current_shots >= tool.next_maintenance_due_shots;
  const needsReplacement = tool.current_shots >= tool.max_shots;

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
            Tool Details
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
            Code: {tool.tool_code}
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
          {/* Header Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Tool Name
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.tool_name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Tool Type
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={tool.tool_type}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getStatusChip(tool.status)}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Produces Part No
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.produces_part_no || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Usage Section */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Usage & Maintenance
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Shots Used: {tool.current_shots?.toLocaleString() || 0} / {tool.max_shots?.toLocaleString() || 0}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: getUsagePercentage() >= 90 ? '#EF4444' : getUsagePercentage() >= 75 ? '#F59E0B' : '#10B981' }}>
                  {getUsagePercentage().toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(getUsagePercentage(), 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getUsagePercentage() >= 90 ? '#EF4444' : getUsagePercentage() >= 75 ? '#F59E0B' : '#10B981',
                    borderRadius: 3
                  }
                }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Max Shots
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.max_shots?.toLocaleString() || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Maintenance Interval
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.maintenance_interval_shots?.toLocaleString() || '-'} shots
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Next Maintenance Due
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.next_maintenance_due_shots?.toLocaleString() || '-'} shots
                </Typography>
              </Grid>
            </Grid>

            {(needsMaintenance || needsReplacement) && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: needsReplacement ? '#FEE2E2' : '#FEF3C7', borderRadius: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WarningIcon sx={{ fontSize: '1rem', color: needsReplacement ? '#991B1B' : '#B45309' }} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: needsReplacement ? '#991B1B' : '#B45309' }}>
                    {needsReplacement ? 'Tool has reached its maximum life and needs replacement!' : 'Maintenance is due for this tool!'}
                  </Typography>
                </Stack>
              </Box>
            )}
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
                  Tool Material
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.tool_material || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Tool Size
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.tool_size || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Tool Weight
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.tool_weight_kg ? `${tool.tool_weight_kg} kg` : '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Drawing No / Revision
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.drawing_no || '-'} / {tool.drawing_revision || '-'}
                </Typography>
              </Grid>
            </Grid>

            {tool.description && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Description
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.description}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Cost & Location */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <AttachMoneyIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Cost & Location
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Tool Cost
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  ₹{tool.tool_cost?.toLocaleString() || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Cost Per Shot
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  ₹{tool.cost_per_shot?.toFixed(2) || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Refurbishment Cost
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  ₹{tool.refurbishment_cost?.toLocaleString() || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Manufactured By
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.manufactured_by || '-'}
                  {tool.vendor_name && ` (${tool.vendor_name})`}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Bin Location
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {tool.bin_location || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Audit Info */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              Created At: {formatDate(tool.createdAt)}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mt: 0.5 }}>
              Last Updated: {formatDate(tool.updatedAt)}
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

export default ViewTool;