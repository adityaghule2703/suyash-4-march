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
  styled,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Inventory,
  Description,
  Category,
  Receipt,
  AccountBalanceWallet,
  Straighten,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Badge as BadgeIcon,
  Factory,
  Grain,
  Style,
  Info as InfoIcon
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

const steps = ['Basic Details', 'Material & Drawing', 'Production & System'];

const ViewItem = ({ open, onClose, item, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!item) return null;

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

  const getItemInitials = (partDescription) => {
    if (!partDescription) return 'I';
    
    const words = partDescription.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return partDescription.substring(0, 2).toUpperCase();
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Details
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Item Profile */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    bgcolor: PRIMARY_BLUE,
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    border: '2px solid #E0E0E0'
                  }}
                >
                  {getItemInitials(item.part_description)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="#101010" sx={{ fontSize: '1.1rem' }}>
                    {item.part_description}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={item.is_active ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
                      label={item.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: item.is_active ? '#dcfce7' : '#fee2e2',
                        color: item.is_active ? '#166534' : '#991b1b',
                        border: item.is_active ? '1px solid #86efac' : '1px solid #fca5a5',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '22px',
                        '& .MuiChip-icon': { fontSize: 14 }
                      }}
                    />
                    <Typography variant="body2" color="#64748B" sx={{ fontSize: '12px' }}>
                      Part No: {item.part_no}
                    </Typography>
                    <Typography variant="body2" color="#64748B" sx={{ fontSize: '12px' }}>
                      Item No: {item.item_no}
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
                    'Item ID', 
                    item.item_id
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Grain sx={{ fontSize: 16 }} />, 
                    'Unit', 
                    item.unit
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Straighten sx={{ fontSize: 16 }} />, 
                    'Density', 
                    item.density ? `${item.density} g/cm³` : null
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Description & Tax Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Description & Tax Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ 
                    backgroundColor: '#F8FAFC', 
                    p: 1.5, 
                    borderRadius: 1,
                    border: '1px solid #E0E0E0',
                    mb: 1
                  }}>
                    <Typography variant="body2" sx={{ fontSize: '13px', color: '#0f172a' }}>
                      {item.part_description || 'No description provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Receipt sx={{ fontSize: 16 }} />, 
                    'HSN Code', 
                    item.hsn_code
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Material & Drawing
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Material Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Category sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Material Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Category sx={{ fontSize: 16 }} />, 
                    'Material', 
                    item.material
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Factory sx={{ fontSize: 16 }} />, 
                    'RM Grade', 
                    item.rm_grade
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Factory sx={{ fontSize: 16 }} />, 
                    'RM Source', 
                    item.rm_source
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Style sx={{ fontSize: 16 }} />, 
                    'RM Type', 
                    item.rm_type
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <Description sx={{ fontSize: 16 }} />, 
                    'RM Specification', 
                    item.rm_spec
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Drawing Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                <Description sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Drawing Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Description sx={{ fontSize: 16 }} />, 
                    'Drawing Number', 
                    item.drawing_no
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Description sx={{ fontSize: 16 }} />, 
                    'Revision Number', 
                    item.revision_no
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField(
                    <Straighten sx={{ fontSize: 16 }} />, 
                    'Strip Size', 
                    item.strip_size ? `${item.strip_size} mm` : null
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2: // Production & System
        return (
          <Stack spacing={1.5} sx={{ pb: 1 }}>
            {/* Production Parameters */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <Straighten sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Production Parameters
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Straighten sx={{ fontSize: 16 }} />, 
                    'Pitch', 
                    item.pitch ? `${item.pitch} mm` : null
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Inventory sx={{ fontSize: 16 }} />, 
                    'Number of Cavities', 
                    item.no_of_cavity
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <Grain sx={{ fontSize: 16 }} />, 
                    'RM Rejection %', 
                    item.rm_rejection_percent ? `${item.rm_rejection_percent}%` : null
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <AccountBalanceWallet sx={{ fontSize: 16 }} />, 
                    'Scrap Realisation %', 
                    item.scrap_realisation_percent ? `${item.scrap_realisation_percent}%` : null
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* System Information */}
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                <AccountBalanceWallet sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> System Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <InfoIcon sx={{ fontSize: 16 }} />, 
                    'Created At', 
                    formatDate(item.createdAt)
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <InfoIcon sx={{ fontSize: 16 }} />, 
                    'Last Updated', 
                    formatDate(item.updatedAt)
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
          maxHeight: '620px'
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
            <Inventory sx={{ color: '#FFFFFF', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '0.9rem'
            }}>
              Item Details
            </Typography>
          </Stack>
          <Chip
            label={`Part No: ${item.part_no || '-'}`}
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
        overflow: 'hidden', 
        height: '420px',
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
                Edit Item
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewItem;