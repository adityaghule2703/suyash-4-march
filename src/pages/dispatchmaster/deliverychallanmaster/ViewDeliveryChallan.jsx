import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Avatar,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import {
  Print as PrintIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  status: {
    Planned: { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
    Dispatched: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    Delivered: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
    'Rejected by Customer': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
  }
};

const ViewDeliveryChallan = ({ open, onClose, deliveryChallan }) => {
  if (!deliveryChallan) return null;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '—';
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${amount.toLocaleString('en-IN')}` : '—';
  };

  const getStatusChip = (status) => {
    const colors = COLORS.status[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 500,
          height: 28,
          bgcolor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`
        }}
      />
    );
  };

  const handlePrint = () => {
    window.open(`${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/print`, '_blank');
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
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Delivery Challan Details
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ textTransform: 'none', fontSize: '0.7rem' }}
          >
            Print
          </Button>
         
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: COLORS.background.white }}>
        <Stack spacing={3}>
          {/* Header Information */}
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', bgcolor: COLORS.background.light }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>DC Number</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                    {deliveryChallan.dc_number}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>DC Date</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {formatDate(deliveryChallan.dc_date)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>SO Number</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {deliveryChallan.so_number}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                  {getStatusChip(deliveryChallan.status)}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Customer Information */}
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <CardContent>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Customer Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 48, height: 48, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                      {deliveryChallan.customer_name?.charAt(0) || 'C'}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>{deliveryChallan.customer_name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                        GSTIN: {deliveryChallan.customer_gstin || 'Not Available'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 0.5 }}>DC Type</Typography>
                  <Chip
                    label={deliveryChallan.dc_type}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Shipping Address */}
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <CardContent>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Shipping Address
              </Typography>
              
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {deliveryChallan.ship_to?.line1}<br />
                  {deliveryChallan.ship_to?.line2 && <>{deliveryChallan.ship_to.line2}<br /></>}
                  {deliveryChallan.ship_to?.city}, {deliveryChallan.ship_to?.district}<br />
                  {deliveryChallan.ship_to?.state} - {deliveryChallan.ship_to?.pincode}<br />
                  {deliveryChallan.ship_to?.country}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
          
          {/* Items Table */}
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none', overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, p: 2, pb: 0 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Items Dispatched
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>HSN Code</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryChallan.items?.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_name}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.hsn_code}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{item.dispatch_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.unit}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {formatCurrency(item.taxable_value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Totals */}
              <Box sx={{ p: 2, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
                <Stack direction="row" justifyContent="flex-end" spacing={4}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Taxable Value</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {formatCurrency(deliveryChallan.items?.reduce((sum, item) => sum + (item.taxable_value || 0), 0))}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Grand Total</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {formatCurrency(deliveryChallan.items?.reduce((sum, item) => sum + (item.taxable_value || 0), 0))}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
          
          {/* Packing Information */}
          {deliveryChallan.packing && (deliveryChallan.packing.no_of_packages > 0 || deliveryChallan.packing.gross_weight_kg > 0) && (
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  Packing Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>No. of Packages</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.packing.no_of_packages || '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Gross Weight</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.packing.gross_weight_kg} kg</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Net Weight</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.packing.net_weight_kg} kg</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Packing Type</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.packing.packing_type || '—'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          {/* Transport Information */}
          {deliveryChallan.transport && deliveryChallan.transport.dispatch_mode && (
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  Transport Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Dispatch Mode</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.transport.dispatch_mode}</Typography>
                  </Grid>
                  {deliveryChallan.transport.transporter_name && (
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Transporter</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.transport.transporter_name}</Typography>
                    </Grid>
                  )}
                  {deliveryChallan.transport.vehicle_no && (
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Vehicle No.</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.transport.vehicle_no}</Typography>
                    </Grid>
                  )}
                  {deliveryChallan.transport.lr_number && (
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>LR Number</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{deliveryChallan.transport.lr_number}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}
          
          {/* E-way Bill Information */}
          {deliveryChallan.eway_bill && deliveryChallan.eway_bill.eway_bill_required && (
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  <QrCodeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  E-way Bill Details
                </Typography>
                
                <Grid container spacing={2}>
                  {deliveryChallan.eway_bill.eway_bill_number && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>E-way Bill Number</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary }}>
                        {deliveryChallan.eway_bill.eway_bill_number}
                      </Typography>
                    </Grid>
                  )}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip
                      label={deliveryChallan.eway_bill.eway_bill_status}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: deliveryChallan.eway_bill.eway_bill_status === 'Generated' ? '#D1FAE5' : '#FEF3C7',
                        color: deliveryChallan.eway_bill.eway_bill_status === 'Generated' ? '#065F46' : '#B45309'
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
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
            fontSize: '0.75rem'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDeliveryChallan;