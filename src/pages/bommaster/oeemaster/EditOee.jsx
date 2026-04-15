// EditOee.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const steps = ['Edit Production Data', 'Updated OEE Calculation', 'Review & Submit'];

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976D2',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976D2',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  }
};

const EditOee = ({ open, onClose, onUpdate, recordData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [calculatedOEE, setCalculatedOEE] = useState(null);
  const [machineDetails, setMachineDetails] = useState(null);

  const [formData, setFormData] = useState({
    planned_production_time: 0,
    actual_run_time: 0,
    theoretical_capacity: 0,
    total_qty: 0,
    good_qty: 0,
    notes: ''
  });

  // Initialize form with record data when dialog opens
  useEffect(() => {
    if (open && recordData) {
      initializeFormData(recordData);
    }
  }, [open, recordData]);

  const initializeFormData = (record) => {
    setOriginalData(record);
    
    setFormData({
      planned_production_time: record.planned_production_time || 0,
      actual_run_time: record.actual_run_time || 0,
      theoretical_capacity: record.theoretical_capacity || 0,
      total_qty: record.total_qty || 0,
      good_qty: record.good_qty || 0,
      notes: record.notes || ''
    });
    
    setCalculatedOEE({
      availability: record.availability || 0,
      performance: record.performance || 0,
      quality: record.quality || 0,
      oee: record.oee || 0,
      total_downtime_min: record.total_downtime_min || (record.planned_production_time - record.actual_run_time)
    });
    
    if (record.machine_id) {
      fetchMachineDetails(record.machine_id);
    }
  };

  const fetchMachineDetails = async (machineId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`${BASE_URL}/api/machines/${machineId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMachineDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching machine details:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    if (calculatedOEE) {
      setCalculatedOEE(null);
    }
  };

  const calculateOEEValues = () => {
    const { planned_production_time, actual_run_time, theoretical_capacity, good_qty, total_qty } = formData;
    
    const availability = (actual_run_time / planned_production_time) * 100;
    const ideal_run_rate = theoretical_capacity / planned_production_time;
    const actual_output_rate = total_qty / actual_run_time;
    const performance = (actual_output_rate / ideal_run_rate) * 100;
    const quality = (good_qty / total_qty) * 100;
    const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;
    const total_downtime_min = planned_production_time - actual_run_time;
    
    return {
      availability: Math.round(availability * 10) / 10,
      performance: Math.round(performance * 10) / 10,
      quality: Math.round(quality * 10) / 10,
      oee: Math.round(oee * 10) / 10,
      total_downtime_min
    };
  };

  const getOEEStatus = (oee) => {
    if (oee >= 85) return { label: 'Excellent', color: COLORS.success, icon: CheckCircleIcon };
    if (oee >= 60) return { label: 'Good', color: COLORS.primary, icon: SpeedIcon };
    if (oee >= 40) return { label: 'Fair', color: COLORS.warning, icon: WarningIcon };
    return { label: 'Poor', color: COLORS.error, icon: WarningIcon };
  };

  const getComparisonStatus = (original, current, isPercentage = true) => {
    if (original === current) return { icon: null, color: COLORS.text.secondary, text: 'No change' };
    const diff = current - original;
    const isImprovement = diff > 0;
    
    if (isPercentage) {
      return {
        icon: isImprovement ? '↑' : '↓',
        color: isImprovement ? COLORS.success : COLORS.error,
        text: `${isImprovement ? '+' : ''}${diff.toFixed(1)}%`
      };
    } else {
      return {
        icon: isImprovement ? '↑' : '↓',
        color: isImprovement ? COLORS.success : COLORS.error,
        text: `${isImprovement ? '+' : ''}${diff}`
      };
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.planned_production_time || formData.planned_production_time <= 0) {
          errors.planned_production_time = 'Valid planned production time is required';
          isValid = false;
        }
        if (!formData.actual_run_time || formData.actual_run_time <= 0) {
          errors.actual_run_time = 'Valid actual run time is required';
          isValid = false;
        }
        if (formData.actual_run_time > formData.planned_production_time) {
          errors.actual_run_time = 'Actual run time cannot exceed planned production time';
          isValid = false;
        }
        if (!formData.theoretical_capacity || formData.theoretical_capacity <= 0) {
          errors.theoretical_capacity = 'Valid theoretical capacity is required';
          isValid = false;
        }
        if (!formData.total_qty || formData.total_qty <= 0) {
          errors.total_qty = 'Valid total quantity is required';
          isValid = false;
        }
        if (!formData.good_qty || formData.good_qty <= 0) {
          errors.good_qty = 'Valid good quantity is required';
          isValid = false;
        }
        if (formData.good_qty > formData.total_qty) {
          errors.good_qty = 'Good quantity cannot exceed total quantity';
          isValid = false;
        }
        break;
      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 1 && !calculatedOEE) {
        const oeeValues = calculateOEEValues();
        setCalculatedOEE(oeeValues);
      }
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const submitData = {
        planned_production_time: Number(formData.planned_production_time),
        actual_run_time: Number(formData.actual_run_time),
        theoretical_capacity: Number(formData.theoretical_capacity),
        total_qty: Number(formData.total_qty),
        good_qty: Number(formData.good_qty),
        notes: formData.notes || ''
      };

      const response = await axios.put(`${BASE_URL}/api/oee-records/${originalData._id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update OEE record');
      }
    } catch (err) {
      console.error('Error updating OEE record:', err);
      setError(err.response?.data?.message || 'Failed to update OEE record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      planned_production_time: 0,
      actual_run_time: 0,
      theoretical_capacity: 0,
      total_qty: 0,
      good_qty: 0,
      notes: ''
    });
    setCalculatedOEE(null);
    setOriginalData(null);
    setMachineDetails(null);
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRecalculate = () => {
    const oeeValues = calculateOEEValues();
    setCalculatedOEE(oeeValues);
    setError('');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <EditIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Edit Production Data
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PLANNED PRODUCTION TIME (minutes) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="planned_production_time"
                      value={formData.planned_production_time}
                      onChange={handleChange}
                      placeholder="e.g., 480"
                      error={!!fieldErrors.planned_production_time}
                      helperText={fieldErrors.planned_production_time}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                    {originalData && originalData.planned_production_time !== formData.planned_production_time && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Original: {originalData.planned_production_time} min
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      ACTUAL RUN TIME (minutes) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="actual_run_time"
                      value={formData.actual_run_time}
                      onChange={handleChange}
                      placeholder="e.g., 440"
                      error={!!fieldErrors.actual_run_time}
                      helperText={fieldErrors.actual_run_time}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                    {originalData && originalData.actual_run_time !== formData.actual_run_time && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Original: {originalData.actual_run_time} min
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      THEORETICAL CAPACITY (units) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="theoretical_capacity"
                      value={formData.theoretical_capacity}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      error={!!fieldErrors.theoretical_capacity}
                      helperText={fieldErrors.theoretical_capacity}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                    {originalData && originalData.theoretical_capacity !== formData.theoretical_capacity && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Original: {originalData.theoretical_capacity} units
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL QUANTITY PRODUCED <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="total_qty"
                      value={formData.total_qty}
                      onChange={handleChange}
                      placeholder="e.g., 480"
                      error={!!fieldErrors.total_qty}
                      helperText={fieldErrors.total_qty}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                    {originalData && originalData.total_qty !== formData.total_qty && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Original: {originalData.total_qty} units
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      GOOD QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="good_qty"
                      value={formData.good_qty}
                      onChange={handleChange}
                      placeholder="e.g., 460"
                      error={!!fieldErrors.good_qty}
                      helperText={fieldErrors.good_qty}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                    {originalData && originalData.good_qty !== formData.good_qty && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Original: {originalData.good_qty} units
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      NOTES
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional notes about this OEE record..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRecalculate}
                  startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
                  sx={{
                    height: 32,
                    borderRadius: 1.5,
                    fontSize: '0.7rem',
                    textTransform: 'none'
                  }}
                >
                  Recalculate OEE
                </Button>
              </Box>
            </Paper>
          </Stack>
        );

     case 1: // Updated OEE Calculation (formerly step 2)
  if (!calculatedOEE) {
    const oeeValues = calculateOEEValues();
    if (oeeValues !== calculatedOEE) {
      setCalculatedOEE(oeeValues);
    }
  }

  const newStatus = calculatedOEE ? getOEEStatus(calculatedOEE.oee) : null;
  const NewStatusIcon = newStatus?.icon;
  const originalStatusForStep = originalData ? getOEEStatus(originalData.oee) : null;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
          <SpeedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
          Updated OEE Calculation Results
        </Typography>

        {calculatedOEE && originalData && (
          <>
            {/* Changed to single row with 4 cards using flexbox */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 2,
              flexWrap: 'wrap', // Allows wrapping on smaller screens
              '& > *': { 
                flex: 1, // Each card takes equal space
                minWidth: '150px' // Minimum width before wrapping
              } 
            }}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Availability
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                  {calculatedOEE.availability}%
                </Typography>
                {(() => {
                  const comparison = getComparisonStatus(originalData.availability, calculatedOEE.availability);
                  return comparison.text !== 'No change' && (
                    <Typography sx={{ fontSize: '0.65rem', color: comparison.color }}>
                      {comparison.icon} {comparison.text}
                    </Typography>
                  );
                })()}
              </Paper>

              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Performance
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                  {calculatedOEE.performance}%
                </Typography>
                {(() => {
                  const comparison = getComparisonStatus(originalData.performance, calculatedOEE.performance);
                  return comparison.text !== 'No change' && (
                    <Typography sx={{ fontSize: '0.65rem', color: comparison.color }}>
                      {comparison.icon} {comparison.text}
                    </Typography>
                  );
                })()}
              </Paper>

              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Quality
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                  {calculatedOEE.quality}%
                </Typography>
                {(() => {
                  const comparison = getComparisonStatus(originalData.quality, calculatedOEE.quality);
                  return comparison.text !== 'No change' && (
                    <Typography sx={{ fontSize: '0.65rem', color: comparison.color }}>
                      {comparison.icon} {comparison.text}
                    </Typography>
                  );
                })()}
              </Paper>

              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Total Downtime
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.warning }}>
                  {calculatedOEE.total_downtime_min} min
                </Typography>
                {(() => {
                  const originalDowntime = originalData.total_downtime_min || (originalData.planned_production_time - originalData.actual_run_time);
                  const comparison = getComparisonStatus(originalDowntime, calculatedOEE.total_downtime_min, false);
                  return comparison.text !== 'No change' && (
                    <Typography sx={{ fontSize: '0.65rem', color: comparison.color }}>
                      {comparison.icon} {comparison.text} min
                    </Typography>
                  );
                })()}
              </Paper>
            </Box>

            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: newStatus.color + '10', borderRadius: 1.5, border: `1px solid ${newStatus.color}30` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                {NewStatusIcon && <NewStatusIcon sx={{ color: newStatus.color, fontSize: '1.5rem' }} />}
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: newStatus.color }}>
                  Updated OEE: {calculatedOEE.oee}%
                </Typography>
              </Box>
              <Chip 
                label={newStatus.label} 
                size="small"
                sx={{ 
                  bgcolor: newStatus.color,
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 500
                }}
              />
              {originalData.oee !== calculatedOEE.oee && (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1 }}>
                  Previous OEE: {originalData.oee}% ({originalStatusForStep?.label})
                </Typography>
              )}
            </Paper>
          </>
        )}
      </Paper>
    </Stack>
  );

      case 2:
        const finalStatus = calculatedOEE ? getOEEStatus(calculatedOEE.oee) : null;
        const FinalStatusIcon = finalStatus?.icon;
        const originalStatusForReview = originalData ? getOEEStatus(originalData.oee) : null;

        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review Changes & Submit
              </Typography>

              <Stack spacing={2}>
                {machineDetails && (
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                      Machine Information
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine:</Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {machineDetails.machine_name} ({machineDetails.machine_code})
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Date:</Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {originalData && new Date(originalData.date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift:</Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {originalData?.shift}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Changes Summary
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Time:</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {formData.planned_production_time} min
                        {originalData && originalData.planned_production_time !== formData.planned_production_time && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, ml: 1 }}>
                            (was: {originalData.planned_production_time} min)
                          </Typography>
                        )}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Run Time:</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {formData.actual_run_time} min
                        {originalData && originalData.actual_run_time !== formData.actual_run_time && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, ml: 1 }}>
                            (was: {originalData.actual_run_time} min)
                          </Typography>
                        )}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Theoretical Capacity:</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {formData.theoretical_capacity} units
                        {originalData && originalData.theoretical_capacity !== formData.theoretical_capacity && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, ml: 1 }}>
                            (was: {originalData.theoretical_capacity} units)
                          </Typography>
                        )}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Quantity:</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {formData.total_qty} units
                        {originalData && originalData.total_qty !== formData.total_qty && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, ml: 1 }}>
                            (was: {originalData.total_qty} units)
                          </Typography>
                        )}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Good Quantity:</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {formData.good_qty} units
                        {originalData && originalData.good_qty !== formData.good_qty && (
                          <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, ml: 1 }}>
                            (was: {originalData.good_qty} units)
                          </Typography>
                        )}
                      </Typography>
                    </Grid>

                    {formData.notes !== originalData?.notes && (
                      <>
                        <Grid size={{ xs: 12 }}>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Notes:</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            {formData.notes || '-'}
                            {originalData?.notes && (
                              <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block', mt: 0.5 }}>
                                Previous: {originalData.notes}
                              </Typography>
                            )}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>

                {calculatedOEE && (
                  <Paper sx={{ p: 2, bgcolor: finalStatus?.color + '10', borderRadius: 1.5, border: `1px solid ${finalStatus?.color}30` }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                      OEE Impact
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Previous OEE:</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: originalStatusForReview?.color }}>
                          {originalData?.oee}% ({originalStatusForReview?.label})
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Updated OEE:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: finalStatus?.color }}>
                            {calculatedOEE.oee}%
                          </Typography>
                          {FinalStatusIcon && <FinalStatusIcon sx={{ color: finalStatus?.color, fontSize: '1rem' }} />}
                        </Box>
                      </Box>
                      <Chip 
                        label={finalStatus?.label}
                        size="small"
                        sx={{ 
                          bgcolor: finalStatus?.color,
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    {originalData && originalData.oee !== calculatedOEE.oee && (
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1, textAlign: 'center' }}>
                        OEE will change by {(calculatedOEE.oee - originalData.oee).toFixed(1)}%
                      </Typography>
                    )}
                  </Paper>
                )}
              </Stack>
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
          Edit OEE Record
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
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
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
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
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
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
            textTransform: 'none'
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
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="small"
              startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Updating...' : 'Update Record'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
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

export default EditOee;