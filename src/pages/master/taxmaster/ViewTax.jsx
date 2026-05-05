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
  Percent as PercentIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  AccountBalance as AccountBalanceIcon
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

const steps = ['Tax Information', 'Rates & System Info'];

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

const ViewTax = ({ open, onClose, tax }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!tax) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Tax Information
        return (
          <Stack spacing={2}>
            {/* Header Section - Tax Overview */}
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
                <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Tax Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    HSN Code: {tax.HSNCode || '-'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    Tax ID: {tax._id || 'N/A'}
                  </Typography>
                </Box>
                {tax.IsActive ? (
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                    label="Active"
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 500,
                      bgcolor: '#DCFCE7', 
                      color: '#166534'
                    }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon sx={{ fontSize: 14 }} />}
                    label="Inactive"
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 500,
                      bgcolor: '#FEE2E2', 
                      color: '#991B1B'
                    }}
                  />
                )}
              </Stack>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('HSN Code', tax.HSNCode, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('GST Percentage', `${tax.GSTPercentage}%`, false, true)}
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
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
                Description
              </Typography>
              
              <Box sx={{ 
                bgcolor: COLORS.background.light, 
                p: 1.5, 
                borderRadius: 1,
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                  {tax.Description || 'No description provided'}
                </Typography>
              </Box>
            </Paper>
          </Stack>
        );

      case 1: // Rates & System Info
        return (
          <Stack spacing={2}>
            {/* GST Tax Rates */}
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
                <PercentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                GST Tax Rates
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField('CGST', `${tax.CGSTPercentage || taxPercentages.cgst}%`)}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField('SGST / UTGST', `${tax.SGSTPercentage || taxPercentages.sgst}%`)}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField('IGST', `${tax.IGSTPercentage || taxPercentages.igst}%`)}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  {renderField('Total GST', `${tax.GSTPercentage}%`, false, true)}
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
                <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created At', formatDate(tax.CreatedAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDate(tax.UpdatedAt))}
                </Grid>
              </Grid>
            </Paper>

            {/* Tax Calculation Info */}
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
                Tax Calculation Information
              </Typography>
              
              <Box sx={{ 
                bgcolor: COLORS.background.light, 
                p: 1.5, 
                borderRadius: 1,
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 1 }}>
                  For a transaction of ₹100:
                </Typography>
                <Stack spacing={0.5}>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    • CGST: ₹{(tax.GSTPercentage / 2).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    • SGST/UTGST: ₹{(tax.GSTPercentage / 2).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    • IGST: ₹{tax.GSTPercentage.toFixed(2)} (for interstate transactions)
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mt: 0.5 }}>
                    Total Tax: ₹{tax.GSTPercentage.toFixed(2)}
                  </Typography>
                </Stack>
              </Box>
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
          Tax Details
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

export default ViewTax;