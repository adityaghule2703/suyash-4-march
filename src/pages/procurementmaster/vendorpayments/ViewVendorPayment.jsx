// ViewVendorPayment.jsx
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
  TableRow,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as LocalOfferIcon,
  CreditCard as CreditCardIcon,
  Print as PrintIcon
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

const steps = ['Payment Overview', 'Payment Details', 'Invoice Details', 'Audit Info'];

const StatusChip = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Pending':
        return { bg: '#FEF3C7', text: '#92400E', label: 'Pending', icon: null };
      case 'Initiated':
        return { bg: '#E0F2FE', text: '#0369A1', label: 'Initiated', icon: null };
      case 'Paid':
        return { bg: '#D1FAE5', text: '#065F46', label: 'Paid', icon: <CheckCircleIcon sx={{ fontSize: 12 }} /> };
      case 'Bounced':
        return { bg: '#FEE2E2', text: '#991B1B', label: 'Bounced', icon: <CancelIcon sx={{ fontSize: 12 }} /> };
      case 'Cancelled':
        return { bg: '#F1F5F9', text: '#475569', label: 'Cancelled', icon: <CancelIcon sx={{ fontSize: 12 }} /> };
      case 'Failed':
        return { bg: '#FEE2E2', text: '#991B1B', label: 'Failed', icon: <CancelIcon sx={{ fontSize: 12 }} /> };
      default:
        return { bg: '#FEF3C7', text: '#92400E', label: status, icon: null };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        fontSize: '0.7rem',
        fontWeight: 600,
        height: 28,
        bgcolor: config.bg,
        color: config.text,
        '& .MuiChip-icon': { fontSize: 14, color: config.text }
      }}
    />
  );
};

