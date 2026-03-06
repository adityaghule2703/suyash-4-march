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
  styled
} from '@mui/material';
import {
  Edit as EditIcon,
  Business,
  LocationOn,
  Email,
  Phone,
  AccountBalance,
  Receipt,
  AccountBalanceWallet,
  Badge as BadgeIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import BASE_URL from '../../../config/Config';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

// 🔥 Modern Stepper Connector with Gradient
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

const steps = ['Company Info', 'Bank & System Info'];

const ViewCompanies = ({ open, onClose, company, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!company) return null;

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
            color: '#0f172a',
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Company Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}> {/* Added pb for bottom padding */}
            {/* Company Profile with Bigger Logo */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  src={getFullLogoUrl(company.logo_path)}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: company.logo_path ? 'transparent' : PRIMARY_BLUE,
                    fontSize: '2rem',
                    fontWeight: 600,
                    border: '2px solid #E0E0E0',
                    '& img': { 
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%'
                    }
                  }}
                >
                  {!company.logo_path && getCompanyInitials(company.company_name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="#101010" sx={{ fontSize: '1.1rem' }}>
                    {company.company_name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Chip
                      label={company.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: company.is_active ? '#dcfce7' : '#F5F5F5',
                        color: company.is_active ? '#166534' : '#616161',
                        border: company.is_active ? '1px solid #86efac' : 'none',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '22px',
                        '& .MuiChip-label': { px: 1.5 }
                      }}
                    />
                    <Typography variant="body2" color="#64748B" sx={{ fontSize: '12px' }}>
                      {company.state} {company.state_code && `(Code: ${company.state_code})`}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: 16 }} />, 
                    'Company ID', 
                    company.company_id
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Receipt sx={{ fontSize: 16 }} />, 
                    'GSTIN', 
                    company.gstin
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Receipt sx={{ fontSize: 16 }} />, 
                    'PAN', 
                    company.pan
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Contact Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <LocationOn sx={{ fontSize: 16 }} />, 
                    'Address', 
                    company.address
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Email sx={{ fontSize: 16 }} />, 
                    'Email', 
                    company.email
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Phone sx={{ fontSize: 16 }} />, 
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
          <Stack spacing={1.5} sx={{ pb: 1 }}> {/* Added pb for bottom padding */}
            {/* Bank Details */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Bank Details
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <AccountBalance sx={{ fontSize: 16 }} />, 
                    'Bank Name', 
                    company.bank_details?.bank_name
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <LocationOn sx={{ fontSize: 16 }} />, 
                    'Branch', 
                    company.bank_details?.branch
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <AccountBalanceWallet sx={{ fontSize: 16 }} />, 
                    'Account Number', 
                    company.bank_details?.account_no
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: 16 }} />, 
                    'IFSC Code', 
                    company.bank_details?.ifsc
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* System Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                System Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(company.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <BadgeIcon sx={{ fontSize: 16 }} />, 
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
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '580px' // Increased height for better spacing
        }
      }}
    >
      {/* Header with Gradient - Compact */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1,
        px: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Business sx={{ color: '#FFFFFF', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '0.9rem'
            }}>
              Company Details
            </Typography>
          </Stack>
          <Chip
            label={`ID: ${company.company_id || '-'}`}
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

        {/* Stepper - Compact with custom icons */}
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
        overflow: 'hidden', 
        height: '360px', // Increased height
        '&:last-child': {
          pb: 1.5
        }
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions - Compact */}
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
            {activeStep === 1 && (
              <Button
                onClick={handleBack}
                size="small"
                startIcon={<NavigateBeforeIcon />}
                sx={{ color: '#666', fontSize: '0.8rem' }}
              >
                Back
              </Button>
            )}
            
            {activeStep === 0 ? (
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
                  onEdit();
                }}
                startIcon={<EditIcon />}
                size="small"
                sx={{
                  backgroundColor: PRIMARY_BLUE,
                  fontSize: '0.8rem',
                  '&:hover': { backgroundColor: '#0e7490' }
                }}
              >
                Edit
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewCompanies;