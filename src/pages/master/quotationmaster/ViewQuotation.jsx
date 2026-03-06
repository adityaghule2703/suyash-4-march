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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  MonetizationOn as MoneyIcon,
  Receipt as ReceiptIcon,
  Assignment as AssignmentIcon,
  LocalShipping as ShippingIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
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

// Custom Step Icon styling to make numbers white
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? '#00B4D8' : '#ccc',
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
    backgroundColor: '#00B4D8',
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#00B4D8',
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

const steps = ['Overview', 'Items', 'Summary & Terms'];

const ViewQuotation = ({ open, onClose, quotation, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!quotation) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
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

  const getStatusColor = (status) => {
    const colors = {
      'Draft': { bg: '#FEF3C7', color: '#92400E', border: '#FBBF24' },
      'Sent': { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
      'Approved': { bg: '#D1FAE5', color: '#065F46', border: '#34D399' },
      'Rejected': { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' }
    };
    return colors[status] || colors.Draft;
  };

  // Helper function to render field with icon
  const renderField = (icon, label, value, color = '#0f172a') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>
        {icon}
      </Box>
      <Box>
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

  const statusColors = getStatusColor(quotation.Status);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Overview
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Header Info */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, fontWeight: 600, fontSize: '0.8rem' }}>
                    Quotation Information
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="#101010" sx={{ fontSize: '1.1rem', mt: 0.5 }}>
                    {quotation.QuotationNo}
                  </Typography>
                </Box>
                <Chip
                  label={quotation.Status}
                  sx={{
                    bgcolor: statusColors.bg,
                    color: statusColors.color,
                    border: `1px solid ${statusColors.border}`,
                    fontWeight: 600,
                    fontSize: '11px',
                    height: '22px',
                  }}
                />
              </Stack>

              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BusinessIcon sx={{ fontSize: 16 }} />, 
                    'Company', 
                    quotation.CompanyName,
                    PRIMARY_BLUE
                  )}
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', ml: 3.5, fontSize: '10px' }}>
                    GSTIN: {quotation.CompanyGSTIN} • State: {quotation.CompanyState}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BusinessIcon sx={{ fontSize: 16 }} />, 
                    'Vendor', 
                    quotation.VendorName
                  )}
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', ml: 3.5, fontSize: '10px' }}>
                    GSTIN: {quotation.VendorGSTIN} • PAN: {quotation.VendorPAN}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Vendor Contact */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Vendor Contact
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <PersonIcon sx={{ fontSize: 16 }} />, 
                    'Contact Person', 
                    quotation.VendorContactPerson
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <PhoneIcon sx={{ fontSize: 16 }} />, 
                    'Phone', 
                    quotation.VendorPhone
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <EmailIcon sx={{ fontSize: 16 }} />, 
                    'Email', 
                    quotation.VendorEmail
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <LocationIcon sx={{ fontSize: 16 }} />, 
                    'Address', 
                    `${quotation.VendorAddress}, ${quotation.VendorCity} - ${quotation.VendorPincode}`
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Date Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <DateIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Date Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <DateIcon sx={{ fontSize: 16 }} />, 
                    'Quotation Date', 
                    formatDate(quotation.QuotationDate)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <DateIcon sx={{ fontSize: 16 }} />, 
                    'Valid Till', 
                    formatDate(quotation.ValidTill)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <ShippingIcon sx={{ fontSize: 16 }} />, 
                    'Vendor Type', 
                    quotation.VendorType
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Items
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <ReceiptIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Items ({quotation.Items?.length || 0})
              </Typography>
              
              <TableContainer component={Paper} sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell><Typography variant="caption" fontWeight={600}>#</Typography></TableCell>
                      <TableCell><Typography variant="caption" fontWeight={600}>Part No</Typography></TableCell>
                      <TableCell><Typography variant="caption" fontWeight={600}>Part Name</Typography></TableCell>
                      <TableCell><Typography variant="caption" fontWeight={600}>HSN</Typography></TableCell>
                      <TableCell><Typography variant="caption" fontWeight={600}>Unit</Typography></TableCell>
                      <TableCell align="right"><Typography variant="caption" fontWeight={600}>Qty</Typography></TableCell>
                      <TableCell align="right"><Typography variant="caption" fontWeight={600}>Rate</Typography></TableCell>
                      <TableCell align="right"><Typography variant="caption" fontWeight={600}>Amount</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotation.Items?.map((item, index) => (
                      <TableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell><Typography variant="caption">{index + 1}</Typography></TableCell>
                        <TableCell><Typography variant="caption" fontWeight={600}>{item.PartNo}</Typography></TableCell>
                        <TableCell><Typography variant="caption">{item.PartName}</Typography></TableCell>
                        <TableCell><Typography variant="caption">{item.HSNCode}</Typography></TableCell>
                        <TableCell><Typography variant="caption">{item.Unit}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption">{item.Quantity}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption">{formatCurrency(item.FinalRate)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption" fontWeight={600}>{formatCurrency(item.Amount)}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Remarks */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Remarks
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Internal Remarks
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {quotation.InternalRemarks || 'No internal remarks'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Vendor Remarks
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {quotation.VendorRemarks || 'No vendor remarks'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2: // Summary & Terms
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Amount Summary */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <MoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Amount Summary
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Sub Total:</Typography>
                        <Typography variant="caption" fontWeight={600}>{formatCurrency(quotation.SubTotal)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#64748B' }}>GST ({quotation.GSTPercentage}%):</Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ color: '#D32F2F' }}>{formatCurrency(quotation.GSTAmount)}</Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" fontWeight={600}>Grand Total:</Typography>
                        <Typography variant="body1" fontWeight={700} sx={{ color: '#2E7D32' }}>{formatCurrency(quotation.GrandTotal)}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#F0F9FF', borderRadius: 1, border: '1px solid #BAE6FD', height: '100%' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Amount in Words
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', fontStyle: 'italic', color: '#0369A1' }}>
                      {quotation.AmountInWords}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Terms & Conditions */}
            {quotation.TermsConditions?.length > 0 && (
              <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                  <AssignmentIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Terms & Conditions
                </Typography>
                
                <List dense disablePadding>
                  {quotation.TermsConditions.map((term, index) => (
                    <ListItem key={term._id} alignItems="flex-start" disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                          {term.Sequence}.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" fontWeight={600} sx={{ color: '#0f172a' }}>
                            {term.Title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            {term.Description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {/* System Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <InfoIcon sx={{ fontSize: 16 }} />, 
                    'GST Type', 
                    quotation.GSTType
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <DateIcon sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(quotation.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <DateIcon sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(quotation.updatedAt)
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '680px'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1,
        px: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DescriptionIcon sx={{ color: '#FFFFFF', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '0.9rem'
            }}>
              Quotation Details
            </Typography>
          </Stack>
          <Chip
            label={`${quotation.QuotationNo || ''}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '10px',
              height: '20px',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>

        {/* Stepper - 3 Steps */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ 
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
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
        p: 1.5, 
        overflow: 'auto',
        height: '480px',
        '&:last-child': {
          pb: 1.5
        }
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2,
        py: 1,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            onClick={onClose}
            startIcon={<CloseIcon />}
            size="small"
            sx={{ color: '#666', fontSize: '0.8rem' }}
          >
            Close
          </Button>

          <Stack direction="row" spacing={1}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                size="small"
                startIcon={<NavigateBeforeIcon />}
                sx={{ color: '#666', fontSize: '0.8rem' }}
              >
                Back
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                size="small"
                endIcon={<NavigateNextIcon />}
                sx={{
                  backgroundColor: PRIMARY_BLUE,
                  fontSize: '0.8rem',
                  '&:hover': { backgroundColor: '#0e7490' }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  onClose();
                  onEdit && onEdit();
                }}
                startIcon={<EditIcon />}
                size="small"
                sx={{
                  backgroundColor: PRIMARY_BLUE,
                  fontSize: '0.8rem',
                  '&:hover': { backgroundColor: '#0e7490' }
                }}
              >
                Edit Quotation
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewQuotation;