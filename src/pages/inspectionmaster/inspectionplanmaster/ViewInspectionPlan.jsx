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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Close as CloseIcon,
  Assignment as PlanIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  QrCode as QrCodeIcon,
  Settings as SettingsIcon
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
  planType: {
    Incoming: { bg: '#E0F2FE', color: '#0369A1' },
    'In-Process': { bg: '#FEF3C7', color: '#B45309' },
    Final: { bg: '#D1FAE5', color: '#065F46' },
    'Pre-Dispatch': { bg: '#F3E8FF', color: '#7E22CE' },
    'Customer-Specific': { bg: '#FFE4E6', color: '#BE123C' },
    Combined: { bg: '#FCE7F3', color: '#BE185D' }
  },
  characteristicType: {
    Dimensional: { bg: '#E0F2FE', color: '#0369A1' },
    Visual: { bg: '#F3E8FF', color: '#7E22CE' },
    Functional: { bg: '#D1FAE5', color: '#065F46' },
    Material: { bg: '#FEF3C7', color: '#B45309' },
    Surface: { bg: '#FFE4E6', color: '#BE123C' },
    Mechanical: { bg: '#FCE7F3', color: '#BE185D' },
    Electrical: { bg: '#E0F2FE', color: '#0369A1' },
    Chemical: { bg: '#D1FAE5', color: '#065F46' }
  }
};

const ViewInspectionPlan = ({ open, onClose, plan }) => {
  if (!plan) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanTypeChip = (planType) => {
    const colors = COLORS.planType[planType] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={planType}
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

  const getCharacteristicTypeChip = (type) => {
    const colors = COLORS.characteristicType[type] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={type}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: colors.bg,
          color: colors.color
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
            Inspection Plan Details
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
            Plan ID: {plan.plan_id}
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
              <PlanIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Plan Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Plan Name
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {plan.plan_name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Plan Code
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {plan.plan_code || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Plan Type
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getPlanTypeChip(plan.plan_type)}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Revision
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  Rev {plan.revision_no || 1} ({formatDate(plan.revision_date)})
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Item / Part No
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {plan.item_id?.part_no || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  AQL Level
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {plan.aql_level || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Sampling Plan
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {plan.sampling_plan || '-'}
                </Typography>
              </Grid>
            </Grid>
            {plan.instructions && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Instructions
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, mt: 0.5, fontStyle: 'italic' }}>
                  {plan.instructions}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Checkpoints Table */}
          <Paper sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, p: 1.5, pb: 0 }}>
              <QrCodeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Inspection Checkpoints
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.light }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Step</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Characteristic</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Type</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Specification</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Method</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Sample Size</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plan.checkpoints?.map((checkpoint, index) => (
                    <TableRow key={checkpoint._id || index} hover>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {checkpoint.sequence || checkpoint.step_no || index + 1}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {checkpoint.characteristic_name || checkpoint.characteristic}
                      </TableCell>
                      <TableCell>
                        {getCharacteristicTypeChip(checkpoint.characteristic_type)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {checkpoint.specification}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {checkpoint.method}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {checkpoint.sample_size}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {checkpoint.frequency}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!plan.checkpoints || plan.checkpoints.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          No checkpoints found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Audit Info */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              Created At: {formatDate(plan.createdAt)}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mt: 0.5 }}>
              Last Updated: {formatDate(plan.updatedAt)}
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

export default ViewInspectionPlan;