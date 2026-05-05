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
  IconButton,
  Divider,
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
  ListItemIcon
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
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
  Info as InfoIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

// Color constants matching the consistent style
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

const steps = ['Overview', 'Items', 'Summary & Terms'];

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

const ViewQuotation = ({ open, onClose, quotation }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!quotation) return null;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': { bg: '#FEF3C7', color: '#92400E' },
      'Sent': { bg: '#DBEAFE', color: '#1E40AF' },
      'Approved': { bg: '#D1FAE5', color: '#065F46' },
      'Rejected': { bg: '#FEE2E2', color: '#991B1B' }
    };
    return colors[status] || colors.Draft;
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

  const statusColors = getStatusColor(quotation.Status);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Overview
        return (
          <Stack spacing={2}>
            {/* Header Section - Quotation Overview */}
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
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Quotation Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {quotation.QuotationNo}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    Quotation ID: {quotation._id || 'N/A'}
                  </Typography>
                </Box>
                <Chip
                  label={quotation.Status}
                  size="small"
                  sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 500,
                    bgcolor: statusColors.bg, 
                    color: statusColors.color
                  }}
                />
              </Stack>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Company', quotation.CompanyName, false, true)}
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    GSTIN: {quotation.CompanyGSTIN} • State: {quotation.CompanyState}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Vendor', quotation.VendorName, false, true)}
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    GSTIN: {quotation.VendorGSTIN} • PAN: {quotation.VendorPAN}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Vendor Contact */}
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
                Vendor Contact
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Contact Person', quotation.VendorContactPerson)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Phone', quotation.VendorPhone)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Email', quotation.VendorEmail)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Address', `${quotation.VendorAddress}, ${quotation.VendorCity} - ${quotation.VendorPincode}`)}
                </Grid>
              </Grid>
            </Paper>

            {/* Date Information */}
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
                <DateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Date Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Quotation Date', formatDate(quotation.QuotationDate))}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Valid Till', formatDate(quotation.ValidTill))}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Vendor Type', quotation.VendorType)}
                </Grid>
              </Grid>
            </Paper>
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
                Items ({quotation.Items?.length || 0})
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: COLORS.background.light }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>HSN</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Rate</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotation.Items?.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.PartNo}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.PartName}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.HSNCode}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.Unit}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{item.Quantity}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{formatCurrency(item.FinalRate)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.Amount)}</TableCell>
                      </TableRow>
                    ))}
                    {(!quotation.Items || quotation.Items.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Remarks */}
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
                Remarks
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1, 
                    border: `1px solid ${COLORS.border}` 
                  }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      Internal Remarks
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {quotation.InternalRemarks || 'No internal remarks'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1, 
                    border: `1px solid ${COLORS.border}` 
                  }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      Vendor Remarks
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
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
          <Stack spacing={2}>
            {/* Amount Summary */}
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
                <MoneyIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Amount Summary
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.background.light, 
                    borderRadius: 1, 
                    border: `1px solid ${COLORS.border}` 
                  }}>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sub Total:</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatCurrency(quotation.SubTotal)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>GST ({quotation.GSTPercentage}%):</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#D32F2F' }}>{formatCurrency(quotation.GSTAmount)}</Typography>
                      </Stack>
                      <Divider sx={{ borderColor: COLORS.border }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Grand Total:</Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(quotation.GrandTotal)}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#F0F9FF', 
                    borderRadius: 1, 
                    border: `1px solid ${COLORS.border}`,
                    height: '100%'
                  }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      Amount in Words
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#0369A1' }}>
                      {quotation.AmountInWords}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Terms & Conditions */}
            {quotation.TermsConditions?.length > 0 && (
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
                  <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Terms & Conditions
                </Typography>
                
                <List dense disablePadding>
                  {quotation.TermsConditions.map((term, index) => (
                    <ListItem key={term._id} alignItems="flex-start" disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, fontWeight: 600 }}>
                          {term.Sequence}.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {term.Title}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
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
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('GST Type', quotation.GSTType)}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Created At', formatDate(quotation.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Last Updated', formatDate(quotation.updatedAt))}
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
          Quotation Details
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

export default ViewQuotation;