const ViewVendorPayment = ({ open, onClose, payment, onPrint }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!payment) return null;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to render field with icon
  const renderField = (icon, label, value, color = '#151C26') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>
        {icon}
      </Box>
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
        {typeof value === 'string' || typeof value === 'number' ? (
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
        ) : (
          value
        )}
      </Box>
    </Stack>
  );

  const handlePrint = () => {
    if (onPrint) {
      onPrint(payment);
    } else {
      window.print();
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Payment Overview
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Payment Header Card */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    bgcolor: PRIMARY_DARK,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    border: '2px solid #E3E8EF'
                  }}
                >
                  <ReceiptIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} color="#151C26" sx={{ fontSize: '1rem', mb: 0.5 }}>
                    {payment.vendor_payment_number}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <StatusChip status={payment.status} />
                    <Chip
                      label={payment.payment_mode}
                      size="small"
                      sx={{
                        bgcolor: '#E8F0F1',
                        color: PRIMARY_DARK,
                        fontSize: '11px',
                        height: '22px',
                        fontWeight: 500
                      }}
                    />
                    <Typography variant="body2" color="#64748B" sx={{ fontSize: '11px' }}>
                      Ref: {payment.reference_no}
                    </Typography>
                  </Stack>
                </Box>
                <Tooltip title="Print Receipt">
                  <IconButton size="small" onClick={handlePrint} sx={{ color: '#64748B' }}>
                    <PrintIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Divider sx={{ mb: 1.5 }} />

              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <MoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Amount Summary
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1, bgcolor: '#F8FFFC', borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '10px' }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: PRIMARY_DARK }}>
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1, bgcolor: '#F8FFFC', borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '10px' }}>
                      TDS Deducted
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#F59E0B' }}>
                      {payment.tds_amount > 0 ? `-${formatCurrency(payment.tds_amount)}` : '-'}
                    </Typography>
                    {payment.tds_applicable && (
                      <Typography variant="caption" sx={{ fontSize: '9px', color: '#94A3B8' }}>
                        {payment.tds_section} @ {payment.tds_rate}%
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1, bgcolor: '#E8F0F1', borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '10px' }}>
                      Net Amount Paid
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: PRIMARY_DARK }}>
                      {formatCurrency(payment.net_paid)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Vendor Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vendor Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BusinessIcon sx={{ fontSize: 16 }} />,
                    'Vendor Name',
                    payment.vendor_name
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <ReceiptIcon sx={{ fontSize: 16 }} />,
                    'GSTIN',
                    payment.vendor_gstin
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CreditCardIcon sx={{ fontSize: 16 }} />,
                    'PAN',
                    payment.vendor_pan
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarIcon sx={{ fontSize: 16 }} />,
                    'Payment Date',
                    formatDate(payment.payment_date)
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Payment Details
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Payment Mode Details */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <PaymentIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Payment Mode Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <PaymentIcon sx={{ fontSize: 16 }} />,
                    'Payment Mode',
                    payment.payment_mode
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <LocalOfferIcon sx={{ fontSize: 16 }} />,
                    'Reference Number',
                    payment.reference_no
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Account Details */}
            {payment.from_bank_account && payment.from_bank_account.bank_name && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <AccountBalanceIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Company Bank Account
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <BusinessIcon sx={{ fontSize: 16 }} />,
                      'Bank Name',
                      payment.from_bank_account.bank_name
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <CreditCardIcon sx={{ fontSize: 16 }} />,
                      'Account Number',
                      payment.from_bank_account.account_no
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <LocalOfferIcon sx={{ fontSize: 16 }} />,
                      'IFSC Code',
                      payment.from_bank_account.ifsc
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Vendor Bank Details */}
            {payment.vendor_bank_details && payment.vendor_bank_details.bank_name && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <AccountBalanceIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vendor Bank Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <BusinessIcon sx={{ fontSize: 16 }} />,
                      'Bank Name',
                      payment.vendor_bank_details.bank_name
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <PersonIcon sx={{ fontSize: 16 }} />,
                      'Account Name',
                      payment.vendor_bank_details.account_name
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <CreditCardIcon sx={{ fontSize: 16 }} />,
                      'Account Number',
                      payment.vendor_bank_details.account_no
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <LocalOfferIcon sx={{ fontSize: 16 }} />,
                      'IFSC Code',
                      payment.vendor_bank_details.ifsc
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Remarks */}
            {payment.remarks && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                  <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Remarks
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#4B5568' }}>
                  {payment.remarks}
                </Typography>
              </Paper>
            )}
          </Stack>
        );

      case 2: // Invoice Details
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Invoices Paid */}
            {payment.allocations && payment.allocations.length > 0 && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <ReceiptIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Invoices Paid
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F8FFFC' }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#4B5568' }}>Invoice No.</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#4B5568' }}>Date</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#4B5568' }} align="right">Invoice Amount</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#4B5568' }} align="right">Paid Amount</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#4B5568' }} align="right">Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payment.allocations.map((alloc, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#151C26' }}>
                            {alloc.invoice_number}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#4B5568' }}>
                            {formatShortDate(alloc.invoice_date)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#4B5568' }} align="right">
                            {formatCurrency(alloc.invoice_amount)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: PRIMARY_DARK }} align="right">
                            {formatCurrency(alloc.allocated_amount)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#64748B' }} align="right">
                            {formatCurrency(alloc.balance_after_allocation || (alloc.invoice_amount - alloc.allocated_amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* TDS Details */}
            {payment.tds_applicable && payment.tds_amount > 0 && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <ReceiptIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> TDS Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <LocalOfferIcon sx={{ fontSize: 16 }} />,
                      'TDS Section',
                      payment.tds_section
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <InfoIcon sx={{ fontSize: 16 }} />,
                      'TDS Rate',
                      `${payment.tds_rate}%`
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <MoneyIcon sx={{ fontSize: 16 }} />,
                      'TDS Amount',
                      formatCurrency(payment.tds_amount),
                      '#F59E0B'
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 3: // Audit Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Approval Information */}
            {payment.approved_by && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Approval Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <PersonIcon sx={{ fontSize: 16 }} />,
                      'Approved By',
                      payment.approved_by?.Username || payment.approved_by?.name || 'System'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <CalendarIcon sx={{ fontSize: 16 }} />,
                      'Approved At',
                      formatDate(payment.approved_at)
                    )}
                  </Grid>
                  {payment.approval_remarks && (
                    <Grid size={{ xs: 12 }}>
                      {renderField(
                        <InfoIcon sx={{ fontSize: 16 }} />,
                        'Approval Remarks',
                        payment.approval_remarks
                      )}
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* System Audit Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <PersonIcon sx={{ fontSize: 16 }} />,
                    'Created By',
                    payment.created_by?.Username || payment.created_by?.name || 'System'
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarIcon sx={{ fontSize: 16 }} />,
                    'Created At',
                    formatDate(payment.created_at)
                  )}
                </Grid>
                {payment.updated_by && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <PersonIcon sx={{ fontSize: 16 }} />,
                      'Last Updated By',
                      payment.updated_by?.Username || payment.updated_by?.name || 'System'
                    )}
                  </Grid>
                )}
                {payment.updated_at && payment.updated_at !== payment.created_at && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <CalendarIcon sx={{ fontSize: 16 }} />,
                      'Last Updated At',
                      formatDate(payment.updated_at)
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Payment Status History */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Payment Status
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <StatusChip status={payment.status} />
                {payment.status === 'Paid' && (
                  <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.7rem' }}>
                    Payment successfully processed
                  </Typography>
                )}
                {payment.status === 'Bounced' && payment.bounce_reason && (
                  <Typography variant="caption" sx={{ color: '#EF4444', fontSize: '0.7rem' }}>
                    Reason: {payment.bounce_reason}
                  </Typography>
                )}
              </Stack>
              
              {payment.bounce_remarks && (
                <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#64748B', mt: 1 }}>
                  {payment.bounce_remarks}
                </Typography>
              )}
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
          borderRadius: 2,
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
            <ReceiptIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Payment Details
            </Typography>
          </Stack>
          <Chip
            label={`ID: ${payment._id?.slice(-6) || '-'}`}
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

export default ViewVendorPayment;