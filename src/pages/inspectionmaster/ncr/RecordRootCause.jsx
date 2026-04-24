// RecordRootCause.jsx
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
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  AccountTree as AccountTreeIcon,
  Psychology as PsychologyIcon,
  BugReport as BugReportIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Repeat as RepeatIcon,
  Error as ErrorIcon
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

// Root Cause Analysis Methods
const ROOT_CAUSE_METHODS = [
  { 
    value: '5-Why', 
    label: '5-Why Analysis', 
    description: 'Ask "why" five times to trace the root cause',
    icon: <TimelineIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.info,
    template: '1. Why did the problem occur?\n2. Why did that happen?\n3. Why was that the case?\n4. Why did that condition exist?\n5. Why did that root cause persist?'
  },
  { 
    value: 'Fishbone (Ishikawa)', 
    label: 'Fishbone (Ishikawa) Diagram', 
    description: 'Cause and effect analysis across multiple categories',
    icon: <ScienceIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.warning,
    template: 'Categories: Man, Machine, Material, Method, Measurement, Environment'
  },
  { 
    value: 'Fault Tree Analysis', 
    label: 'Fault Tree Analysis', 
    description: 'Top-down deductive analysis of failure paths',
    icon: <AccountTreeIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.info,
    template: 'Break down the failure event into contributing factors and logical relationships'
  },
  { 
    value: 'Kepner-Tregoe', 
    label: 'Kepner-Tregoe Analysis', 
    description: 'Problem analysis and decision making methodology',
    icon: <PsychologyIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.primary,
    template: 'Define problem → Describe problem → Find possible causes → Test causes → Verify true cause'
  }
];

const steps = ['Select Method & Root Cause', 'Escape Cause & Systemic Failure', 'Review & Confirm'];

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

