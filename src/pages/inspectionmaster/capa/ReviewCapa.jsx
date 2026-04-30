// ReviewCapa.jsx
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
  Chip,
  Box,
  IconButton,
  Divider,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  LinearProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Verified as VerifiedIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Replay as ReplayIcon
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

// Effectiveness Criteria Examples
const CRITERIA_EXAMPLES = [
  {
    title: 'Zero Recurrence',
    description: 'Zero recurrence of this defect code in next 3 production runs',
    icon: <VerifiedIcon sx={{ fontSize: '0.9rem' }} />
  },
  {
    title: 'Process Capability',
    description: 'Cpk > 1.33 maintained for 30 days',
    icon: <TrendingUpIcon sx={{ fontSize: '0.9rem' }} />
  },
  {
    title: 'Customer Complaints',
    description: 'No customer complaints for 6 months',
    icon: <BuildIcon sx={{ fontSize: '0.9rem' }} />
  },
  {
    title: 'Defect Rate',
    description: 'Defect rate reduced by 90% for 3 consecutive months',
    icon: <AssessmentIcon sx={{ fontSize: '0.9rem' }} />
  },
  {
    title: 'Audit Findings',
    description: 'No recurrence in subsequent internal audits',
    icon: <DescriptionIcon sx={{ fontSize: '0.9rem' }} />
  }
];

