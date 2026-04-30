import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
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
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
  Description as RemarksIcon
} from '@mui/icons-material';

// Color constants
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
  paymentStatus: {
    Paid: { bg: '#D1FAE5', color: '#065F46' },
    Unpaid: { bg: '#FEE2E2', color: '#991B1B' },
    Partial: { bg: '#FEF3C7', color: '#B45309' },
    Overdue: { bg: '#FFE4E6', color: '#BE123C' }
  },
  invoiceStatus: {
    Draft: { bg: '#F1F5F9', color: '#475569' },
    Submitted: { bg: '#E0F2FE', color: '#0369A1' },
    Approved: { bg: '#D1FAE5', color: '#065F46' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B' }
  }
};

const ViewInvoiceModal = ({ open, onClose, invoice }) => {
  if (!invoice) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getPaymentStatusChip = (status) => {
    const colors = COLORS.paymentStatus[status] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={status || 'Unpaid'}
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

  const getInvoiceStatusChip = (status) => {
    const colors = COLORS.invoiceStatus[status] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={status || 'Draft'}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Invoice Details
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {/* Header Section */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Invoice Number
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                {invoice.invoice_no || invoice._id?.slice(-6)}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Sales Order
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                {invoice.so_number || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Invoice Date
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary }}>
                {formatDate(invoice.invoice_date)}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Due Date
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: COLORS.text.primary }}>
                {formatDate(invoice.due_date)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Company & Customer Info */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                  Company Information
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mb: 0.5 }}>
                {invoice.company_name || '-'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                GSTIN: {invoice.company_gstin || '-'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                State: {invoice.company_state || '-'} (Code: {invoice.company_state_code || '-'})
              </Typography>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                  Customer Information
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, mb: 0.5 }}>
                {invoice.customer_name || '-'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                GSTIN: {invoice.customer_gstin || '-'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                PO Number: {invoice.customer_po_number || '-'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Items Table */}
        <Paper sx={{ mb: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <Typography sx={{ p: 1.5, fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, bgcolor: COLORS.primaryLight }}>
            Invoice Items
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.background.light }}>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>HSN</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Qty</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit Price</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Discount %</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>GST %</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items?.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.hsn_code || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.dispatched_qty || item.quantity || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.discount_percent || 0}%</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.gst_percentage || 0}%</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{formatCurrency(item.total_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Summary Section */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <ShippingIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                  Status Information
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, width: 100 }}>
                  Invoice Status:
                </Typography>
                {getInvoiceStatusChip(invoice.status)}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, width: 100 }}>
                  Payment Status:
                </Typography>
                {getPaymentStatusChip(invoice.payment_status)}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, width: 100 }}>
                  GST Type:
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                  {invoice.gst_type || '-'}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <MoneyIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                  Financial Summary
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sub Total:</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{formatCurrency(invoice.sub_total)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Discount Total:</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{formatCurrency(invoice.discount_total)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Taxable Total:</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{formatCurrency(invoice.taxable_total)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>GST Total:</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{formatCurrency(invoice.gst_total)}</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>Grand Total:</Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.primary }}>{formatCurrency(invoice.grand_total)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Balance Due:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>{formatCurrency(invoice.balance_due)}</Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Remarks */}
        {invoice.internal_remarks && (
          <Paper sx={{ p: 2, mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <RemarksIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                Internal Remarks
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {invoice.internal_remarks}
            </Typography>
          </Paper>
        )}

        {/* Additional Info */}
        <Paper sx={{ p: 2, mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textAlign: 'center' }}>
            Amount in Words: {invoice.amount_in_words || 'Zero Rupees Only'}
          </Typography>
          {invoice.irn && (
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textAlign: 'center', mt: 0.5 }}>
              IRN: {invoice.irn}
            </Typography>
          )}
        </Paper>
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
      </DialogActions>
    </Dialog>
  );
};

export default ViewInvoiceModal;