const RecordRootCause = ({ open, onClose, ncrId, ncrNumber, severity, onRootCauseRecorded }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ncrDetails, setNcrDetails] = useState(null);
  const [fetching, setFetching] = useState(false);
  
  const [formData, setFormData] = useState({
    root_cause_method: '',
    root_cause: '',
    escape_cause: '',
    systemic_failure: false
  });

  const [touched, setTouched] = useState({
    root_cause_method: false,
    root_cause: false
  });

  const [existingRootCause, setExistingRootCause] = useState(null);

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
    }
  }, [open, ncrId]);

  const fetchNcrDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrDetails(response.data.data);
        // Pre-fill existing root cause data if any
        if (response.data.data.root_cause_method || response.data.data.root_cause) {
          setFormData({
            root_cause_method: response.data.data.root_cause_method || '',
            root_cause: response.data.data.root_cause || '',
            escape_cause: response.data.data.escape_cause || '',
            systemic_failure: response.data.data.systemic_failure || false
          });
          setExistingRootCause(true);
        }
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
      setError('Failed to load NCR details');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTouched(prev => ({ ...prev, [field]: false }));
    }
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getSelectedMethod = () => {
    return ROOT_CAUSE_METHODS.find(method => method.value === formData.root_cause_method);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.root_cause_method) {
          setError('Please select a root cause analysis method');
          return false;
        }
        if (!formData.root_cause || !formData.root_cause.trim()) {
          setError('Please provide the root cause analysis details');
          return false;
        }
        setError('');
        return true;

      case 1:
        if (!formData.escape_cause || !formData.escape_cause.trim()) {
          setError('Please provide the escape cause (how the defect escaped detection)');
          return false;
        }
        setError('');
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    // Validate all steps
    if (!validateStep(0) || !validateStep(1)) {
      if (!formData.root_cause_method || !formData.root_cause) {
        setActiveStep(0);
      } else if (!formData.escape_cause) {
        setActiveStep(1);
      }
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        root_cause_method: formData.root_cause_method,
        root_cause: formData.root_cause,
        escape_cause: formData.escape_cause,
        systemic_failure: formData.systemic_failure
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/ncrs/${ncrId}/root-cause`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        const message = response.data.data.capa_required 
          ? `Root cause recorded. CAPA required for ${severity} severity NCR.`
          : 'Root cause recorded successfully.';
        
        setSuccess(message);
        
        if (onRootCauseRecorded) {
          onRootCauseRecorded(response.data.data);
        }
        
        // Close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to record root cause');
      }
    } catch (err) {
      console.error('Error recording root cause:', err);
      setError(err.response?.data?.message || 'Failed to record root cause');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      root_cause_method: '',
      root_cause: '',
      escape_cause: '',
      systemic_failure: false
    });
    setTouched({
      root_cause_method: false,
      root_cause: false
    });
    setError('');
    setSuccess('');
    setActiveStep(0);
    setExistingRootCause(null);
    onClose();
  };

  const selectedMethod = getSelectedMethod();
  const requiresCAPA = severity === 'Critical' || severity === 'Major';

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      color: COLORS.text.secondary
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: COLORS.primary,
      fontSize: '0.7rem'
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Info Banner */}
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
                <BugReportIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Root Cause Analysis
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Document the root cause of the failure using structured analysis methods. 
                This helps prevent recurrence and improve quality systems.
              </Typography>
              {requiresCAPA && (
                <Chip 
                  icon={<WarningIcon sx={{ fontSize: '0.7rem' }} />}
                  label="CAPA Required for this severity"
                  size="small"
                  sx={{ 
                    mt: 1, 
                    fontSize: '0.65rem', 
                    height: 24,
                    bgcolor: `${COLORS.error}20`,
                    color: COLORS.error
                  }}
                />
              )}
            </Paper>

            {/* Root Cause Method Selection */}
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
                Analysis Method <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Grid container spacing={1.5}>
                {ROOT_CAUSE_METHODS.map((method) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={method.value}>
                    <Paper
                      onClick={() => handleChange('root_cause_method', method.value)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderRadius: 1.5,
                        border: `1.5px solid ${formData.root_cause_method === method.value ? method.color : COLORS.border}`,
                        bgcolor: formData.root_cause_method === method.value ? `${method.color}10` : COLORS.background.white,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: method.color,
                          bgcolor: `${method.color}05`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ color: method.color }}>{method.icon}</Box>
                        <Typography sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          color: formData.root_cause_method === method.value ? method.color : COLORS.text.primary 
                        }}>
                          {method.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, lineHeight: 1.3 }}>
                        {method.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              {touched.root_cause_method && !formData.root_cause_method && (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 1 }}>
                  Please select an analysis method
                </Typography>
              )}
            </Paper>

            {/* Root Cause Details */}
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
                Root Cause Analysis <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {selectedMethod && (
                <Accordion sx={{ mb: 2, boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1.5 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.8rem' }} />}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                      <InfoIcon sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Method Template Guide
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap', color: COLORS.text.secondary }}>
                        {selectedMethod.template}
                      </Typography>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              )}
              
              <TextField
                fullWidth
                multiline
                rows={6}
                size="small"
                value={formData.root_cause}
                onChange={(e) => handleChange('root_cause', e.target.value)}
                onBlur={() => handleBlur('root_cause')}
                placeholder={`Write your ${formData.root_cause_method || 'root cause'} analysis here...\n\nExample for 5-Why:\n1. Why did the hole dimension go out of tolerance?\n   → Drill bit worn out\n2. Why was the drill bit worn out?\n   → Drill life not tracked\n3. Why was drill life not tracked?\n   → No system to monitor usage\n4. Why is there no monitoring system?\n   → Not included in process design\n5. Why was it not included?\n   → Root cause: Missing requirement in PFMEA`}
                error={touched.root_cause && !formData.root_cause}
                helperText={touched.root_cause && !formData.root_cause ? 'Root cause analysis is required' : ''}
                sx={inputStyle}
              />
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            {/* Escape Cause */}
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
                Escape Cause <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Typography sx={{ 
                fontSize: '0.65rem', 
                color: COLORS.text.tertiary, 
                mb: 1 
              }}>
                How did this defect escape detection through the quality control process?
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formData.escape_cause}
                onChange={(e) => handleChange('escape_cause', e.target.value)}
                placeholder="e.g., In-process inspection frequency too low, Visual inspection missed due to poor lighting, Sampling plan not adequate, Measurement equipment not calibrated..."
                error={!formData.escape_cause}
                helperText={!formData.escape_cause ? 'Escape cause is required' : ''}
                sx={inputStyle}
              />
            </Paper>

            {/* Systemic Failure */}
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
                <RepeatIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Systemic Failure Assessment
              </Typography>
              
              <Typography sx={{ 
                fontSize: '0.65rem', 
                color: COLORS.text.tertiary, 
                mb: 2 
              }}>
                Indicate whether this is a recurring issue that has appeared in past NCRs.
              </Typography>
              
              <RadioGroup
                value={formData.systemic_failure}
                onChange={(e) => handleChange('systemic_failure', e.target.value === 'true')}
                row
              >
                <FormControlLabel 
                  value={false} 
                  control={<Radio size="small" />} 
                  label={
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>One-time Occurrence</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        Isolated incident, not systematic
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value={true} 
                  control={<Radio size="small" />} 
                  label={
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.warning }}>
                        Recurring / Systemic Issue
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        Appeared in past 3+ NCRs
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              
              {formData.systemic_failure && (
                <Alert 
                  severity="warning" 
                  sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}
                >
                  <Typography sx={{ fontSize: '0.7rem' }}>
                    Systemic failure identified. This indicates a process or system-level issue 
                    that requires comprehensive corrective action.
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
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
                Ready to Record Root Cause?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Please review all information before submitting. Once recorded, the root cause 
                analysis will be linked to this NCR.
              </Typography>
            </Paper>

            {/* Root Cause Summary */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5 }}>
                  Root Cause Summary
                </Typography>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Analysis Method</Typography>
                  <Chip 
                    icon={selectedMethod?.icon}
                    label={formData.root_cause_method} 
                    size="small" 
                    sx={{ mt: 0.5, fontSize: '0.7rem' }}
                  />
                </Box>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Root Cause Analysis</Typography>
                  <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>
                      {formData.root_cause || '-'}
                    </Typography>
                  </Paper>
                </Box>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Escape Cause</Typography>
                  <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>
                      {formData.escape_cause || '-'}
                    </Typography>
                  </Paper>
                </Box>
                
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Systemic Failure</Typography>
                  <Chip 
                    icon={formData.systemic_failure ? <RepeatIcon sx={{ fontSize: '0.7rem' }} /> : <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />}
                    label={formData.systemic_failure ? 'Recurring / Systemic Issue' : 'One-time Occurrence'} 
                    size="small" 
                    sx={{ mt: 0.5, fontSize: '0.65rem' }}
                    color={formData.systemic_failure ? 'warning' : 'success'}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* CAPA Required Alert */}
            {requiresCAPA && (
              <Alert 
                severity={formData.systemic_failure ? "warning" : "info"} 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  {formData.systemic_failure 
                    ? "CAPA Required: Systemic failure detected for Critical/Major severity NCR. A CAPA will be created automatically."
                    : "CAPA Required: Critical/Major severity NCR requires CAPA for closure."}
                </Typography>
              </Alert>
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
      onClose={handleClose}
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
          <BugReportIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Record Root Cause
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
          {severity && (
            <Chip 
              label={severity} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22,
                bgcolor: severity === 'Critical' ? `${COLORS.error}20` : severity === 'Major' ? `${COLORS.warning}20` : `${COLORS.success}20`,
                color: severity === 'Critical' ? COLORS.error : severity === 'Major' ? COLORS.warning : COLORS.success,
                ml: 1
              }} 
            />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
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
          disabled={activeStep === 0 || loading || fetching}
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
            onClick={handleClose}
            disabled={loading}
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

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || fetching}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Recording...' : 'Record Root Cause'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || fetching}
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

export default RecordRootCause;