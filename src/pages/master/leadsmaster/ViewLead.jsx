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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  LocalOffer as LocalOfferIcon,
  Badge as BadgeIcon,
  AttachMoney as AttachMoneyIcon
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

const steps = ['Lead Info', 'Contact & Items', 'Additional Info'];

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

const ViewLead = ({ open, onClose, lead }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!lead) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusColors = {
    'New': { bg: '#E0F2FE', color: '#0369A1' },
    'Contacted': { bg: '#FEF3C7', color: '#B45309' },
    'Qualified': { bg: '#DCFCE7', color: '#166534' },
    'Proposal': { bg: '#E0E7FF', color: '#4338CA' },
    'Negotiation': { bg: '#FCE7F3', color: '#BE185D' },
    'Closed Won': { bg: '#D1FAE5', color: '#047857' },
    'Closed Lost': { bg: '#FEE2E2', color: '#991B1B' }
  }[lead.status] || { bg: '#F1F5F9', color: '#475569' };

  const priorityColors = {
    'High': { bg: '#FEE2E2', color: '#991B1B' },
    'Medium': { bg: '#FEF3C7', color: '#B45309' },
    'Low': { bg: '#DCFCE7', color: '#166534' }
  }[lead.priority] || { bg: '#F1F5F9', color: '#475569' };

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
      case 0: // Lead Info
        return (
          <Stack spacing={2}>
            {/* Header Section - Lead Overview */}
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
                Lead Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {lead.subject}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    Lead ID: {lead.lead_id}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={lead.status}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 500,
                      bgcolor: statusColors.bg, 
                      color: statusColors.color 
                    }}
                  />
                  <Chip
                    label={lead.priority}
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
            </Paper>

            {/* Company Information */}
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
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Company Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Company Name', lead.company_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Industry', lead.industry)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Lead Source', lead.lead_source)}
                  {lead.lead_source_detail && (
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      Detail: {lead.lead_source_detail}
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Estimated Value', lead.estimated_value ? `₹${lead.estimated_value.toLocaleString()}` : '-')}
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1: // Contact & Items
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
                <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Contact Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Contact Name', lead.contact_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Designation', lead.designation)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Email
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <EmailIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                        {lead.contact_email || '-'}
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
                        {lead.contact_mobile || '-'}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Enquired Items */}
            {lead.enquired_items && lead.enquired_items.length > 0 && (
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
                  <ShoppingCartIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Enquired Items ({lead.enquired_items.length})
                </Typography>
                
                <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: COLORS.background.light }}>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, align: 'right' }}>Target Price</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Material Grade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lead.enquired_items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{item.quantity}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.unit}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{item.target_price ? `₹${item.target_price}` : '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.material_grade || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Stack>
        );

      case 2: // Additional Info
        return (
          <Stack spacing={2}>
            {/* Feasibility Information */}
            {lead.feasibility_status && (
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
                  <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Feasibility Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Feasibility Status', lead.feasibility_status)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Feasibility Date', formatDate(lead.feasibility_date))}
                  </Grid>
                  {lead.feasibility_notes && (
                    <Grid size={{ xs: 12 }}>
                      {renderField('Feasibility Notes', lead.feasibility_notes)}
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
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
                  <LocalOfferIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Tags
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {lead.tags.map((tag, idx) => (
                    <Chip 
                      key={idx} 
                      label={tag} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem',
                        bgcolor: COLORS.background.light,
                        border: `1px solid ${COLORS.border}`
                      }} 
                    />
                  ))}
                </Box>
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
                  {renderField('Created At', formatDate(lead.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDate(lead.updatedAt))}
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
          Lead Details
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

export default ViewLead;