const ReviewCapa = ({ open, onClose, capaId, capaNumber, onEffectivenessRecorded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [capaDetails, setCapaDetails] = useState(null);
  const [formData, setFormData] = useState({
    effectiveness_verified: null,
    effectiveness_criteria: '',
    effectiveness_evidence: '',
    effectiveness_notes: ''
  });

  const [touched, setTouched] = useState({
    effectiveness_verified: false,
    effectiveness_criteria: false
  });

  useEffect(() => {
    if (open && capaId) {
      fetchCapaDetails();
    }
  }, [open, capaId]);

  const fetchCapaDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/capas/${capaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCapaDetails(response.data.data);
        // Pre-fill existing effectiveness data if any
        if (response.data.data.effectiveness_verified !== undefined) {
          setFormData({
            effectiveness_verified: response.data.data.effectiveness_verified,
            effectiveness_criteria: response.data.data.effectiveness_criteria || '',
            effectiveness_evidence: response.data.data.effectiveness_evidence || '',
            effectiveness_notes: response.data.data.effectiveness_notes || ''
          });
        }
      }
    } catch (err) {
      console.error('Error fetching CAPA details:', err);
      setError('Failed to load CAPA details');
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

  const handleUseExample = (example) => {
    setFormData(prev => ({ ...prev, effectiveness_criteria: example.description }));
  };

  const validateForm = () => {
    if (formData.effectiveness_verified === null) {
      setError('Please indicate whether the CAPA was effective');
      setTouched(prev => ({ ...prev, effectiveness_verified: true }));
      return false;
    }
    
    if (!formData.effectiveness_criteria?.trim()) {
      setError('Please define effectiveness criteria');
      setTouched(prev => ({ ...prev, effectiveness_criteria: true }));
      return false;
    }
    

    
    if (!formData.effectiveness_evidence?.trim()) {
      setError('Please provide evidence of effectiveness');
      return false;
    }
    
    if (formData.effectiveness_evidence.length < 20) {
      setError('Effectiveness evidence should be more detailed (minimum 20 characters)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        effectiveness_verified: formData.effectiveness_verified,
        effectiveness_criteria: formData.effectiveness_criteria,
        effectiveness_evidence: formData.effectiveness_evidence,
        effectiveness_notes: formData.effectiveness_notes || ''
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/capas/${capaId}/effectiveness`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        const message = formData.effectiveness_verified 
          ? 'CAPA effectiveness verified successfully. CAPA will be closed.'
          : 'Effectiveness review recorded. CAPA not effective - a new CAPA will be created.';
        
        setSuccess(message);
        
        if (onEffectivenessRecorded) {
          onEffectivenessRecorded(response.data.data);
        }
        
        // Close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to record effectiveness review');
      }
    } catch (err) {
      console.error('Error recording effectiveness review:', err);
      setError(err.response?.data?.message || 'Failed to record effectiveness review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      effectiveness_verified: null,
      effectiveness_criteria: '',
      effectiveness_evidence: '',
      effectiveness_notes: ''
    });
    setTouched({
      effectiveness_verified: false,
      effectiveness_criteria: false
    });
    setError('');
    setSuccess('');
    setCapaDetails(null);
    onClose();
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

  const getActionCompletionRate = () => {
    if (!capaDetails) return 0;
    
    const allActions = [
      ...(capaDetails.corrective_actions || []),
      ...(capaDetails.preventive_actions || [])
    ];
    
    if (allActions.length === 0) return 0;
    
    const completedActions = allActions.filter(a => a.status === 'Completed').length;
    return Math.round((completedActions / allActions.length) * 100);
  };

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

  const completionRate = getActionCompletionRate();

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
          overflow: 'hidden',
          maxHeight: '90vh'
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
          <VerifiedIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Effectiveness Review
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading CAPA details...
            </Typography>
          </Box>
        ) : (
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Effectiveness Review (30-90 days after implementation)
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Verify if the corrective/preventive actions actually worked. If not effective, 
                the system will flag for new CAPA creation.
              </Typography>
            </Paper>

            {/* CAPA Summary */}
            {capaDetails && (
              <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                    CAPA Summary
                  </Typography>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Problem Statement</Typography>
                    <Typography sx={{ fontSize: '0.75rem', mt: 0.3 }}>
                      {capaDetails.problem_statement || '-'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Root Cause</Typography>
                    <Typography sx={{ fontSize: '0.75rem', mt: 0.3 }}>
                      {capaDetails.root_cause || '-'}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Implementation Date</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {formatDate(capaDetails.updatedAt)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Actions Completed</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {completionRate}%
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {completionRate < 100 && (
                    <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 1.5, fontSize: '0.7rem', py: 0 }}>
                      <Typography sx={{ fontSize: '0.65rem' }}>
                        Not all actions are completed. Effectiveness review is recommended after all actions are completed.
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Effectiveness Verification */}
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
                Was the CAPA Effective? <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <RadioGroup
                value={formData.effectiveness_verified}
                onChange={(e) => handleChange('effectiveness_verified', e.target.value === 'true')}
                row
                sx={{ gap: 2 }}
              >
                <FormControlLabel 
                  value={true} 
                  control={<Radio size="small" />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: '0.9rem', color: COLORS.success }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>Yes - Effective</Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value={false} 
                  control={<Radio size="small" />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorIcon sx={{ fontSize: '0.9rem', color: COLORS.error }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>No - Not Effective</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              {touched.effectiveness_verified && formData.effectiveness_verified === null && (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 1 }}>
                  Please select an option
                </Typography>
              )}
            </Paper>

            {/* Effectiveness Criteria */}
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
                <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Effectiveness Criteria <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Typography sx={{ 
                fontSize: '0.65rem', 
                color: COLORS.text.tertiary, 
                mb: 1.5 
              }}>
                Define measurable criteria to determine effectiveness
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 1 }}>
                  Quick Templates:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {CRITERIA_EXAMPLES.map((example, idx) => (
                    <Tooltip key={idx} title={example.description} arrow>
                      <Chip
                        label={example.title}
                        size="small"
                        icon={example.icon}
                        onClick={() => handleUseExample(example)}
                        sx={{ 
                          fontSize: '0.65rem', 
                          height: 26,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: COLORS.primaryLight
                          }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formData.effectiveness_criteria}
                onChange={(e) => handleChange('effectiveness_criteria', e.target.value)}
                onBlur={() => handleBlur('effectiveness_criteria')}
                placeholder="Define specific, measurable criteria to verify effectiveness..."
                error={touched.effectiveness_criteria && !formData.effectiveness_criteria}
                helperText={touched.effectiveness_criteria && !formData.effectiveness_criteria ? 'Effectiveness criteria is required' : ''}
                sx={inputStyle}
              />
            </Paper>

            {/* Effectiveness Evidence */}
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
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Effectiveness Evidence <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Typography sx={{ 
                fontSize: '0.65rem', 
                color: COLORS.text.tertiary, 
                mb: 1.5 
              }}>
                Provide data, reports, or observations that prove effectiveness
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formData.effectiveness_evidence}
                onChange={(e) => handleChange('effectiveness_evidence', e.target.value)}
                placeholder="e.g., Production records show zero defects in last 60 units. SPC data shows process stable. Quality audit confirmed compliance..."
                sx={inputStyle}
              />
            </Paper>

            {/* Effectiveness Notes */}
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Notes (Optional)
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                value={formData.effectiveness_notes}
                onChange={(e) => handleChange('effectiveness_notes', e.target.value)}
                placeholder="Any additional observations, challenges, or recommendations..."
                sx={inputStyle}
              />
            </Paper>

            {/* Not Effective Warning */}
            {formData.effectiveness_verified === false && (
              <Alert 
                severity="warning" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                icon={<ReplayIcon sx={{ fontSize: '1rem' }} />}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mb: 0.5 }}>
                  CAPA Not Effective
                </Typography>
                <Typography sx={{ fontSize: '0.65rem' }}>
                  The system will flag this for new CAPA creation. A new CAPA will be initiated 
                  to address the root cause with revised actions.
                </Typography>
              </Alert>
            )}

            {/* Effective Success Note */}
            {formData.effectiveness_verified === true && (
              <Alert 
                severity="success" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mb: 0.5 }}>
                  CAPA Effective
                </Typography>
                <Typography sx={{ fontSize: '0.65rem' }}>
                  The CAPA will be marked as closed upon successful verification.
                </Typography>
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
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
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {success}
              </Alert>
            )}
          </Stack>
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
          disabled={loading}
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || fetching}
          startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <VerifiedIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Recording...' : 'Record Effectiveness Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewCapa;