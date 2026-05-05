import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from "@mui/material";
import {
  Gavel as GavelIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  FormatListNumbered as FormatListNumberedIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

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

const steps = ['Basic Info', 'Content & System Info'];

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

const ViewTermsAndConditions = ({ open, onClose, term }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termData, setTermData] = useState(null);

  /* ================= FETCH TERM BY ID ================= */

  useEffect(() => {
    if (open && term?._id) {
      fetchTermById(term._id);
    }
  }, [open, term]);

  const fetchTermById = async (id) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/api/terms-conditions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setTermData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch term details");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load term details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
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
      case 0: // Basic Info
        return (
          <Stack spacing={2}>
            {/* Header Section - Term Overview */}
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
                <GavelIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Term Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {termData?.Title || 'Untitled Term'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    Term ID: {termData?._id || 'N/A'}
                  </Typography>
                </Box>
                {termData?.IsActive ? (
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
                  {renderField('Sequence Number', termData?.Sequence, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Title', termData?.Title, false, true)}
                </Grid>
              </Grid>
            </Paper>

            {/* Basic Information Card */}
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
                  {renderField('Sequence Number', termData?.Sequence, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Status', termData?.IsActive ? 'Active' : 'Inactive')}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Content & System Info
        return (
          <Stack spacing={2}>
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
                Term Content
              </Typography>
              
              <Box sx={{ 
                bgcolor: COLORS.background.light, 
                p: 1.5, 
                borderRadius: 1,
                border: `1px solid ${COLORS.border}`,
                maxHeight: '280px',
                overflow: 'auto'
              }}>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, whiteSpace: 'pre-wrap' }}>
                  {termData?.Description || 'No description provided'}
                </Typography>
              </Box>
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
                  {renderField('Created At', formatDate(termData?.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDate(termData?.updatedAt))}
                </Grid>
              </Grid>
            </Paper>

           
          </Stack>
        );

      default:
        return null;
    }
  };

  if (!term) return null;

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
          Terms & Conditions Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      {/* Loading State */}
      {loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ color: COLORS.primary }} />
          <Typography sx={{ mt: 2, fontSize: '0.8rem', color: COLORS.text.secondary }}>
            Loading term details...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box sx={{ p: 2.5 }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-message': { fontSize: '0.8rem' }
            }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Content */}
      {!loading && !error && termData && (
        <>
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
        </>
      )}

      {/* Footer Actions - Only show when not loading */}
      {!loading && (
        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || !termData}
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
                disabled={!termData}
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
      )}
    </Dialog>
  );
};

export default ViewTermsAndConditions;