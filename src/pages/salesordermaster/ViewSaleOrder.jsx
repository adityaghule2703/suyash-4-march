// ViewSaleOrder.jsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
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

const STATUS_COLORS = {
  'Draft': { bg: '#FEF3C7', color: '#92400E' },
  'Confirmed': { bg: '#DBEAFE', color: '#1E40AF' },
  'In Production': { bg: '#FEF3C7', color: '#D97706' },
  'Ready for Dispatch': { bg: '#E0E7FF', color: '#4F46E5' },
  'Partially Delivered': { bg: '#FEF3C7', color: '#D97706' },
  'Fully Delivered': { bg: '#D1FAE5', color: '#059669' },
  'Closed': { bg: '#D1FAE5', color: '#059669' },
  'Cancelled': { bg: '#FEE2E2', color: '#DC2626' }
};

const ViewSaleOrder = ({ open, onClose, so }) => {
  if (!so) return null;
  
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
  
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: so.currency || 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Fully Delivered':
      case 'Closed':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Confirmed':
      case 'In Production':
      case 'Ready for Dispatch':
      case 'Partially Delivered':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };
  
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };
  
  const statusColors = getStatusColor(so.status);
  
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
          Sales Order Details
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
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sales Order No</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {so.so_number}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip
                      icon={getStatusIcon(so.status)}
                      label={so.status || 'Draft'}
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
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>SO Date</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(so.so_date)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(so.createdAt)}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Customer Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Customer Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer Name</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.customer_name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>GSTIN</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.customer_gstin || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>PO Number</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.customer_po_number || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>PO Date</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(so.customer_po_date)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Reference Quotation</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.quotation_no || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Delivery Information */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <ShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Delivery Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Delivery Terms</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.delivery_terms || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Delivery Mode</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.delivery_mode || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Expected Delivery Date</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDate(so.expected_delivery_date)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Payment Terms</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{so.payment_terms || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Billing & Shipping Address */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  Billing Address
                </Typography>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  {so.billing_address?.line1 && `${so.billing_address.line1}, `}
                  {so.billing_address?.line2 && `${so.billing_address.line2}, `}
                  {so.billing_address?.city && `${so.billing_address.city}, `}
                  {so.billing_address?.district && `${so.billing_address.district}, `}
                  {so.billing_address?.state && `${so.billing_address.state} - `}
                  {so.billing_address?.pincode}
                  {so.billing_address?.country && `, ${so.billing_address.country}`}
                  {!so.billing_address?.line1 && '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  Shipping Address
                </Typography>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  {so.shipping_address?.line1 && `${so.shipping_address.line1}, `}
                  {so.shipping_address?.line2 && `${so.shipping_address.line2}, `}
                  {so.shipping_address?.city && `${so.shipping_address.city}, `}
                  {so.shipping_address?.district && `${so.shipping_address.district}, `}
                  {so.shipping_address?.state && `${so.shipping_address.state} - `}
                  {so.shipping_address?.pincode}
                  {so.shipping_address?.country && `, ${so.shipping_address.country}`}
                  {!so.shipping_address?.line1 && '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Items List */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Order Items ({so.items?.length || 0})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.light }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>HSN Code</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Discount %</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {so.items?.map((item, idx) => {
                    const itemTotal = item.ordered_qty * item.unit_price * (1 - (item.discount_percent / 100));
                    const itemStatusColors = STATUS_COLORS[item.item_status] || { bg: '#F1F5F9', color: '#475569' };
                    
                    return (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_name}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.hsn_code || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.ordered_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{item.discount_percent}%</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(itemTotal)}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.item_status || 'Pending'}
                            size="small"
                            sx={{ 
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: itemStatusColors.bg,
                              color: itemStatusColors.color
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          {/* Financial Summary */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Financial Summary
            </Typography>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sub Total:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.sub_total)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Discount:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.discount_total)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Taxable Amount:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.taxable_total)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>CGST:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.cgst_total)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>SGST:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.sgst_total)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>IGST:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.igst_total)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>GST Total:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formatCurrency(so.gst_total)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>Grand Total:</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>
                      {formatCurrency(so.grand_total)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Audit Log / Remarks */}
          {so.internal_remarks && (
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                Internal Remarks
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                {so.internal_remarks}
              </Typography>
            </Paper>
          )}
          
          {/* Audit Log */}
          {so.audit_log && so.audit_log.length > 0 && (
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Activity Log
              </Typography>
              <Stack spacing={1}>
                {so.audit_log.map((log, idx) => (
                  <Stack key={idx} direction="row" spacing={2} alignItems="flex-start">
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, minWidth: 120 }}>
                      {formatDateTime(log.changed_at)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem' }}>
                      <strong>{log.action}</strong>
                      {log.old_value && ` from ${log.old_value}`}
                      {log.new_value && ` to ${log.new_value}`}
                      {log.notes && ` - ${log.notes}`}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          )}
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

export default ViewSaleOrder;