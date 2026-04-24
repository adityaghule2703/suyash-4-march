// CloseNcr.jsx
import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Chip,
  Box,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tooltip,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E6F4F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const STEPS = [
  'Verify Requirements',
  'Review & Confirm',
  'Close NCR'
];

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

const CloseNcr = ({ open, onClose, ncrId, ncrNumber, onNcrClosed }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [ncrDetails, setNcrDetails] = useState(null);
  const [capaDetails, setCapaDetails] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [recurrenceCheck, setRecurrenceCheck] = useState(false);
  const [closingInProgress, setClosingInProgress] = useState(false);

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
    }
  }, [open, ncrId]);

  const fetchNcrDetails = async () => {
    setFetching(true);
    setValidationErrors([]);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrDetails(response.data.data);
        
        // If CAPA is linked, fetch CAPA details
        if (response.data.data.capa_id) {
          await fetchCapaDetails(response.data.data.capa_id);
        }
        
        // Validate closing requirements
        validateClosingRequirements(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
      setError('Failed to load NCR details');
    } finally {
      setFetching(false);
    }
  };

  const fetchCapaDetails = async (capaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas/${capaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCapaDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
    }
  };

  const validateClosingRequirements = (ncr) => {
    const errors = [];
    
    // Check if NCR is already closed
    if (ncr.status === 'Closed') {
      errors.push({
        type: 'error',
        message: 'This NCR is already closed.',
        icon: <ErrorIcon sx={{ fontSize: '1rem' }} />
      });
      setValidationErrors(errors);
      return;
    }
    
    // Check 1: For Critical/Major severity with systemic failure, CAPA must be linked
    if ((ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure === true) {
      if (!ncr.capa_id) {
        errors.push({
          type: 'error',
          message: 'CAPA is required for this NCR (Critical/Major severity with systemic failure). Please link a CAPA before closing.',
          icon: <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
        });
      } else if (capaDetails && capaDetails.status !== 'Closed') {
        errors.push({
          type: 'error',
          message: `Linked CAPA (${capaDetails.capa_id}) is not closed yet. Current status: ${capaDetails.status}. Please close the CAPA first.`,
          icon: <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
        });
      }
    }
    
    // Check 2: For Critical/Major severity without systemic failure, CAPA is recommended but not required
    if ((ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure !== true) {
      if (!ncr.capa_id) {
        errors.push({
          type: 'warning',
          message: 'CAPA is recommended for this NCR (Critical/Major severity). Consider creating a CAPA before closing.',
          icon: <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
        });
      }
    }
    
    // Check 3: Check if disposition is set
    if (!ncr.disposition) {
      errors.push({
        type: 'warning',
        message: 'Disposition not set. Please set a disposition before closing.',
        icon: <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
      });
    }
    
    // Check 4: Check if root cause is recorded for Critical/Major
    if ((ncr.severity === 'Critical' || ncr.severity === 'Major') && !ncr.root_cause) {
      errors.push({
        type: 'warning',
        message: 'Root cause analysis not recorded. It is recommended to record root cause before closing.',
        icon: <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
      });
    }
    
    setValidationErrors(errors);
  };

  const handleNext = () => {
    // Check if there are blocking errors before proceeding
    const hasBlockingErrors = validationErrors.some(err => err.type === 'error');
    if (hasBlockingErrors && activeStep === 0) {
      setError('Please resolve all blocking issues before closing this NCR.');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleClose = async () => {
    setClosingInProgress(true);
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/ncrs/${ncrId}/close`,
        { recurrence_check: recurrenceCheck },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`NCR ${response.data.data.ncr_number} closed successfully.`);
        if (onNcrClosed) {
          onNcrClosed(response.data.data);
        }
        
        // Show success message and close after delay
        setTimeout(() => {
          handleDialogClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to close NCR');
      }
    } catch (err) {
      console.error('Error closing NCR:', err);
      setError(err.response?.data?.message || 'Failed to close NCR');
    } finally {
      setLoading(false);
      setClosingInProgress(false);
    }
  };

  const handleDialogClose = () => {
    setActiveStep(0);
    setError('');
    setSuccess('');
    setRecurrenceCheck(false);
    setNcrDetails(null);
    setCapaDetails(null);
    setValidationErrors([]);
    onClose();
  };

  const getSeverityColor = (severity) => {
    return COLORS.severity?.[severity] || COLORS.text.secondary;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': COLORS.info,
      'Under Investigation': COLORS.warning,
      'Disposition Given': COLORS.info,
      'CAPA Initiated': COLORS.info,
      'Pending Verification': COLORS.warning,
      'Closed': COLORS.success,
      'Escalated': COLORS.error
    };
    return colors[status] || COLORS.text.tertiary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canClose = () => {
    const hasBlockingErrors = validationErrors.some(err => err.type === 'error');
    return !hasBlockingErrors && ncrDetails?.status !== 'Closed';
  };

  const renderStepContent = (step) => {
    if (!ncrDetails) return null;

    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* NCR Summary Card */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  NCR Summary
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>NCR Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {ncrDetails.ncr_number}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Status</Typography>
                    <Chip 
                      label={ncrDetails.status} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        bgcolor: `${getStatusColor(ncrDetails.status)}20`,
                        color: getStatusColor(ncrDetails.status)
                      }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Severity</Typography>
                    <Chip 
                      label={ncrDetails.severity} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        bgcolor: `${getSeverityColor(ncrDetails.severity)}20`,
                        color: getSeverityColor(ncrDetails.severity)
                      }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>NCR Type</Typography>
                    <Chip 
                      label={ncrDetails.ncr_type} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 24 }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Systemic Failure</Typography>
                    <Chip 
                      label={ncrDetails.systemic_failure ? 'Yes - Recurring Issue' : 'No - One-time Occurrence'} 
                      size="small" 
                      color={ncrDetails.systemic_failure ? 'warning' : 'success'}
                      sx={{ fontSize: '0.65rem', height: 22 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Disposition</Typography>
                    <Chip 
                      label={ncrDetails.disposition || 'Not Set'} 
                      size="small" 
                      color={ncrDetails.disposition ? 'info' : 'default'}
                      sx={{ fontSize: '0.65rem', height: 22 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* CAPA Information if linked */}
            {capaDetails && (
              <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                    <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Linked CAPA Information
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA ID</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        {capaDetails.capa_id}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA Status</Typography>
                      <Chip 
                        label={capaDetails.status} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24,
                          bgcolor: capaDetails.status === 'Closed' ? `${COLORS.success}20` : `${COLORS.warning}20`,
                          color: capaDetails.status === 'Closed' ? COLORS.success : COLORS.warning
                        }} 
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Validation Requirements */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <LockIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Closing Requirements Checklist
              </Typography>
              
              <List dense>
                {/* CAPA Requirement */}
                {(ncrDetails.severity === 'Critical' || ncrDetails.severity === 'Major') && ncrDetails.systemic_failure === true && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {ncrDetails.capa_id && capaDetails?.status === 'Closed' ? (
                        <CheckCircleIcon sx={{ color: COLORS.success, fontSize: '1.2rem' }} />
                      ) : (
                        <ErrorIcon sx={{ color: COLORS.error, fontSize: '1.2rem' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          CAPA Requirement
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {ncrDetails.capa_id 
                            ? capaDetails?.status === 'Closed' 
                              ? `CAPA ${capaDetails.capa_id} is closed. ✓`
                              : `CAPA ${capaDetails.capa_id} must be closed before NCR closure. Current status: ${capaDetails?.status}`
                            : 'CAPA must be linked and closed for Critical/Major severity with systemic failure'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
                
                {/* Disposition Requirement */}
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {ncrDetails.disposition ? (
                      <CheckCircleIcon sx={{ color: COLORS.success, fontSize: '1.2rem' }} />
                    ) : (
                      <WarningIcon sx={{ color: COLORS.warning, fontSize: '1.2rem' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Disposition Set
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {ncrDetails.disposition 
                          ? `Disposition "${ncrDetails.disposition}" has been set. ✓`
                          : 'Disposition must be set before closing NCR'}
                      </Typography>
                    }
                  />
                </ListItem>
                
                {/* Root Cause Requirement - Recommended */}
                {(ncrDetails.severity === 'Critical' || ncrDetails.severity === 'Major') && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {ncrDetails.root_cause ? (
                        <CheckCircleIcon sx={{ color: COLORS.success, fontSize: '1.2rem' }} />
                      ) : (
                        <InfoIcon sx={{ color: COLORS.info, fontSize: '1.2rem' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          Root Cause Analysis
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {ncrDetails.root_cause 
                            ? 'Root cause analysis completed. ✓'
                            : 'Recommended: Record root cause analysis before closing'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            {/* Warnings and Errors */}
            {validationErrors.length > 0 && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: validationErrors.some(e => e.type === 'error') ? `${COLORS.error}05` : `${COLORS.warning}05`,
                borderRadius: 2, 
                border: `1px solid ${validationErrors.some(e => e.type === 'error') ? COLORS.error : COLORS.warning}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: validationErrors.some(e => e.type === 'error') ? COLORS.error : COLORS.warning,
                  mb: 1
                }}>
                  {validationErrors.some(e => e.type === 'error') ? 'Blocking Issues' : 'Recommendations'}
                </Typography>
                {validationErrors.map((err, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {err.icon}
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      {err.message}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            {/* SLA Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                SLA Information
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                {(ncrDetails.severity === 'Critical' || ncrDetails.severity === 'Major') && ncrDetails.systemic_failure === true
                  ? 'A CAPA must be initiated within 7 days of NCR closure as per business SLA.'
                  : 'No specific SLA requirements for this NCR.'}
              </Typography>
            </Paper>

            {/* Recurrence Check */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Final Verification
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={recurrenceCheck}
                    onChange={(e) => setRecurrenceCheck(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      Verify that the issue will not recur
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Confirm that corrective actions have been verified and the problem is not expected to recur
                    </Typography>
                  </Box>
                }
              />
            </Paper>

            {/* Summary of Actions */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                Actions Summary
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AssignmentIcon sx={{ color: COLORS.success, fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Disposition"
                    secondary={ncrDetails.disposition || 'Not set'}
                    primaryTypographyProps={{ fontSize: '0.7rem' }}
                    secondaryTypographyProps={{ fontSize: '0.65rem' }}
                  />
                </ListItem>
                
                {ncrDetails.capa_id && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <BuildIcon sx={{ color: COLORS.success, fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="CAPA Linked"
                      secondary={`${capaDetails?.capa_id} (Status: ${capaDetails?.status})`}
                      primaryTypographyProps={{ fontSize: '0.7rem' }}
                      secondaryTypographyProps={{ fontSize: '0.65rem' }}
                    />
                  </ListItem>
                )}
                
                {ncrDetails.root_cause && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VerifiedIcon sx={{ color: COLORS.success, fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Root Cause Analysis"
                      secondary="Completed"
                      primaryTypographyProps={{ fontSize: '0.7rem' }}
                      secondaryTypographyProps={{ fontSize: '0.65rem' }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            {/* Work Order Release Info (if applicable) */}
            {ncrDetails.wo_id && (
              <Alert 
                severity="info" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem' }}>
                  Upon closing, the associated Work Order will be released from hold.
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <LockOpenIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Ready to Close NCR?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Once closed, this NCR will be marked as completed and cannot be reopened. 
                All associated records will be finalized.
              </Typography>
            </Paper>

            {recurrenceCheck && (
              <Alert 
                severity="success" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  Recurrence verification confirmed. Ready to close.
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockOpenIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Close NCR
          </Typography>
          {ncrNumber && (
            <Chip 
              label={ncrNumber} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                ml: 1
              }} 
            />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={handleDialogClose}
          disabled={loading}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': { color: COLORS.text.secondary }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {STEPS.map((label) => (
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading NCR details...
            </Typography>
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            
            {closingInProgress && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress sx={{ borderRadius: 1, bgcolor: COLORS.primaryLight }} />
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1, textAlign: 'center' }}>
                  Closing NCR...
                </Typography>
              </Box>
            )}
            
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                  mt: 2,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 1.5,
                  mt: 2,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {success}
              </Alert>
            )}
          </>
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
          onClick={handleBack}
          disabled={activeStep === 0 || loading || closingInProgress}
          size="small"
          startIcon={<span>←</span>}
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
            onClick={handleDialogClose}
            disabled={loading || closingInProgress}
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
            Cancel
          </Button>

          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleClose}
              disabled={loading || closingInProgress || !canClose() || !recurrenceCheck}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <LockOpenIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark },
                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
              }}
            >
              {loading ? 'Closing...' : 'Close NCR'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || fetching}
              endIcon={<span>→</span>}
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

export default CloseNcr;