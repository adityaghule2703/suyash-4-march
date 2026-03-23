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
  TableRow
} from '@mui/material';
import {
  Close as CloseIcon,
  Business,
  Inventory,
  Receipt,
  CalendarToday,
  Person,
  Info as InfoIcon,
  AttachMoney,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

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

const steps = ['Basic Info', 'Items', 'Approval Info'];

const getStatusStyles = (status) => {
  const styles = {
    Submitted: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    Approved: { bg: '#9FE2BF', color: '#166534', border: '#86EFAC' },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    Pending: { bg: '#E0F2FE', color: '#0C4A6E', border: '#BAE6FD' }
  };
  return styles[status] || styles.Pending;
};

const ViewPurchaseRequisition = ({ open, onClose, pr }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!pr) return null;

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
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      minimumFractionDigits: 0 
    }).format(amount);
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

  const statusStyles = getStatusStyles(pr.status);
  const totalValue = pr.items?.reduce((sum, item) => sum + (item.estimated_price * item.required_qty), 0) || 0;

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Header Card with PR Info */}
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
                  {pr.pr_number?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Chip 
                  icon={pr.status === 'Approved' ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : 
                        pr.status === 'Rejected' ? <CancelIcon sx={{ fontSize: 12 }} /> : null}
                  label={pr.status} 
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
                Requisition Details
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Receipt sx={{ fontSize: 16 }} />, 'PR Number', pr.pr_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'PR Type', pr.pr_type)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Inventory sx={{ fontSize: 16 }} />, 'Source', pr.source)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Department', pr.department)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<CalendarToday sx={{ fontSize: 16 }} />, 'PR Date', formatDate(pr.pr_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<InfoIcon sx={{ fontSize: 16 }} />, 'MRP Run ID', pr.mrp_run_id)}
                </Grid>
              </Grid>
            </Paper>

            {/* Requestor Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Requestor Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Person sx={{ fontSize: 16 }} />, 
                    'Requested By', 
                    pr.requested_by?.Username || pr.requested_by?.Email
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(pr.createdAt)
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Items
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Inventory sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Items
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Total</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Required By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pr.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.required_qty} {item.unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">{formatCurrency(item.estimated_price)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }} align="right">
                          {formatCurrency(item.estimated_price * item.required_qty)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="center">{formatDate(item.required_date)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell colSpan={4} sx={{ fontSize: '0.75rem', fontWeight: 600 }} align="right">
                        Total Value:
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }} align="right">
                        {formatCurrency(totalValue)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        );

      case 2: // Approval Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {(pr.approved_at || pr.rejection_reason) && (
              <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                  <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Approval Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  {pr.approved_at && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(
                          <Person sx={{ fontSize: 16 }} />, 
                          'Approved By', 
                          pr.approved_by?.Username || pr.approved_by?.Email
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {renderField(
                          <CalendarToday sx={{ fontSize: 16 }} />, 
                          'Approved At', 
                          formatDate(pr.approved_at)
                        )}
                      </Grid>
                    </>
                  )}
                  {pr.rejection_reason && (
                    <Grid size={{ xs: 12 }}>
                      {renderField(
                        <InfoIcon sx={{ fontSize: 16 }} />, 
                        'Rejection Reason', 
                        pr.rejection_reason,
                        '#991B1B'
                      )}
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* System Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E3E8EF' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_DARK, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(pr.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CalendarToday sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(pr.updatedAt)
                  )}
                </Grid>
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
              Purchase Requisition Details
            </Typography>
          </Stack>
          <Chip
            label={`PR: ${pr.pr_number}`}
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

export default ViewPurchaseRequisition;