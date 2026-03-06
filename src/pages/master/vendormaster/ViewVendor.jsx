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
  styled
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LocalOffer as GstIcon,
  CreditCard as PanIcon,
  Payment as PaymentIcon,
  Pin as PinIcon,
  LocationCity as CityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';

// Color constants matching the table
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_MAIN = '#0f172a';

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

const steps = ['Basic Information', 'Contact & Tax'];

const ViewVendor = ({ open, onClose, vendor, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!vendor) return null;

  // Helper function to get value with fallback for different field naming conventions
  const getValue = (fieldNames) => {
    for (const fieldName of fieldNames) {
      if (vendor[fieldName] !== undefined && vendor[fieldName] !== null && vendor[fieldName] !== '') {
        return vendor[fieldName];
      }
    }
    return 'Not specified';
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
            color: TEXT_COLOR_MAIN,
            wordBreak: 'break-word'
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );

  // Get vendor type chip
  const getVendorTypeChip = () => {
    const type = getValue(['vendor_type', 'VendorType', 'vendorType']);
    const colors = {
      'RM': { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
      'Process': { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
      'Both': { bg: '#e0f2fe', color: '#0369a1', border: '#7dd3fc' }
    };
    
    const colorSet = colors[type] || colors['Both'];
    
    return (
      <Chip
        label={type}
        size="small"
        sx={{
          bgcolor: colorSet.bg,
          color: colorSet.color,
          border: `1px solid ${colorSet.border}`,
          fontWeight: 600,
          fontSize: '11px',
          height: '20px'
        }}
      />
    );
  };

  // Status chip
  const getStatusChip = () => {
    const isActive = getValue(['is_active', 'isActive', 'IsActive']) === 'true' || 
                     vendor.is_active === true || 
                     vendor.IsActive === true;
    
    return isActive ? (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 12 }} />}
        label="Active"
        size="small"
        sx={{
          bgcolor: '#dcfce7',
          color: '#166534',
          border: '1px solid #86efac',
          fontWeight: 600,
          fontSize: '11px',
          height: '20px',
          '& .MuiChip-icon': { color: '#166534', fontSize: 12 }
        }}
      />
    ) : (
      <Chip
        icon={<CancelIcon sx={{ fontSize: 12 }} />}
        label="Inactive"
        size="small"
        sx={{
          bgcolor: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fca5a5',
          fontWeight: 600,
          fontSize: '11px',
          height: '20px',
          '& .MuiChip-icon': { color: '#991b1b', fontSize: 12 }
        }}
      />
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Stack spacing={1.5}>
            {/* Basic Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <BusinessIcon sx={{ fontSize: 16 }} />, 
                    'Vendor Name', 
                    getValue(['vendor_name', 'VendorName', 'vendorName'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748B', 
                        display: 'block', 
                        fontSize: '10px',
                        fontWeight: 500,
                        ml: 3,
                        mb: 0.2
                      }}
                    >
                      Vendor Type
                    </Typography>
                    <Box sx={{ ml: 3 }}>
                      {getVendorTypeChip()}
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <PaymentIcon sx={{ fontSize: 16 }} />, 
                    'Payment Terms', 
                    getValue(['payment_terms', 'PaymentTerms', 'paymentTerms'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <PanIcon sx={{ fontSize: 16 }} />, 
                    'PAN Number', 
                    getValue(['pan', 'PAN'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <LocationIcon sx={{ fontSize: 16 }} />, 
                    'State', 
                    getValue(['state', 'State'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <PinIcon sx={{ fontSize: 16 }} />, 
                    'Pincode', 
                    getValue(['pincode', 'Pincode'])
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Address Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Address Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <LocationIcon sx={{ fontSize: 16 }} />, 
                    'Street Address', 
                    getValue(['address', 'Address'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <CityIcon sx={{ fontSize: 16 }} />, 
                    'City', 
                    getValue(['city', 'City'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <LocationIcon sx={{ fontSize: 16 }} />, 
                    'State Code', 
                    getValue(['state_code', 'StateCode', 'stateCode'])
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Contact & Tax Details
        return (
          <Stack spacing={1.5}>
            {/* Contact Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <PersonIcon sx={{ fontSize: 16 }} />, 
                    'Contact Person', 
                    getValue(['contact_person', 'ContactPerson', 'contactPerson'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <PhoneIcon sx={{ fontSize: 16 }} />, 
                    'Phone Number', 
                    getValue(['phone', 'Phone'])
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <EmailIcon sx={{ fontSize: 16 }} />, 
                    'Email Address', 
                    getValue(['email', 'Email'])
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Tax Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Tax Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <GstIcon sx={{ fontSize: 16 }} />, 
                    'GSTIN', 
                    getValue(['gstin', 'GSTIN'])
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Metadata */}
            {(vendor.createdAt || vendor.CreatedAt) && (
              <Paper sx={{ p: 1, backgroundColor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '10px' }}>
                  Created: {formatDate(getValue(['createdAt', 'CreatedAt', 'created_at']))}
                </Typography>
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
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '520px'
        }
      }}
    >
      {/* Header with Gradient - Reduced Height */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1,
        px: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BusinessIcon sx={{ color: '#FFFFFF', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '0.9rem'
            }}>
              Vendor Details
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            {getStatusChip()}
            <Chip
              label={`Code: ${getValue(['vendor_code', 'VendorCode', 'vendorCode'])}`}
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
        </Stack>

        {/* Stepper - Compact */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.7rem" sx={{ color: '#FFFFFF' }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 1.5, overflow: 'hidden', height: '300px' }}>
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

export default ViewVendor;