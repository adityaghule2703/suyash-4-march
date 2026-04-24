// CloseCapa.jsx
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  LockOpen as LockOpenIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Build as BuildIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon
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
  'Verify Prerequisites',
  'Review & Confirm',
  'Close CAPA'
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

const CloseCapa = ({ open, onClose, capaId, capaNumber, onCapaClosed }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [capaDetails, setCapaDetails] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [closingInProgress, setClosingInProgress] = useState(false);

  useEffect(() => {
    if (open && capaId) {
      fetchCapaDetails();
    }
  }, [open, capaId]);

  const fetchCapaDetails = async () => {
    setFetching(true);
    setValidationErrors([]);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas/${capaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCapaDetails(response.data.data);
        validateClosingRequirements(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
      setError('Failed to load CAPA details');
    } finally {
      setFetching(false);
    }
  };

  const validateClosingRequirements = (capa) => {
    const errors = [];
    
    // Check if CAPA is already closed
    if (capa.status === 'Closed') {
      errors.push({
        type: 'error',
        message: 'This CAPA is already closed.',
        icon: <ErrorIcon sx={{ fontSize: '1rem' }} />
      });
      setValidationErrors(errors);
      return;
    }
    
    // Check 1: Effectiveness must be verified
    if (!capa.effectiveness_verified) {
      errors.push({
        type: 'error',
        message: 'Effectiveness review not completed. Please verify effectiveness before closing.',
        icon: <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
      });
    }
    
    // Check 2: All corrective actions must be completed
    const correctiveActions = capa.corrective_actions || [];
    const incompleteCorrective = correctiveActions.filter(a => a.status !== 'Completed');
    
    if (incompleteCorrective.length > 0) {
      errors.push({
        type: 'error',
        message: `${incompleteCorrective.length} corrective action(s) are not completed. Please complete all corrective actions before closing.`,
        icon: <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
      });
    }
    
    // Check 3: All preventive actions must be completed
    const preventiveActions = capa.preventive_actions || [];
    const incompletePreventive = preventiveActions.filter(a => a.status !== 'Completed');
    
    if (incompletePreventive.length > 0) {
      errors.push({
        type: 'error',
        message: `${incompletePreventive.length} preventive action(s) are not completed. Please complete all preventive actions before closing.`,
        icon: <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
      });
    }
    
    // Check 4: Effectiveness criteria must be defined
    if (!capa.effectiveness_criteria) {
      errors.push({
        type: 'warning',
        message: 'Effectiveness criteria not defined. It is recommended to define criteria before closing.',
        icon: <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
      });
    }
    
    // Check 5: Effectiveness evidence must be provided
    if (!capa.effectiveness_evidence) {
      errors.push({
        type: 'warning',
        message: 'Effectiveness evidence not provided. It is recommended to provide evidence before closing.',
        icon: <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
      });
    }
    
    setValidationErrors(errors);
  };

  const handleNext = () => {
    const hasBlockingErrors = validationErrors.some(err => err.type === 'error');
    if (hasBlockingErrors && activeStep === 0) {
      setError('Please resolve all blocking issues before closing this CAPA.');
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
        `${BASE_URL}/api/capas/${capaId}/close`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`CAPA ${response.data.data.capa_id} closed successfully.`);
        if (onCapaClosed) {
          onCapaClosed(response.data.data);
        }
        
        // Show success message and close after delay
        setTimeout(() => {
          handleDialogClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to close CAPA');
      }
    } catch (err) {
      console.error('Error closing CAPA:', err);
      setError(err.response?.data?.message || 'Failed to close CAPA');
    } finally {
      setLoading(false);
      setClosingInProgress(false);
    }
  };

  const handleDialogClose = () => {
    setActiveStep(0);
    setError('');
    setSuccess('');
    setCapaDetails(null);
    setValidationErrors([]);
    onClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': COLORS.warning,
      'In Progress': COLORS.info,
      'Under Review': COLORS.info,
      'Effectiveness Under Review': COLORS.info,
      'Completed': COLORS.success,
      'Closed': COLORS.success,
      'Overdue': COLORS.error
    };
    return colors[status] || COLORS.text.tertiary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionCompletionStats = () => {
    if (!capaDetails) return { total: 0, completed: 0, percentage: 0 };
    
    const allActions = [
      ...(capaDetails.corrective_actions || []),
      ...(capaDetails.preventive_actions || [])
    ];
    
    const total = allActions.length;
    const completed = allActions.filter(a => a.status === 'Completed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 100;
    
    return { total, completed, percentage };
  };

  const canClose = () => {
    const hasBlockingErrors = validationErrors.some(err => err.type === 'error');
    return !hasBlockingErrors && capaDetails?.status !== 'Closed';
  };

  const actionStats = getActionCompletionStats();

  const renderStepContent = (step) => {
    if (!capaDetails) return null;

    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* CAPA Summary Card */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  CAPA Summary
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {capaDetails.capa_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Status</Typography>
                    <Chip 
                      label={capaDetails.status} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        bgcolor: `${getStatusColor(capaDetails.status)}20`,
                        color: getStatusColor(capaDetails.status)
                      }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA Type</Typography>
                    <Chip 
                      label={capaDetails.capa_type} 
                      size="small" 
                      sx={{ fontSize: '0.7rem', height: 24 }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Source</Typography>
                    <Chip 
                      label={capaDetails.source} 
                      size="small" 
                      sx={{ fontSize: '0.7rem', height: 24 }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Problem Statement</Typography>
                    <Typography sx={{ fontSize: '0.75rem', mt: 0.3 }}>
                      {capaDetails.problem_statement}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Action Completion Status */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Action Completion Status
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Overall Progress</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{actionStats.percentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={actionStats.percentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: COLORS.background.light,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: actionStats.percentage === 100 ? COLORS.success : COLORS.primary
                      }
                    }} 
                  />
                </Box>
                
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Total Actions</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{actionStats.total}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Completed Actions</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.success }}>
                      {actionStats.completed}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Effectiveness Review Status */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Effectiveness Review Status
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Effectiveness Verified</Typography>
                    <Chip 
                      icon={capaDetails.effectiveness_verified ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <ErrorIcon sx={{ fontSize: '0.7rem' }} />}
                      label={capaDetails.effectiveness_verified ? 'Yes' : 'No'} 
                      size="small" 
                      color={capaDetails.effectiveness_verified ? 'success' : 'error'}
                      sx={{ fontSize: '0.65rem', height: 22, mt: 0.5 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Review Date</Typography>
                    <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                      {formatDate(capaDetails.effectiveness_review_date) || 'Not reviewed'}
                    </Typography>
                  </Grid>
                  {capaDetails.effectiveness_criteria && (
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Effectiveness Criteria</Typography>
                      <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem' }}>{capaDetails.effectiveness_criteria}</Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

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
                Closing Requirements Checklist
              </Typography>
              
              <List dense>
                {/* Effectiveness Verified */}
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {capaDetails.effectiveness_verified ? (
                      <CheckCircleIcon sx={{ color: COLORS.success, fontSize: '1.2rem' }} />
                    ) : (
                      <ErrorIcon sx={{ color: COLORS.error, fontSize: '1.2rem' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Effectiveness Verified
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {capaDetails.effectiveness_verified 
                          ? 'Effectiveness has been verified. ✓'
                          : 'Effectiveness must be verified before closing CAPA'}
                      </Typography>
                    }
                  />
                </ListItem>
                
                {/* Corrective Actions Complete */}
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {capaDetails.corrective_actions?.filter(a => a.status === 'Completed').length === capaDetails.corrective_actions?.length ? (
                      <CheckCircleIcon sx={{ color: COLORS.success, fontSize: '1.2rem' }} />
                    ) : (
                      <ErrorIcon sx={{ color: COLORS.error, fontSize: '1.2rem' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Corrective Actions Completed
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {capaDetails.corrective_actions?.filter(a => a.status === 'Completed').length || 0} of {capaDetails.corrective_actions?.length || 0} completed
                      </Typography>
                    }
                  />
                </ListItem>
                
                {/* Preventive Actions Complete */}
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {capaDetails.preventive_actions?.filter(a => a.status === 'Completed').length === capaDetails.preventive_actions?.length ? (
                      <CheckCircleIcon sx={{ color: COLORS.success, fontSize: '1.2rem' }} />
                    ) : (
                      <ErrorIcon sx={{ color: COLORS.error, fontSize: '1.2rem' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Preventive Actions Completed
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {capaDetails.preventive_actions?.filter(a => a.status === 'Completed').length || 0} of {capaDetails.preventive_actions?.length || 0} completed
                      </Typography>
                    }
                  />
                </ListItem>
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
            {/* Review Summary */}
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
                <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Ready to Close CAPA?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Once closed, this CAPA will be marked as completed and cannot be reopened.
                The linked NCR will also be available for closure.
              </Typography>
            </Paper>

            {/* Final Summary */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
                  Final Summary
                </Typography>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>CAPA Number</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {capaDetails.capa_id}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Actions Completed</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.success }}>
                    {actionStats.completed} of {actionStats.total} actions ({actionStats.percentage}%)
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Effectiveness Review</Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    {capaDetails.effectiveness_verified ? '✓ Effectiveness verified' : '✗ Effectiveness not verified'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />
                
                <Alert 
                  severity="info" 
                  sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                >
                  <Typography sx={{ fontSize: '0.7rem' }}>
                    After closing this CAPA, the linked NCR (if any) can be closed.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
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
                Confirm CAPA Closure
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Once closed, this CAPA will be marked as completed and cannot be reopened.
              </Typography>
            </Paper>

            {canClose() && (
              <Alert 
                severity="success" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  All prerequisites met. Ready to close CAPA.
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
            Close CAPA
          </Typography>
          {capaNumber && (
            <Chip 
              label={capaNumber} 
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
              Loading CAPA details...
            </Typography>
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            
            {closingInProgress && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress sx={{ borderRadius: 1, bgcolor: COLORS.primaryLight }} />
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1, textAlign: 'center' }}>
                  Closing CAPA...
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
              disabled={loading || closingInProgress || !canClose()}
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
              {loading ? 'Closing...' : 'Close CAPA'}
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

export default CloseCapa;