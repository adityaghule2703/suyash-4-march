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
  LocalShipping as LocalShippingIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon
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
    Draft: { bg: '#FEF3C7', color: '#B45309' },
    Confirmed: { bg: '#D1FAE5', color: '#065F46' },
    'In Transit': { bg: '#E0F2FE', color: '#0369A1' },
    Delivered: { bg: '#D1FAE5', color: '#065F46' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B' }
  }
};

const ViewDeliverySchedule = ({ open, onClose, schedule }) => {
  if (!schedule) return null;

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

  const getVehicleTypeChip = (vehicleType) => {
    const colors = {
      'Regular': { bg: '#E0F2FE', color: '#0369A1' },
      'Over Dimensional Cargo (ODC)': { bg: '#FEF3C7', color: '#B45309' },
      'Water Vessel': { bg: '#D1FAE5', color: '#065F46' },
      'Air Cargo': { bg: '#F3E8FF', color: '#7E22CE' }
    };
    const style = colors[vehicleType] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={vehicleType}
        size="small"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 500,
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
            Delivery Schedule Details
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
            Schedule ID: {schedule.schedule_id}
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
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Dispatch Date
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mt: 0.5 }}>
                  {formatDate(schedule.dispatch_date)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  SO Number
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mt: 0.5 }}>
                  {schedule.so_number}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getStatusChip(schedule.status)}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Customer & Shipping Info */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Customer ID
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {schedule.customer_id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Shipping Address ID
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {schedule.shipping_address_id}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Transport Info */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Transport Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Transporter
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary, mt: 0.5 }}>
                  {schedule.transporter_preference || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Vehicle Type
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getVehicleTypeChip(schedule.vehicle_type)}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Total Scheduled Qty
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary, mt: 0.5 }}>
                  {schedule.total_scheduled_qty || 0}
                </Typography>
              </Grid>
            </Grid>
            {schedule.special_instructions && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Special Instructions
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, mt: 0.5, fontStyle: 'italic' }}>
                  {schedule.special_instructions}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Items Table */}
          <Paper sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, p: 1.5, pb: 0 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Items
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.light }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Part No</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Part Name</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Scheduled Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Available FG Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedule.items?.map((item, index) => (
                    <TableRow key={item._id || index} hover>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {item.part_no}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {item.part_name}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }} align="right">
                        {item.scheduled_qty || 0}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary }} align="right">
                        {item.available_fg_qty || 0}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                        {item.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!schedule.items || schedule.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          No items found
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
              Created At: {formatDate(schedule.createdAt)}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mt: 0.5 }}>
              Last Updated: {formatDate(schedule.updatedAt)}
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

export default ViewDeliverySchedule;