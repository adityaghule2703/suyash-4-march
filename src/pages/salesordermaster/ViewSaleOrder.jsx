// ViewSaleOrder.jsx
import React, { useState } from 'react';
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
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon
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

const steps = ['Order Info', 'Items', 'Summary'];

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
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
  backgroundColor: ownerState.active || ownerState.completed ? COLORS.primary : '#ccc',
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
    backgroundColor: COLORS.primary,
    boxShadow: '0 4px 10px 0 rgba(6,60,63,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: COLORS.primary,
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
  const [activeStep, setActiveStep] = useState(0);

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
    if (!amount && amount !== 0) return '-';
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
        return <CheckCircleIcon sx={{ fontSize: '0.7rem', color: '#059669' }} />;
      case 'Confirmed':
      case 'In Production':
      case 'Ready for Dispatch':
      case 'Partially Delivered':
        return <PendingIcon sx={{ fontSize: '0.7rem', color: '#D97706' }} />;
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.7rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.7rem', color: '#4F46E5' }} />;
    }
  };
  
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Helper function to render field
  const renderField = (label, value, monospace = false, highlight = false) => (
    <Box>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ 
        fontSize: '0.8rem', 
        fontWeight: highlight ? 700 : 500, 
        color: highlight ? COLORS.primary : COLORS.text.primary,
        fontFamily: monospace ? 'monospace' : 'inherit',
        wordBreak: 'break-word'
      }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  const statusColors = getStatusColor(so.status);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Order Info
        return (
          <Stack spacing={2}>
            {/* Header Section - Order Overview */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}` 
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Order Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {so.so_number}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    SO ID: {so._id?.slice(-8) || 'N/A'}
                  </Typography>
                </Box>
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
                      fontSize: '0.7rem'
                    }
                  }}
                />
              </Stack>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('SO Date', formatDate(so.so_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created At', formatDateTime(so.createdAt))}
                </Grid>
              </Grid>
            </Paper>

            {/* Customer Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Customer Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Customer Name', so.customer_name, false, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('GSTIN', so.customer_gstin, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('PO Number', so.customer_po_number, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('PO Date', formatDate(so.customer_po_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Reference Quotation', so.quotation_no)}
                </Grid>
              </Grid>
            </Paper>

            {/* Delivery Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Delivery Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Delivery Terms', so.delivery_terms)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Delivery Mode', so.delivery_mode)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Expected Delivery Date', formatDate(so.expected_delivery_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Payment Terms', so.payment_terms)}
                </Grid>
              </Grid>
            </Paper>

            {/* Address Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Address Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Billing Address
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
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
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Shipping Address
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
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

            {/* Internal Remarks */}
            {so.internal_remarks && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Internal Remarks
                </Typography>
                
                <Box sx={{ 
                  bgcolor: COLORS.background.light, 
                  p: 1.5, 
                  borderRadius: 1,
                  border: `1px solid ${COLORS.border}`
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {so.internal_remarks}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Stack>
        );

      case 1: // Items
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Order Items ({so.items?.length || 0})
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: COLORS.background.light }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>HSN Code</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Discount %</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Total</TableCell>
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
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_name}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.hsn_code || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{item.ordered_qty}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.unit}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{item.discount_percent}%</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(itemTotal)}</TableCell>
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
                    {(!so.items || so.items.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        );

      case 2: // Summary
        return (
          <Stack spacing={2}>
            {/* Financial Summary */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Financial Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <Stack spacing={1.5}>
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
                      <Divider sx={{ borderColor: COLORS.border }} />
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
                      <Divider sx={{ borderColor: COLORS.border }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.primary }}>Grand Total:</Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>
                          {formatCurrency(so.grand_total)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 7 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`,
                    height: '100%'
                  }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      Amount in Words
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: COLORS.primary }}>
                      {so.amount_in_words || 'Amount in words not available'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* System Information */}
            <Paper sx={{ 
              p: 2, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created At', formatDateTime(so.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDateTime(so.updatedAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created By', so.created_by?.name || so.created_by?.email || '-' )}
                </Grid>
              </Grid>
            </Paper>

            {/* Audit Log */}
            {so.audit_log && so.audit_log.length > 0 && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Activity Log
                </Typography>
                
                <Stack spacing={1.5}>
                  {so.audit_log.map((log, idx) => (
                    <Box key={idx}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, minWidth: 140 }}>
                          {formatDateTime(log.changed_at)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                          <strong>{log.action}</strong>
                          {log.old_value && ` from ${log.old_value}`}
                          {log.new_value && ` to ${log.new_value}`}
                          {log.notes && ` - ${log.notes}`}
                        </Typography>
                      </Stack>
                      {idx < so.audit_log.length - 1 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          Sales Order Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
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
          Back
        </Button>
        <Box>
          <Button
            onClick={onClose}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={onClose}
              size="small"
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Done
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSaleOrder;