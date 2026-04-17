// ViewGRN.js - Compact version with stepper
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
  LocalShipping as LocalShippingIcon,
  Info as InfoIcon,
  QrCode as QrCodeIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

const COLORS = {
  primary: '#063C3F',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  background: { white: '#FFFFFF', light: '#F8FFFC' },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
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

const steps = ['Basic Info', 'Shipment Details', 'Items Received'];

const getStatusStyles = (status) => {
  const styles = {
    Created: { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' },
    'QC Passed': { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    'QC Failed': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    'Partially Accepted': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    Accepted: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    Closed: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
  };
  return styles[status] || styles.Created;
};

const getQCStatusStyles = (status) => {
  const styles = {
    Pending: { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' },
    'In Progress': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    Passed: { bg: '#D1FAE5', color: '#065F46', border: '#86EFAC' },
    Failed: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    'Partially Passed': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' }
  };
  return styles[status] || styles.Pending;
};

const ViewGRN = ({ open, onClose, grn }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!grn) return null;

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

  const statusStyles = getStatusStyles(grn.status);
  const qcStatusStyles = getQCStatusStyles(grn.qc_status || 'Pending');

  // Get warehouse display name
  const getWarehouseDisplay = () => {
    if (grn.warehouse_name && grn.warehouse_name !== 'Unknown Warehouse') {
      return grn.warehouse_name;
    }
    if (grn.receiving_store && typeof grn.receiving_store === 'object') {
      return grn.receiving_store.warehouse_name || grn.receiving_store.warehouse_id || 'Unknown';
    }
    if (typeof grn.receiving_store === 'string') {
      return grn.receiving_store;
    }
    return 'Not specified';
  };

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
                  {grn.grn_number?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    icon={grn.status === 'Accepted' ? 
                      <CheckCircleIcon sx={{ fontSize: 12 }} /> : 
                      grn.status === 'Rejected' ? 
                      <CancelIcon sx={{ fontSize: 12 }} /> : 
                      <ScheduleIcon sx={{ fontSize: 12 }} />}
                    label={grn.status} 
                    size="small" 
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
                  <Chip 
                    label={`QC: ${grn.qc_status || 'Pending'}`} 
                    size="small" 
                    sx={{ 
                      bgcolor: qcStatusStyles.bg, 
                      color: qcStatusStyles.color, 
                      border: `1px solid ${qcStatusStyles.border}`, 
                      fontWeight: 600, 
                      fontSize: '11px', 
                      height: '24px'
                    }} 
                  />
                </Stack>
              </Stack>

              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                GRN Details
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'GRN Number', grn.grn_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'PO Number', grn.po_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'GRN Date', formatDate(grn.grn_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Person sx={{ fontSize: 16 }} />, 'Received By', grn.received_by?.Username || grn.received_by?.Email || 'N/A')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<LocalShippingIcon sx={{ fontSize: 16 }} />, 'Receipt Time', formatDate(grn.receipt_time))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<QrCodeIcon sx={{ fontSize: 16 }} />, 'Total Received Qty', `${grn.total_received_qty} units`)}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(<WarehouseIcon sx={{ fontSize: 16 }} />, 'Receiving Warehouse', getWarehouseDisplay())}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vendor Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Vendor Name', grn.vendor_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Vendor Code', grn.vendor_id?.vendor_code || 'N/A')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'Vendor Invoice No', grn.vendor_invoice_no || 'N/A')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'Invoice Date', formatShortDate(grn.vendor_invoice_date))}
                </Grid>
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
                    formatDate(grn.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(grn.updatedAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <Person sx={{ fontSize: 16 }} />, 
                    'Created By', 
                    grn.created_by?.Username || grn.created_by?.Email || 'N/A'
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Shipment Details
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Transport Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<LocalShippingIcon sx={{ fontSize: 16 }} />, 'Vehicle Number', grn.vehicle_no || 'N/A')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<LocalShippingIcon sx={{ fontSize: 16 }} />, 'LR Number', grn.lr_number || 'N/A')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'LR Date', formatShortDate(grn.lr_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<LocalShippingIcon sx={{ fontSize: 16 }} />, 'Transporter', grn.transporter_name || 'N/A')}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> QC Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CheckCircleIcon sx={{ fontSize: 16 }} />, 'QC Status', grn.qc_status || 'Pending')}
                </Grid>
                {grn.qc_completed_at && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'QC Completed', formatDate(grn.qc_completed_at))}
                  </Grid>
                )}
                {grn.qc_completed_by && (
                  <Grid size={{ xs: 12 }}>
                    {renderField(<Person sx={{ fontSize: 16 }} />, 'QC Completed By', grn.qc_completed_by?.Username || 'N/A')}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {grn.remarks && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Remarks
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, whiteSpace: 'pre-wrap' }}>
                  {grn.remarks}
                </Typography>
              </Paper>
            )}
          </Stack>
        );

      case 2: // Items Received
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Receipt sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Items Received
              </Typography>
              
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Received</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Accepted</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Rejected</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Batch No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Heat No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Storage Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grn.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                          <Chip 
                            label={item.received_qty} 
                            size="small" 
                            sx={{ fontSize: '0.7rem', height: 22, bgcolor: '#E8F0F1', color: PRIMARY_DARK }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                          <Chip 
                            label={item.accepted_qty || 0} 
                            size="small" 
                            sx={{ fontSize: '0.7rem', height: 22, bgcolor: '#D1FAE5', color: '#065F46' }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                          <Chip 
                            label={item.rejected_qty || 0} 
                            size="small" 
                            sx={{ fontSize: '0.7rem', height: 22, bgcolor: '#FEE2E2', color: '#991B1B' }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.batch_no || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.heat_no || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.storage_location || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Received</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: PRIMARY_DARK }}>{grn.total_received_qty} units</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Accepted</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>{grn.total_accepted_qty || 0} units</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Rejected</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#EF4444' }}>{grn.total_rejected_qty || 0} units</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Acceptance Rate</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: PRIMARY_BLUE }}>
                      {grn.total_received_qty > 0 
                        ? `${((grn.total_accepted_qty || 0) / grn.total_received_qty * 100).toFixed(1)}%` 
                        : '0%'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Rejection Reason if any */}
              {grn.items?.some(item => item.rejection_reason) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ color: '#EF4444', mb: 1, fontWeight: 600, fontSize: '0.75rem' }}>
                    Rejection Reasons
                  </Typography>
                  {grn.items.map((item, idx) => (
                    item.rejection_reason && (
                      <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: '#FEF2F2', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#991B1B' }}>{item.part_no}:</Typography>
                        <Typography variant="caption" sx={{ color: '#7F1D1D', ml: 1 }}>{item.rejection_reason}</Typography>
                      </Box>
                    )
                  ))}
                </>
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
            <Receipt sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Goods Receipt Note Details
            </Typography>
          </Stack>
          <Chip
            label={`GRN: ${grn.grn_number}`}
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

export default ViewGRN;