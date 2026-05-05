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
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  ContactPhone as ContactPhoneIcon,
  Savings as SavingsIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

// Color constants matching the ViewBom style
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

const steps = ['Basic Info', 'Contact & Address', 'Financial & Bank'];

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

const ViewCustomer = ({ open, onClose, customer }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!customer) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `₹${amount.toLocaleString()}`;
  };

  const customerTypeColors = {
    'Premium': { bg: '#FEF3C7', color: '#B45309' },
    'Regular': { bg: '#E0F2FE', color: '#0369A1' },
    'Wholesale': { bg: '#DCFCE7', color: '#166534' },
    'Retail': { bg: '#FCE7F3', color: '#BE185D' }
  }[customer.customer_type] || { bg: '#F1F5F9', color: '#475569' };

  const priorityColors = {
    'High': { bg: '#FEE2E2', color: '#991B1B' },
    'Medium': { bg: '#FEF3C7', color: '#B45309' },
    'Low': { bg: '#DCFCE7', color: '#166534' }
  }[customer.priority] || { bg: '#F1F5F9', color: '#475569' };

  const primaryContact = customer.contacts?.find(c => c.is_primary) || customer.contacts?.[0];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Helper function to render field
  const renderField = (label, value, monospace = false) => (
    <Box>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ 
        fontSize: '0.8rem', 
        fontWeight: 500, 
        color: COLORS.text.primary,
        fontFamily: monospace ? 'monospace' : 'inherit',
        wordBreak: 'break-word'
      }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Stack spacing={2}>
            {/* Header Section - Customer Overview */}
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
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Customer Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {customer.customer_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    Code: {customer.customer_code} | ID: {customer.customer_id}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={customer.customer_type}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 500,
                      bgcolor: customerTypeColors.bg, 
                      color: customerTypeColors.color 
                    }}
                  />
                  <Chip
                    label={customer.priority || 'Regular'}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 500,
                      bgcolor: priorityColors.bg, 
                      color: priorityColors.color 
                    }}
                  />
                </Stack>
              </Stack>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {customer.is_export && (
                  <Chip
                    label="Export Customer"
                    size="small"
                    sx={{ fontSize: '0.65rem', bgcolor: '#E0F2FE', color: '#0369A1' }}
                  />
                )}
                {customer.is_sez && (
                  <Chip
                    label="SEZ Customer"
                    size="small"
                    sx={{ fontSize: '0.65rem', bgcolor: '#FEF3C7', color: '#B45309' }}
                  />
                )}
                {customer.is_credit_hold && (
                  <Chip
                    label="Credit Hold"
                    size="small"
                    sx={{ fontSize: '0.65rem', bgcolor: '#FEE2E2', color: '#991B1B' }}
                  />
                )}
              </Stack>
            </Paper>

            {/* Basic Information */}
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Customer Name', customer.customer_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Customer Code', customer.customer_code)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Industry Segment', customer.industry_segment)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('GSTIN', customer.gstin, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('PAN', customer.pan, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('MSME Number', customer.msme_number)}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Contact & Address
        return (
          <Stack spacing={2}>
            {/* Contact Information */}
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
                <ContactPhoneIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Primary Contact
              </Typography>
              
              {primaryContact ? (
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Contact Name', primaryContact.name)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Designation', primaryContact.designation)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Email
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                          {primaryContact.email || '-'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Mobile
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PhoneIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                          {primaryContact.mobile || '-'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
                  No contact information available
                </Typography>
              )}
              
              {customer.contacts && customer.contacts.length > 1 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: COLORS.text.secondary, 
                    mb: 1 
                  }}>
                    Additional Contacts ({customer.contacts.length - 1})
                  </Typography>
                  {customer.contacts.filter(c => !c.is_primary).map((contact, idx) => (
                    <Box key={idx} sx={{ mt: 1, pt: 1, borderTop: `1px dashed ${COLORS.border}` }}>
                      <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          {renderField('Name', contact.name)}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          {renderField('Mobile', contact.mobile)}
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </>
              )}
            </Paper>

            {/* Billing Address */}
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
                <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Billing Address
              </Typography>
              
              <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, mb: 0.5 }}>
                {customer.billing_address?.line1}
                {customer.billing_address?.line2 && `, ${customer.billing_address.line2}`}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, mb: 0.5 }}>
                {customer.billing_address?.city}, {customer.billing_address?.state} - {customer.billing_address?.pincode}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                {customer.billing_address?.country}
              </Typography>
            </Paper>
          </Stack>
        );

      case 2: // Financial & Bank
        return (
          <Stack spacing={2}>
            {/* Financial Information */}
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
                <CreditCardIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Financial Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Credit Limit', formatCurrency(customer.credit_limit))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Credit Days', customer.credit_days ? `${customer.credit_days} days` : '-')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Payment Terms', customer.payment_terms)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Currency', customer.currency || 'INR')}
                </Grid>
                {customer.credit_outstanding > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                        Credit Outstanding
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#DC2626' }}>
                        {formatCurrency(customer.credit_outstanding)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Bank Details */}
            {(customer.bank_details?.bank_name || customer.bank_details?.account_no) && (
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
                  <SavingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Bank Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Bank Name', customer.bank_details?.bank_name)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Account Name', customer.bank_details?.account_name)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Account Number', customer.bank_details?.account_no, true)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('IFSC Code', customer.bank_details?.ifsc, true)}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Metadata */}
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
                <BadgeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created At', formatDate(customer.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDate(customer.updatedAt))}
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
          Customer Details
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

export default ViewCustomer;