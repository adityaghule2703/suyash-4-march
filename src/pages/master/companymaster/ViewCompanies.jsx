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
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Badge as BadgeIcon,
  Info as InfoIcon,
  ContactPhone as ContactPhoneIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';
import BASE_URL from '../../../config/Config';

// Color constants matching ViewBom style
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#00B4D8',
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

const steps = ['Company Info', 'Bank & System Info'];

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

const ViewCompanies = ({ open, onClose, company, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!company) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return companyName.substring(0, 2).toUpperCase();
  };

  const getFullLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    if (logoPath.startsWith('http')) return logoPath;
    const cleanLogoPath = logoPath.startsWith('/') ? logoPath.substring(1) : logoPath;
    return `${BASE_URL}/${cleanLogoPath}`;
  };

  // Helper function to render field with icon
  const renderField = (icon, label, value) => (
    <Box>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
        {icon} {label}
      </Typography>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary, wordBreak: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Company Info
        return (
          <Stack spacing={2}>
            {/* Header Section - Company Overview */}
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
                Company Overview
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  src={getFullLogoUrl(company.logo_path)}
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: company.logo_path ? 'transparent' : COLORS.primary,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    border: `1px solid ${COLORS.border}`,
                    '& img': { 
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%'
                    }
                  }}
                >
                  {!company.logo_path && getCompanyInitials(company.company_name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {company.company_name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Chip
                      label={company.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        bgcolor: company.is_active ? '#dcfce7' : '#F5F5F5',
                        color: company.is_active ? '#166534' : COLORS.text.secondary,
                        height: '22px'
                      }}
                    />
                    <Chip
                      label={`ID: ${company.company_id || '-'}`}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        bgcolor: COLORS.background.white,
                        border: `1px solid ${COLORS.border}`,
                        height: '22px'
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    State
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {company.state || '-'} {company.state_code && `(${company.state_code})`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Country
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {company.country || '-'}
                  </Typography>
                </Grid>
              </Grid>
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
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <ReceiptIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'GSTIN', 
                    company.gstin
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <ReceiptIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'PAN', 
                    company.pan
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'CIN', 
                    company.cin
                  )}
                </Grid>
              </Grid>
            </Paper>

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
                Contact Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <LocationOnIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Address', 
                    company.address
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <EmailIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Email', 
                    company.email
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <PhoneIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Phone', 
                    company.phone
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Bank & System Info
        return (
          <Stack spacing={2}>
            {/* Bank Details */}
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
                  {renderField(
                    <AccountBalanceIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Bank Name', 
                    company.bank_details?.bank_name
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <LocationOnIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Branch', 
                    company.bank_details?.branch
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <AccountBalanceWalletIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Account Number', 
                    company.bank_details?.account_no
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'IFSC Code', 
                    company.bank_details?.ifsc
                  )}
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                System Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Created At', 
                    formatDate(company.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.5 }} />, 
                    'Last Updated', 
                    formatDate(company.updatedAt)
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
          Company Details
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

export default ViewCompanies;