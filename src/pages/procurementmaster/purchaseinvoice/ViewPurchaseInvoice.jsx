import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  Receipt,
  AccountBalanceWallet,
  CreditCard,
  Store,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Badge as BadgeIcon,
  LocalOffer,
  Public,
  Info as InfoIcon,
  Payment,
  CalendarToday,
  Block as BlockIcon,
  VerifiedUser as VerifiedUserIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_BLUE = '#00B4D8';
const PRIMARY_DARK = '#063C3F';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const steps = ['Invoice Overview', 'Items & Taxes', 'Additional Details'];

const COLORS = {
  primary: '#063C3F',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  background: { white: '#FFFFFF', light: '#F8FFFC' },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6'
};

// Handle all possible status values (from schema)
const getStatusStyles = (status) => {
  const styles = {
    Pending: { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' },
    Approved: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    'Under Verification': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    Posted: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
  };
  return styles[status] || styles.Pending;
};

// Handle all possible matching status values (from schema)
const getMatchingStatusStyles = (status) => {
  const styles = {
    'Not Started': { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' },
    '2-way Matched': { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    '3-way Matched': { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    'Matched': { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    'Exception': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    'Hold': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    'Pending': { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' }
  };
  return styles[status] || styles.Pending;
};

// Handle payment status (from schema)
const getPaymentStatusStyles = (status) => {
  const styles = {
    'Unpaid': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    'Partially Paid': { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' },
    'Fully Paid': { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    'Overdue': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    'On Hold': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' }
  };
  return styles[status] || styles.Unpaid;
};

const ViewPurchaseInvoice = ({ open, onClose, invoice }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!invoice) return null;

  const status = invoice.status || 'Pending';
  const matchingStatus = invoice.matching_status || 'Not Started';
  const paymentStatus = invoice.payment_status || 'Unpaid';
  
  const statusStyles = getStatusStyles(status);
  const matchingStatusStyles = getMatchingStatusStyles(matchingStatus);
  const paymentStatusStyles = getPaymentStatusStyles(paymentStatus);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return '-';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
    try {
      return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      return '₹0';
    }
  };

  const renderField = (icon, label, value, color = '#0f172a') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#64748B', 
            display: 'block', 
            fontSize: '10px',
            fontWeight: 500,
            lineHeight: 1.2,
            mb: 0.2
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '13px',
            color: color,
            wordBreak: 'break-word'
          }}
        >
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  const getGSTBreakdown = () => {
    if (invoice.gst_type === 'CGST/SGST') {
      return (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>CGST</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(invoice.cgst_total)}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>SGST</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(invoice.sgst_total)}</Typography>
            </Box>
          </Grid>
        </>
      );
    } else if (invoice.gst_type === 'IGST') {
      return (
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>IGST</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(invoice.igst_total)}</Typography>
          </Box>
        </Grid>
      );
    }
    return null;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Invoice Overview
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Invoice Header */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ width: 56, height: 56, bgcolor: PRIMARY_DARK, fontSize: '1rem', fontWeight: 600 }}>
                    {invoice.purchase_invoice_number?.substring(0, 2).toUpperCase() || 'IN'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="#151C26" sx={{ fontSize: '1rem' }}>
                      {invoice.purchase_invoice_number}
                    </Typography>
                    <Typography variant="caption" color="#64748B" sx={{ fontSize: '11px' }}>
                      {invoice.vendor_invoice_no}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label={status} 
                    size="small" 
                    sx={{ 
                      bgcolor: statusStyles.bg, 
                      color: statusStyles.color, 
                      border: `1px solid ${statusStyles.border}` 
                    }} 
                  />
                  <Chip 
                    label={matchingStatus} 
                    size="small" 
                    sx={{ 
                      bgcolor: matchingStatusStyles.bg, 
                      color: matchingStatusStyles.color, 
                      border: `1px solid ${matchingStatusStyles.border}` 
                    }} 
                  />
                  <Chip 
                    label={paymentStatus} 
                    size="small" 
                    sx={{ 
                      bgcolor: paymentStatusStyles.bg, 
                      color: paymentStatusStyles.color, 
                      border: `1px solid ${paymentStatusStyles.border}` 
                    }} 
                  />
                </Stack>
              </Stack>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'Invoice Number', invoice.purchase_invoice_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'Vendor Invoice No', invoice.vendor_invoice_no)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Invoice Date', formatDate(invoice.invoice_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Vendor Invoice Date', formatDate(invoice.vendor_invoice_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'PO Number', invoice.po_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'GRN Numbers', invoice.grn_numbers?.join(', ') || '-')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Due Date', formatDate(invoice.due_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Payment sx={{ fontSize: 16 }} />, 'Payment Status', paymentStatus)}
                </Grid>
              </Grid>
            </Paper>

            {/* Vendor Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vendor Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Vendor Name', invoice.vendor_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<BadgeIcon sx={{ fontSize: 16 }} />, 'Vendor Code', invoice.vendor_id?.vendor_code)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'GSTIN', invoice.vendor_gstin)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<LocationOn sx={{ fontSize: 16 }} />, 'State', invoice.vendor_state && invoice.vendor_state_code 
                    ? `${invoice.vendor_state} (${invoice.vendor_state_code})`
                    : invoice.vendor_state || invoice.vendor_state_code || '-'
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(<LocationOn sx={{ fontSize: 16 }} />, 'Address', invoice.vendor_address)}
                </Grid>
              </Grid>
            </Paper>

            {/* Company Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Store sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Company Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Company Name', invoice.company_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'Company GSTIN', invoice.company_gstin)}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Items & Taxes
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Items Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Invoice Items
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Quantity</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Taxable Amt</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">GST %</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Match Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.items && invoice.items.length > 0 ? (
                      invoice.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.description || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.quantity || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.taxable_amount)}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.gst_percent || 0}%</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }} align="right">{formatCurrency(item.total_amount)}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={item.match_status || 'Not Checked'} 
                              size="small" 
                              sx={{ 
                                fontSize: '0.65rem', 
                                height: 20, 
                                bgcolor: item.match_status === 'Matched' ? '#D1FAE5' : 
                                         item.match_status === 'Price Mismatch' ? '#FEF3C7' : '#FEE2E2' 
                              }} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">No items found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Financial Summary */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Financial Summary
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Subtotal</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(invoice.taxable_total)}</Typography>
                  </Box>
                </Grid>
                
                {getGSTBreakdown()}
                
                <Grid size={{ xs: 12, sm: invoice.gst_type === 'CGST/SGST' ? 3 : 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Total Tax</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(invoice.total_tax)}</Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Grand Total</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                      {formatCurrency(invoice.grand_total)}
                    </Typography>
                  </Box>
                </Grid>
                
                {invoice.tds_applicable && (
                  <>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                          TDS ({invoice.tds_rate || 0}%)
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: COLORS.warning }}>
                          {formatCurrency(invoice.tds_amount)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>Net Payable</Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.success }}>
                          {formatCurrency(invoice.net_payable)}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
                
                <Grid size={{ xs: 12, sm: invoice.tds_applicable ? 4 : 12 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>ITC Available</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: COLORS.info }}>
                      {formatCurrency(invoice.itc_amount)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2: // Additional Details
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* TDS Details (if applicable) */}
            {invoice.tds_applicable && invoice.tds_section && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <Payment sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> TDS Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {renderField(<BadgeIcon sx={{ fontSize: 16 }} />, 'TDS Section', invoice.tds_section)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {renderField(<LocalOffer sx={{ fontSize: 16 }} />, 'TDS Rate', `${invoice.tds_rate || 0}%`)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {renderField(<AttachMoneyIcon sx={{ fontSize: 16 }} />, 'TDS Amount', formatCurrency(invoice.tds_amount))}
                  </Grid>
                  {invoice.tds_certificate_no && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(<Receipt sx={{ fontSize: 16 }} />, 'Certificate No', invoice.tds_certificate_no)}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Certificate Date', formatDate(invoice.tds_certificate_date))}
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Approval Remarks */}
            {invoice.approval_remarks && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Approval Remarks
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                  {invoice.approval_remarks}
                </Typography>
              </Paper>
            )}

            {/* Internal Remarks */}
            {invoice.internal_remarks && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Internal Remarks
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                  {invoice.internal_remarks}
                </Typography>
              </Paper>
            )}

            {/* Rejection Reason */}
            {invoice.rejection_reason && (
              <Paper sx={{ p: 2, backgroundColor: '#FEF3C7', borderRadius: 1.5, border: '1px solid #FDE68A' }}>
                <Typography variant="subtitle2" sx={{ color: '#92400E', mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <CancelIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Rejection Reason
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#92400E' }}>
                  {invoice.rejection_reason}
                </Typography>
              </Paper>
            )}

            {/* Cancellation Reason */}
            {invoice.cancellation_reason && (
              <Paper sx={{ p: 2, backgroundColor: '#FEE2E2', borderRadius: 1.5, border: '1px solid #FECACA' }}>
                <Typography variant="subtitle2" sx={{ color: '#991B1B', mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <BlockIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Cancellation Reason
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#991B1B' }}>
                  {invoice.cancellation_reason}
                </Typography>
                {invoice.cancelled_at && (
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#991B1B', mt: 1, display: 'block' }}>
                    Cancelled on: {formatDate(invoice.cancelled_at)}
                  </Typography>
                )}
              </Paper>
            )}

            {/* System Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Created At', formatDate(invoice.created_at))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Last Updated', formatDate(invoice.updated_at))}
                </Grid>
                {invoice.matching_completed_at && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Matching Completed', formatDate(invoice.matching_completed_at))}
                  </Grid>
                )}
                {invoice.gl_posting_done && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(<Receipt sx={{ fontSize: 16 }} />, 'GL Journal Entry', invoice.gl_journal_entry_id)}
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1.5,
        px: 2.5
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Receipt sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Purchase Invoice Details
            </Typography>
          </Stack>
          <Chip
            label={`ID: ${invoice._id?.slice(-6) || '-'}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '10px',
              height: '24px',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ 
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
              fontSize: '0.7rem !important',
              '&.Mui-active': {
                color: '#FFFFFF !important',
                opacity: 1,
                fontWeight: 600
              },
              '&.Mui-completed': {
                color: '#FFFFFF !important',
                opacity: 1
              }
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.7rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ 
        p: 2.5, 
        overflow: 'auto', 
        height: 'auto',
        maxHeight: 'calc(90vh - 140px)',
        backgroundColor: '#F8FFFC',
        '&:last-child': {
          pb: 2.5
        }
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid #E3E8EF',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          size="small"
          sx={{ 
            color: '#64748B', 
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#F1F5F9'
            }
          }}
        >
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              size="small"
              startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                color: '#64748B', 
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#F1F5F9'
                }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewPurchaseInvoice;