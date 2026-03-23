// ViewPurchaseOrder.js
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Business,
  Receipt,
  CalendarToday,
  Person,
  LocationOn,
  Payment,
  Info as InfoIcon,
  LocalShipping as LocalShippingIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

const COLORS = {
  primary: '#063C3F',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  background: { white: '#FFFFFF', light: '#F8FFFC' },
  border: '#E3E8EF',
  success: '#10B981'
};

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

const steps = ['Basic Info', 'Vendor & Items', 'Financial Details'];

const getStatusStyles = (status) => {
  const styles = {
    Draft: { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' },
    Approved: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Sent: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    Acknowledged: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    'Partially Received': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    'Fully Received': { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Invoiced: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Closed: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
  };
  return styles[status] || styles.Draft;
};

const getItemStatusStyles = (status) => {
  const styles = {
    Pending: { bg: '#E0F2FE', color: '#0C4A6E' },
    'Partially Received': { bg: '#FEF3C7', color: '#92400E' },
    'Fully Received': { bg: '#D1FAE5', color: '#065F46' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B' }
  };
  return styles[status] || styles.Pending;
};

const ViewPurchaseOrder = ({ open, onClose, po }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!po) return null;

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const statusStyles = getStatusStyles(po.status);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    bgcolor: PRIMARY_DARK,
                    fontSize: '1rem',
                    fontWeight: 600,
                    border: '2px solid #E3E8EF'
                  }}
                >
                  {po.po_number?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Chip 
                  icon={po.status === 'Approved' || po.status === 'Acknowledged' || po.status === 'Fully Received' ? 
                    <CheckCircleIcon sx={{ fontSize: 12 }} /> : 
                    po.status === 'Cancelled' ? <CancelIcon sx={{ fontSize: 12 }} /> : 
                    <ScheduleIcon sx={{ fontSize: 12 }} />}
                  label={po.status} 
                  sx={{ 
                    bgcolor: statusStyles.bg, 
                    color: statusStyles.color, 
                    border: `1px solid ${statusStyles.border}`, 
                    fontWeight: 600, 
                    fontSize: '11px', 
                    height: '24px',
                    '& .MuiChip-icon': { fontSize: 12 }
                  }} 
                />
              </Stack>

              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                PO Details
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'PO Number', po.po_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'PO Type', po.po_type)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'RFQ Number', po.rfq_id?.rfq_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'PR Number', po.pr_id?.pr_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'PO Date', formatDate(po.po_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Delivery Date', formatDate(po.delivery_date))}
                </Grid>
                {po.delivery_mode && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(<LocalShippingIcon sx={{ fontSize: 16 }} />, 'Delivery Mode', po.delivery_mode)}
                  </Grid>
                )}
                {po.freight_terms && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(<LocalShippingIcon sx={{ fontSize: 16 }} />, 'Freight Terms', po.freight_terms)}
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Payment sx={{ fontSize: 16 }} />, 'Payment Terms', po.payment_terms)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'GST Type', po.gst_type)}
                </Grid>
                {po.internal_remarks && (
                  <Grid size={{ xs: 12 }}>
                    {renderField(<InfoIcon sx={{ fontSize: 16 }} />, 'Internal Remarks', po.internal_remarks)}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* System Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(po.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(po.updatedAt)
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Vendor & Items
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vendor Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Vendor Name', po.vendor_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Vendor Code', po.vendor_id?.vendor_code)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'GSTIN', po.vendor_gstin)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<LocationOn sx={{ fontSize: 16 }} />, 'State', `${po.vendor_state} (${po.vendor_state_code})`)}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Receipt sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Items
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Ordered Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {po.items?.map((item, idx) => {
                      const itemStatusStyles = getItemStatusStyles(item.item_status);
                      return (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.ordered_qty}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.unit}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                            <Chip 
                              label={item.item_status} 
                              size="small" 
                              sx={{ 
                                fontSize: '0.65rem', 
                                height: 20, 
                                bgcolor: itemStatusStyles.bg, 
                                color: itemStatusStyles.color,
                                '& .MuiChip-label': { px: 1 }
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
          </Stack>
        );

      case 2: // Financial Details
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Payment sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Financial Summary
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {po.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                          {formatCurrency(item.total_amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell colSpan={2} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Subtotal:</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }} align="right">
                        {formatCurrency(po.subtotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontSize: '0.75rem' }}>GST ({po.gst_type}):</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                        {formatCurrency(po.gst_total)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell colSpan={2} sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Grand Total:</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.success }} align="right">
                        {formatCurrency(po.grand_total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {(po.approved_at || po.ack_date) && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Approval & Acknowledgement
                </Typography>
                
                <Grid container spacing={1.5}>
                  {po.approved_at && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(<Person sx={{ fontSize: 16 }} />, 'Approved By', po.approved_by?.Username || po.approved_by)}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Approved At', formatDate(po.approved_at))}
                      </Grid>
                    </>
                  )}
                  {po.ack_date && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(<Person sx={{ fontSize: 16 }} />, 'Acknowledged By', po.vendor_name)}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Acknowledged At', formatDate(po.ack_date))}
                      </Grid>
                    </>
                  )}
                </Grid>
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
            <Receipt sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Purchase Order Details
            </Typography>
          </Stack>
          <Chip
            label={`PO: ${po.po_number}`}
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

export default ViewPurchaseOrder;