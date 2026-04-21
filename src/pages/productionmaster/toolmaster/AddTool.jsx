import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    light: '#F8FFFC'
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

// Enums from API
const TOOL_TYPE_OPTIONS = [
  'Progressive Die', 'Blanking Die', 'Forming Die',
  'Piercing Punch', 'Bending Tool', 'Drawing Die',
  'Trimming Die', 'Compound Die', 'Fixture',
  'Jig', 'Gauge', 'Other'
];

const MANUFACTURED_BY_OPTIONS = ['In-House', 'External Vendor'];

const steps = ['Basic Information', 'Technical Details', 'Cost & Location'];

const AddTool = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Form data - only fields from API body
  const [formData, setFormData] = useState({
    tool_name: '',
    tool_type: '',
    max_shots: '',
    maintenance_interval_shots: '',
    alert_threshold_percent: 90,
    tool_material: '',
    tool_size: '',
    tool_cost: '',
    refurbishment_cost: '',
    manufactured_by: 'In-House',
    bin_location: '',
    produces_part_no: ''
  });

  // Handle edit mode - populate form with initial data
  useEffect(() => {
    if (isEditMode && initialData && open) {
      setFormData({
        tool_name: initialData.tool_name || '',
        tool_type: initialData.tool_type || '',
        max_shots: initialData.max_shots || '',
        maintenance_interval_shots: initialData.maintenance_interval_shots || '',
        alert_threshold_percent: initialData.alert_threshold_percent || 90,
        tool_material: initialData.tool_material || '',
        tool_size: initialData.tool_size || '',
        tool_cost: initialData.tool_cost || '',
        refurbishment_cost: initialData.refurbishment_cost || '',
        manufactured_by: initialData.manufactured_by || 'In-House',
        bin_location: initialData.bin_location || '',
        produces_part_no: initialData.produces_part_no || ''
      });
    }
  }, [isEditMode, initialData, open]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.tool_name.trim()) {
          errors.tool_name = 'Tool name is required';
          isValid = false;
        }
        if (!formData.tool_type) {
          errors.tool_type = 'Tool type is required';
          isValid = false;
        }
        if (!formData.produces_part_no) {
          errors.produces_part_no = 'Produces part number is required';
          isValid = false;
        }
        break;
      
      case 1: // Technical Details
        if (!formData.max_shots) {
          errors.max_shots = 'Max shots is required';
          isValid = false;
        }
        if (formData.max_shots && parseFloat(formData.max_shots) <= 0) {
          errors.max_shots = 'Max shots must be greater than 0';
          isValid = false;
        }
        if (!formData.maintenance_interval_shots) {
          errors.maintenance_interval_shots = 'Maintenance interval is required';
          isValid = false;
        }
        if (formData.maintenance_interval_shots && parseFloat(formData.maintenance_interval_shots) <= 0) {
          errors.maintenance_interval_shots = 'Maintenance interval must be greater than 0';
          isValid = false;
        }
        if (!formData.tool_material) {
          errors.tool_material = 'Tool material is required';
          isValid = false;
        }
        break;
      
      case 2: // Cost & Location
        if (!formData.tool_cost) {
          errors.tool_cost = 'Tool cost is required';
          isValid = false;
        }
        if (formData.tool_cost && parseFloat(formData.tool_cost) <= 0) {
          errors.tool_cost = 'Tool cost must be greater than 0';
          isValid = false;
        }
        if (!formData.bin_location) {
          errors.bin_location = 'Bin location is required';
          isValid = false;
        }
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.tool_name.trim()) {
      errors.tool_name = 'Tool name is required';
      isValid = false;
    }
    if (!formData.tool_type) {
      errors.tool_type = 'Tool type is required';
      isValid = false;
    }
    if (!formData.produces_part_no) {
      errors.produces_part_no = 'Produces part number is required';
      isValid = false;
    }
    if (!formData.max_shots) {
      errors.max_shots = 'Max shots is required';
      isValid = false;
    }
    if (formData.max_shots && parseFloat(formData.max_shots) <= 0) {
      errors.max_shots = 'Max shots must be greater than 0';
      isValid = false;
    }
    if (!formData.maintenance_interval_shots) {
      errors.maintenance_interval_shots = 'Maintenance interval is required';
      isValid = false;
    }
    if (formData.maintenance_interval_shots && parseFloat(formData.maintenance_interval_shots) <= 0) {
      errors.maintenance_interval_shots = 'Maintenance interval must be greater than 0';
      isValid = false;
    }
    if (!formData.tool_material) {
      errors.tool_material = 'Tool material is required';
      isValid = false;
    }
    if (!formData.tool_cost) {
      errors.tool_cost = 'Tool cost is required';
      isValid = false;
    }
    if (formData.tool_cost && parseFloat(formData.tool_cost) <= 0) {
      errors.tool_cost = 'Tool cost must be greater than 0';
      isValid = false;
    }
    if (!formData.bin_location) {
      errors.bin_location = 'Bin location is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        tool_name: formData.tool_name,
        tool_type: formData.tool_type,
        max_shots: Number(formData.max_shots),
        maintenance_interval_shots: Number(formData.maintenance_interval_shots),
        alert_threshold_percent: Number(formData.alert_threshold_percent),
        tool_material: formData.tool_material,
        tool_size: formData.tool_size || '',
        tool_cost: Number(formData.tool_cost),
        refurbishment_cost: formData.refurbishment_cost ? Number(formData.refurbishment_cost) : 0,
        manufactured_by: formData.manufactured_by,
        bin_location: formData.bin_location,
        produces_part_no: formData.produces_part_no
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/api/tool-master/${initialData._id}`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/tool-master`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data.success) {
        onSuccess();
        resetForm();
        onClose();
      } else {
        setError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} tool`);
      }
    } catch (err) {
      console.error('Error saving tool:', err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} tool. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      tool_name: '',
      tool_type: '',
      max_shots: '',
      maintenance_interval_shots: '',
      alert_threshold_percent: 90,
      tool_material: '',
      tool_size: '',
      tool_cost: '',
      refurbishment_cost: '',
      manufactured_by: 'In-House',
      bin_location: '',
      produces_part_no: ''
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Tool Name <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="tool_name"
                      value={formData.tool_name}
                      onChange={handleChange}
                      placeholder="e.g., Progressive Die 40x5"
                      error={!!fieldErrors.tool_name}
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
                    {fieldErrors.tool_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.tool_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Tool Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.tool_type}>
                      <Select
                        name="tool_type"
                        value={formData.tool_type}
                        onChange={handleChange}
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        <MenuItem value="" disabled>Select tool type</MenuItem>
                        {TOOL_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.tool_type && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.tool_type}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Produces Part No <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="produces_part_no"
                      value={formData.produces_part_no}
                      onChange={handleChange}
                      placeholder="e.g., BUSBAR-CU-40X5"
                      error={!!fieldErrors.produces_part_no}
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
                    {fieldErrors.produces_part_no && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.produces_part_no}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <SettingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Technical Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Max Shots <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="max_shots"
                      value={formData.max_shots}
                      onChange={handleChange}
                      placeholder="e.g., 500000"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">shots</InputAdornment>,
                      }}
                      error={!!fieldErrors.max_shots}
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
                    {fieldErrors.max_shots && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.max_shots}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Maintenance Interval <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="maintenance_interval_shots"
                      value={formData.maintenance_interval_shots}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">shots</InputAdornment>,
                      }}
                      error={!!fieldErrors.maintenance_interval_shots}
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
                    {fieldErrors.maintenance_interval_shots && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.maintenance_interval_shots}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Alert Threshold (%)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="alert_threshold_percent"
                      value={formData.alert_threshold_percent}
                      onChange={handleChange}
                      placeholder="90"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
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
                      Tool Material <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="tool_material"
                      value={formData.tool_material}
                      onChange={handleChange}
                      placeholder="e.g., D2, H13, M2"
                      error={!!fieldErrors.tool_material}
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
                    {fieldErrors.tool_material && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.tool_material}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Tool Size
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="tool_size"
                      value={formData.tool_size}
                      onChange={handleChange}
                      placeholder="e.g., 300x200mm"
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
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <AttachMoneyIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Cost & Location
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Tool Cost (₹) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="tool_cost"
                      value={formData.tool_cost}
                      onChange={handleChange}
                      placeholder="e.g., 85000"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!fieldErrors.tool_cost}
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
                    {fieldErrors.tool_cost && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.tool_cost}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Refurbishment Cost (₹)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="refurbishment_cost"
                      value={formData.refurbishment_cost}
                      onChange={handleChange}
                      placeholder="e.g., 2500"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
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
                      Manufactured By
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="manufactured_by"
                        value={formData.manufactured_by}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {MANUFACTURED_BY_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Bin Location <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bin_location"
                      value={formData.bin_location}
                      onChange={handleChange}
                      placeholder="e.g., RACK-A-03"
                      error={!!fieldErrors.bin_location}
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
                    {fieldErrors.bin_location && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.bin_location}
                      </Typography>
                    )}
                  </Box>
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          {isEditMode ? 'Edit Tool' : 'Add New Tool'}
        </Typography>
      </DialogTitle>

      {/* Stepper */}
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
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
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
            onClick={handleClose}
            disabled={loading}
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
              disabled={loading}
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Tool' : 'Create Tool')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
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

export default AddTool;