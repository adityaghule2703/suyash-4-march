import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Stack,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Assessment as ResultsIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
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

const InspectionResultsDialog = ({ open, onClose, recordId, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkpointResults, setCheckpointResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Checkpoint Details', 'Measurements & Notes'];

  const addCheckpoint = () => {
    const newCheckpoint = {
      checkpoint_seq: checkpointResults.length + 1,
      characteristic: '',
      specification: '',
      nominal: '',
      usl: '',
      lsl: '',
      readings: ['', '', '', '', ''],
      inspector_note: ''
    };
    setCheckpointResults([...checkpointResults, newCheckpoint]);
    setActiveStep(0);
  };

  const removeCheckpoint = (index) => {
    const updated = checkpointResults.filter((_, i) => i !== index);
    updated.forEach((cp, idx) => {
      cp.checkpoint_seq = idx + 1;
    });
    setCheckpointResults(updated);
  };

  const handleCheckpointChange = (index, field, value) => {
    const updatedResults = [...checkpointResults];
    updatedResults[index][field] = value;
    setCheckpointResults(updatedResults);
  };

  const handleReadingChange = (checkpointIndex, readingIndex, value) => {
    const updatedResults = [...checkpointResults];
    updatedResults[checkpointIndex].readings[readingIndex] = value;
    setCheckpointResults(updatedResults);
  };

  const validateStep = (step, checkpointIndex) => {
    const cp = checkpointResults[checkpointIndex];
    
    if (step === 0) {
      if (!cp.characteristic || !cp.specification) {
        setError('Characteristic and Specification are required');
        return false;
      }
    }
    
    setError('');
    return true;
  };

  const handleNext = (checkpointIndex) => {
    if (validateStep(activeStep, checkpointIndex)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmitCheckpoint = async (checkpointIndex) => {
    const cp = checkpointResults[checkpointIndex];
    if (!cp.characteristic || !cp.specification) {
      setError('Characteristic and Specification are required');
      return;
    }

    if (checkpointIndex === checkpointResults.length - 1) {
      await handleSubmitAll();
    } else {
      setActiveStep(0);
      setTimeout(() => {
        const nextCheckpoint = document.getElementById(`checkpoint-${checkpointIndex + 1}`);
        if (nextCheckpoint) {
          nextCheckpoint.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSubmitAll = async () => {
    for (let i = 0; i < checkpointResults.length; i++) {
      const cp = checkpointResults[i];
      if (!cp.characteristic || !cp.specification) {
        setError(`Checkpoint ${cp.checkpoint_seq}: Characteristic and Specification are required`);
        return;
      }
    }

    if (checkpointResults.length === 0) {
      setError('Please add at least one checkpoint');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        checkpoint_results: checkpointResults.map(cp => ({
          checkpoint_seq: cp.checkpoint_seq,
          characteristic: cp.characteristic,
          specification: cp.specification,
          nominal: cp.nominal ? parseFloat(cp.nominal) : null,
          usl: cp.usl ? parseFloat(cp.usl) : null,
          lsl: cp.lsl ? parseFloat(cp.lsl) : null,
          readings: cp.readings.map(r => r === '' ? null : parseFloat(r)),
          inspector_note: cp.inspector_note || ''
        }))
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/inspection-records/${recordId}/results`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setCheckpointResults([]);
        setActiveStep(0);
        setError('');
      } else {
        setError(response.data.message || 'Failed to save results');
      }
    } catch (err) {
      console.error('Error saving results:', err);
      setError(err.response?.data?.message || 'Failed to save checkpoint results');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCheckpointResults([]);
    setActiveStep(0);
    setError('');
    onClose();
  };

  const renderCheckpointContent = (checkpoint, idx) => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Characteristic <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={checkpoint.characteristic}
                    onChange={(e) => handleCheckpointChange(idx, 'characteristic', e.target.value)}
                    placeholder="e.g., Length, Diameter, Hardness"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Specification <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={checkpoint.specification}
                    onChange={(e) => handleCheckpointChange(idx, 'specification', e.target.value)}
                    placeholder="e.g., 100mm ± 0.5mm"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Nominal Value
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={checkpoint.nominal}
                    onChange={(e) => handleCheckpointChange(idx, 'nominal', e.target.value)}
                    placeholder="Target value"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Upper Limit (USL)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={checkpoint.usl}
                    onChange={(e) => handleCheckpointChange(idx, 'usl', e.target.value)}
                    placeholder="Maximum allowed"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Lower Limit (LSL)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={checkpoint.lsl}
                    onChange={(e) => handleCheckpointChange(idx, 'lsl', e.target.value)}
                    placeholder="Minimum allowed"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                Readings (5 readings)
              </Typography>
              <Grid container spacing={1}>
                {[0, 1, 2, 3, 4].map((rIdx) => (
                  <Grid size={{ xs: 2.4 }} key={rIdx}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label={`R${rIdx + 1}`}
                      value={checkpoint.readings[rIdx] || ''}
                      onChange={(e) => handleReadingChange(idx, rIdx, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.7rem'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                Inspector Note
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                value={checkpoint.inspector_note || ''}
                onChange={(e) => handleCheckpointChange(idx, 'inspector_note', e.target.value)}
                placeholder="Add any observations or notes about this checkpoint..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '&:hover fieldset': { borderColor: COLORS.primary },
                    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                  },
                  '& .MuiInputBase-input': {
                    py: 1,
                    px: 1.5,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Box>
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
          borderRadius: 5,
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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ResultsIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Inspection Results
          </Typography>
        </Stack>
        <IconButton size="small" onClick={handleClose} sx={{ color: COLORS.text.secondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {checkpointResults.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <ResultsIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
            <Typography sx={{ color: COLORS.text.secondary, fontSize: '0.875rem' }}>
              No checkpoints added. Click "Add Checkpoint" to start entering inspection results.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {checkpointResults.map((checkpoint, idx) => (
              <Paper 
                key={idx} 
                id={`checkpoint-${idx}`}
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`,
                  position: 'relative'
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  left: 16, 
                  bgcolor: COLORS.background.white,
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: COLORS.primary
                  }}>
                    Checkpoint {checkpoint.checkpoint_seq}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeCheckpoint(idx)}
                    sx={{ color: '#EF4444', p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                  </IconButton>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ px: 2, pt: 1, pb: 0 }}>
                    <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.secondary }}>
                              {label}
                            </Typography>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    {renderCheckpointContent(checkpoint, idx)}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0}
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
                    
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => handleSubmitCheckpoint(idx)}
                        disabled={loading}
                        sx={{
                          height: 32,
                          px: 3,
                          borderRadius: 1.5,
                          bgcolor: COLORS.primary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': { bgcolor: COLORS.primaryDark }
                        }}
                      >
                        {idx === checkpointResults.length - 1 ? 'Save All Results' : 'Next Checkpoint'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleNext(idx)}
                        sx={{
                          height: 32,
                          px: 3,
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
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
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
          size="small"
          variant="outlined"
          onClick={addCheckpoint}
          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            borderColor: COLORS.primary,
            color: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primaryDark,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Add Checkpoint
        </Button>
        
        <Button
          onClick={handleClose}
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
      </DialogActions>
    </Dialog>
  );
};

export default InspectionResultsDialog;