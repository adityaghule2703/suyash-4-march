// ValidateBom.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PlayArrow as ValidateIcon,
  ExpandMore as ExpandMoreIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  ProductionQuantityLimits as ProductionIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
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
  border: '#E3E8EF'
};

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

const steps = ['Validation Initiated', 'Validation Results'];

const ValidateBom = ({ open, onClose, bomId, bomData, onValidationComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleValidate = async () => {
    setValidating(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Call validation API
      const response = await axios.get(
        `${BASE_URL}/api/boms/${bomId}/validate`,
        
        {
            params: { id: bomId },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setValidationResult(response.data.data);
        setActiveStep(1);
        
        // Callback to parent if provided
        if (onValidationComplete) {
          onValidationComplete(response.data.data);
        }
      } else {
        setError(response.data.message || 'Validation failed');
      }
    } catch (err) {
      console.error('Error validating BOM:', err);
      setError(err.response?.data?.message || 'Failed to validate BOM. Please try again.');
    } finally {
      setValidating(false);
    }
  };
  
  const handleClose = () => {
    if (!validating && !loading) {
      setActiveStep(0);
      setValidationResult(null);
      setError('');
      onClose();
    }
  };
  
  const getIssueIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'error':
        return <ErrorIcon sx={{ color: COLORS.error, fontSize: '1.2rem' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: COLORS.warning, fontSize: '1.2rem' }} />;
      case 'info':
        return <InfoIcon sx={{ color: COLORS.info, fontSize: '1.2rem' }} />;
      default:
        return <InfoIcon sx={{ color: COLORS.text.tertiary, fontSize: '1.2rem' }} />;
    }
  };
  
  const getStatusColor = (isValid) => {
    return isValid ? COLORS.success : COLORS.error;
  };
  
  const getStatusIcon = (isValid) => {
    return isValid ? 
      <CheckCircleIcon sx={{ fontSize: '2rem', color: COLORS.success }} /> : 
      <ErrorIcon sx={{ fontSize: '2rem', color: COLORS.error }} />;
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none',
              textAlign: 'center'
            }}>
              <ProductionIcon sx={{ 
                fontSize: '3rem', 
                color: COLORS.primary, 
                mb: 2,
                opacity: 0.7
              }} />
              <Typography sx={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: COLORS.text.primary, 
                mb: 1 
              }}>
                Validate BOM Structure
              </Typography>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                color: COLORS.text.secondary, 
                mb: 3,
                maxWidth: '80%',
                mx: 'auto'
              }}>
                This will validate the BOM structure, check for missing components, 
                verify quantities, and ensure all required fields are properly configured.
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                mb: 3,
                textAlign: 'left'
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  BOM Information
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      BOM ID:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      {bomData?.bom_id || bomId}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Parent Item:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      {bomData?.parent_part_no || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Components Count:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      {bomData?.components?.length || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Stack>
        );
        
      case 1:
        if (!validationResult) {
          return (
            <Stack spacing={2}>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '0.75rem'
                }}
              >
                No validation results available. Please run validation first.
              </Alert>
            </Stack>
          );
        }
        
        return (
          <Stack spacing={2}>
            {/* Header with Status */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                {getStatusIcon(validationResult.is_valid)}
                <Box>
                  <Typography sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: getStatusColor(validationResult.is_valid)
                  }}>
                    {validationResult.is_valid ? 'BOM is Valid' : 'BOM Validation Failed'}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    color: COLORS.text.secondary
                  }}>
                    {validationResult.is_valid 
                      ? 'All validation checks passed successfully' 
                      : 'Please review the issues below and fix them'}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Summary Cards */}
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid size={{ xs: 4 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    textAlign: 'center', 
                    bgcolor: validationResult.summary.error_count > 0 ? `${COLORS.error}10` : COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${validationResult.summary.error_count > 0 ? COLORS.error : COLORS.border}`
                  }}>
                    <ErrorIcon sx={{ fontSize: '1.2rem', color: COLORS.error, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.error }}>
                      {validationResult.summary.error_count}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Errors
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    textAlign: 'center', 
                    bgcolor: validationResult.summary.warning_count > 0 ? `${COLORS.warning}10` : COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${validationResult.summary.warning_count > 0 ? COLORS.warning : COLORS.border}`
                  }}>
                    <WarningIcon sx={{ fontSize: '1.2rem', color: COLORS.warning, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.warning }}>
                      {validationResult.summary.warning_count}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Warnings
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    textAlign: 'center', 
                    bgcolor: validationResult.summary.info_count > 0 ? `${COLORS.info}10` : COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${validationResult.summary.info_count > 0 ? COLORS.info : COLORS.border}`
                  }}>
                    <InfoIcon sx={{ fontSize: '1.2rem', color: COLORS.info, mb: 0.5 }} />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.info }}>
                      {validationResult.summary.info_count}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      Info
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Issues Section */}
            {validationResult.issues && validationResult.issues.length > 0 && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.white, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.border}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primary, 
                  mb: 1.5 
                }}>
                  <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Validation Issues ({validationResult.issues.length})
                </Typography>
                
                {validationResult.issues.map((issue, index) => (
                  <Accordion 
                    key={index}
                    sx={{ 
                      mb: 1, 
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`,
                      '&:before': { display: 'none' },
                      boxShadow: 'none'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        borderRadius: 1.5,
                        bgcolor: COLORS.background.light,
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        {getIssueIcon(issue.type)}
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, flex: 1 }}>
                          {issue.message || issue.title || `Issue ${index + 1}`}
                        </Typography>
                        <Chip 
                          label={issue.type || 'Info'} 
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            fontWeight: 500,
                            bgcolor: issue.type === 'error' ? `${COLORS.error}15` : 
                                    issue.type === 'warning' ? `${COLORS.warning}15` : 
                                    `${COLORS.info}15`,
                            color: issue.type === 'error' ? COLORS.error : 
                                   issue.type === 'warning' ? COLORS.warning : 
                                   COLORS.info,
                          }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        {issue.description && (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {issue.description}
                          </Typography>
                        )}
                        {issue.component && (
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Component:
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              {issue.component}
                            </Typography>
                          </Box>
                        )}
                        {issue.field && (
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Field:
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              {issue.field}
                            </Typography>
                          </Box>
                        )}
                        {issue.suggestion && (
                          <Alert 
                            severity="info" 
                            sx={{ 
                              mt: 1,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              py: 0,
                              '& .MuiAlert-message': { py: 0.5 }
                            }}
                          >
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              <strong>Suggestion:</strong> {issue.suggestion}
                            </Typography>
                          </Alert>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            )}
            
            {/* BOM Details Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                BOM Details
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    BOM ID:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                    {validationResult.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Parent Part No:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                    {validationResult.parent_part_no}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Validation Status:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Chip 
                    label={validationResult.is_valid ? 'Valid' : 'Invalid'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      bgcolor: validationResult.is_valid ? `${COLORS.success}15` : `${COLORS.error}15`,
                      color: validationResult.is_valid ? COLORS.success : COLORS.error,
                    }}
                  />
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
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Validate BOM
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={validating}>
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
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleClose}
          disabled={validating}
          size="small"
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
          {activeStep === 1 ? 'Close' : 'Cancel'}
        </Button>
        
        {activeStep === 0 && (
          <Button
            variant="contained"
            onClick={handleValidate}
            disabled={validating}
            size="small"
            startIcon={validating ? <CircularProgress size={16} /> : <ValidateIcon sx={{ fontSize: '1rem' }} />}
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
            {validating ? 'Validating...' : 'Run Validation'}
          </Button>
        )}
        
        {activeStep === 1 && validationResult && !validationResult.is_valid && (
          <Button
            variant="contained"
            onClick={handleValidate}
            disabled={validating}
            size="small"
            startIcon={validating ? <CircularProgress size={16} /> : <ValidateIcon sx={{ fontSize: '1rem' }} />}
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
            {validating ? 'Re-validating...' : 'Re-validate'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ValidateBom;