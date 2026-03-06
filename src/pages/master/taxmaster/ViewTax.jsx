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
  Edit as EditIcon,
  Percent as PercentIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

// Color constants (matching ViewCompanies)
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

const steps = ['Tax Information', 'Rates & System Info'];

const ViewTax = ({ open, onClose, tax, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!tax) return null;

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

  // Calculate CGST and SGST if not provided
  const calculateTaxPercentages = (gstPercentage) => {
    const half = gstPercentage / 2;
    return {
      cgst: half,
      sgst: half,
      igst: gstPercentage
    };
  };

  const taxPercentages = calculateTaxPercentages(tax.GSTPercentage);

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

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Tax Information
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Basic Tax Info */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, fontWeight: 600, fontSize: '0.8rem' }}>
                  Basic Information
                </Typography>
                {tax.IsActive ? (
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      border: '1px solid #86efac',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '22px',
                      '& .MuiChip-icon': { fontSize: 14 }
                    }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon sx={{ fontSize: 14 }} />}
                    label="Inactive"
                    size="small"
                    sx={{
                      bgcolor: '#fee2e2',
                      color: '#991b1b',
                      border: '1px solid #fca5a5',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '22px',
                      '& .MuiChip-icon': { fontSize: 14 }
                    }}
                  />
                )}
              </Stack>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <ReceiptIcon sx={{ fontSize: 16 }} />, 
                    'HSN Code', 
                    tax.HSNCode
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <PercentIcon sx={{ fontSize: 16 }} />, 
                    'GST Percentage', 
                    `${tax.GSTPercentage}%`
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Description
              </Typography>
              
              <Box sx={{ 
                backgroundColor: '#F8FAFC', 
                p: 1.5, 
                borderRadius: 1,
                border: '1px solid #E0E0E0'
              }}>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#0f172a' }}>
                  {tax.Description || 'No description provided'}
                </Typography>
              </Box>
            </Paper>
          </Stack>
        );

      case 1: // Rates & System Info
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* GST Tax Rates */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                GST Tax Rates
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField(
                    <PercentIcon sx={{ fontSize: 16 }} />, 
                    'CGST', 
                    `${tax.CGSTPercentage || taxPercentages.cgst}%`
                  )}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField(
                    <PercentIcon sx={{ fontSize: 16 }} />, 
                    'SGST', 
                    `${tax.SGSTPercentage || taxPercentages.sgst}%`
                  )}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField(
                    <PercentIcon sx={{ fontSize: 16 }} />, 
                    'IGST', 
                    `${tax.IGSTPercentage || taxPercentages.igst}%`
                  )}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField(
                    <PercentIcon sx={{ fontSize: 16 }} />, 
                    'Total GST', 
                    `${tax.GSTPercentage}%`,
                    PRIMARY_BLUE
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
                    <AccessTimeIcon sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(tax.CreatedAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <AccessTimeIcon sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(tax.UpdatedAt)
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Additional Info */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Additional Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <InfoIcon sx={{ fontSize: 16 }} />, 
                    'Tax ID', 
                    tax._id || 'N/A'
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
          maxHeight: '580px'
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
            <ReceiptIcon sx={{ color: '#FFFFFF', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '0.9rem'
            }}>
              Tax Details
            </Typography>
          </Stack>
          <Chip
            label={`HSN: ${tax.HSNCode || '-'}`}
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
        height: '360px',
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
                Edit Tax
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewTax;