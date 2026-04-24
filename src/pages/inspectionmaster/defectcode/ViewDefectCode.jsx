// ViewDefectCode.jsx
import React, { useState } from 'react';
import {
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
  Divider,
  IconButton,
  Avatar,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Science as ScienceIcon,
  Build as BuildIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Image as ImageIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import BASE_URL from "../../../config/Config";

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF',
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981'
  }
};

// Steps for stepper
const steps = [
  'Basic Information',
  'Processes & Description',
  'Image & Audit Info'
];

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

const ViewDefectCode = ({ open, onClose, defectCode, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  if (!defectCode) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch (e) {
      return '-';
    }
  };

  const getSeverityColor = (severity) => {
    return COLORS.severity[severity] || COLORS.text.secondary;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical':
        return <ScienceIcon sx={{ fontSize: '1rem' }} />;
      case 'Major':
        return <ScienceIcon sx={{ fontSize: '1rem' }} />;
      case 'Minor':
        return <ScienceIcon sx={{ fontSize: '1rem' }} />;
      default:
        return <BuildIcon sx={{ fontSize: '1rem' }} />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Dimensional: COLORS.primary,
      'Visual/Surface': '#0D696C',
      Material: '#074346',
      Functional: '#0D4D45',
      Process: '#0A3D36',
      Quantity: '#072E28',
      Documentation: '#0B5E54',
      Assembly: '#128C7E',
      Welding: '#0F7B6E',
      Painting: '#1A9B8C',
      Electrical: '#0B5E54',
      Packaging: '#0A3D36',
      Other: COLORS.primaryDark
    };
    return colors[category] || COLORS.primary;
  };

  const getAvatarColor = (category) => {
    const colors = {
      Dimensional: COLORS.primary,
      'Visual/Surface': '#0D696C',
      Material: '#074346',
      Functional: '#0D4D45',
      Process: '#0A3D36',
      Quantity: '#072E28',
      Documentation: '#0B5E54',
      Assembly: '#128C7E',
      Welding: '#0F7B6E',
      Painting: '#1A9B8C',
      Electrical: '#0B5E54',
      Packaging: '#0A3D36',
      Other: COLORS.primaryDark
    };
    return colors[category] || COLORS.primary;
  };

  const getDefectCodeInitials = (defectName) => {
    if (!defectName) return 'DC';
    const words = defectName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return defectName.substring(0, 2).toUpperCase();
  };

  // Get full image URL
  const getImageUrl = (photoReference) => {
    if (!photoReference) return null;
    if (photoReference.startsWith('http')) {
      return photoReference;
    }
    return `${BASE_URL}${photoReference}`;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const imageUrl = getImageUrl(defectCode.photo_reference);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Status Banner */}
            <Paper sx={{ 
              p: 1.5, 
              bgcolor: defectCode.is_active ? COLORS.primaryLight : COLORS.background.light,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {defectCode.is_active ? (
                  <ActiveIcon sx={{ color: '#065f46', fontSize: '1.2rem' }} />
                ) : (
                  <InactiveIcon sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                )}
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: defectCode.is_active ? '#065f46' : '#6b7280' }}>
                  {defectCode.is_active ? 'Active' : 'Inactive'}
                </Typography>
              </Stack>
              {defectCode.is_active ? (
                <Typography sx={{ fontSize: '0.7rem', color: '#065f46' }}>
                  Available for use in quality checks
                </Typography>
              ) : (
                <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  Not available for use in quality checks
                </Typography>
              )}
            </Paper>

            {/* Header Section */}
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Defect Code Header
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Defect Code</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                        {defectCode.defect_code}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Severity</Typography>
                      <Chip
                        icon={getSeverityIcon(defectCode.severity_default)}
                        label={defectCode.severity_default}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 500,
                          bgcolor: `${getSeverityColor(defectCode.severity_default)}20`,
                          color: getSeverityColor(defectCode.severity_default)
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Category:</Typography>
                    <Chip
                      label={defectCode.defect_category}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        bgcolor: `${getCategoryColor(defectCode.defect_category)}15`,
                        color: getCategoryColor(defectCode.defect_category)
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Defect Information */}
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
                <CategoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Defect Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Defect Name</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {defectCode.defect_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Defect Category</Typography>
                  <Chip
                    label={defectCode.defect_category}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.7rem',
                      bgcolor: `${getCategoryColor(defectCode.defect_category)}15`,
                      color: getCategoryColor(defectCode.defect_category),
                      fontWeight: 500,
                      height: 24
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Applicable Processes Section */}
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
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Applicable Processes
              </Typography>
              {defectCode.applicable_processes && defectCode.applicable_processes.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {defectCode.applicable_processes.map((process, index) => {
                    const processName = typeof process === 'string' ? process : process.process_name;
                    return (
                      <Chip
                        key={index}
                        label={processName}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          bgcolor: COLORS.background.light,
                          border: `1px solid ${COLORS.border}`,
                          '&:hover': {
                            bgcolor: COLORS.primaryLight,
                            borderColor: COLORS.primary
                          }
                        }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No processes specified
                </Typography>
              )}
            </Paper>

            {/* Description Section */}
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
                Defect Description
              </Typography>
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                  {defectCode.defect_description || 'No description provided'}
                </Typography>
              </Paper>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* Image Section */}
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
                <ImageIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Reference Image
              </Typography>
              <Box sx={{ mt: 1 }}>
                {imageUrl ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imageUrl}
                      alt={defectCode.defect_name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        border: `1px solid ${COLORS.border}`,
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(imageUrl, '_blank')}
                    />
                    <Typography sx={{ 
                      fontSize: '0.65rem', 
                      color: COLORS.text.tertiary, 
                      mt: 1,
                      textAlign: 'center'
                    }}>
                      Click image to view full size
                    </Typography>
                  </Box>
                ) : (
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <ImageIcon sx={{ fontSize: '3rem', color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                      No reference image uploaded
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Paper>

            {/* Audit Information */}
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
                <TimelineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Audit Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {defectCode.created_by?.Username || defectCode.created_by?.username || 'System'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(defectCode.createdAt)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {defectCode.updated_by?.Username || defectCode.updated_by?.username || 'System'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Updated At</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(defectCode.updatedAt)}
                    </Typography>
                  </Stack>
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
      {/* Header */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: getAvatarColor(defectCode.defect_category),
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {getDefectCodeInitials(defectCode.defect_name)}
          </Avatar>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Defect Code Details
          </Typography>
        </Stack>
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
              <StepLabel>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer */}
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

export default ViewDefectCode;