import React, { useState, useEffect, useCallback } from 'react';
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
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Straighten as GaugeIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  People as PeopleIcon
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
const GAUGE_TYPE_OPTIONS = [
  'Vernier Caliper', 'Outside Micrometer', 'Inside Micrometer',
  'Depth Gauge', 'Dial Gauge', 'CMM', 'Go-NoGo Gauge', 'Thread Gauge',
  'Pressure Gauge', 'Torque Wrench', 'Shore Durometer',
  'Rockwell Hardness Tester', 'XRF Gauge', 'Megger',
  'Micro-Ohmmeter', 'HiPot Tester', 'Surface Roughness Tester',
  'Optical Comparator', 'Other'
];

const steps = ['Basic Information', 'Technical Details', 'Calibration & MSA'];

const AddGauge = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Data fetching states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    gauge_name: '',
    gauge_type: '',
    gauge_code: '',
    make: '',
    model: '',
    serial_no: '',
    range: '',
    least_count: '',
    accuracy: '',
    department: '',
    location: '',
    custodian_id: '',
    calibration_frequency_days: 90,
    last_calibration_date: '',
    calibration_agency: '',
    nabl_accredited: false,
    msa_required: false,
    gage_r_and_r_percent: '',
    bias: '',
    linearity: ''
  });

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  // Fetch Departments
  const fetchDepartments = useCallback(async () => {
    try {
      setLoadingDepartments(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [open, fetchEmployees, fetchDepartments]);

  // Handle edit mode - populate form with initial data
  useEffect(() => {
    if (isEditMode && initialData && open) {
      setFormData({
        gauge_name: initialData.gauge_name || '',
        gauge_type: initialData.gauge_type || '',
        gauge_code: initialData.gauge_code || '',
        make: initialData.make || '',
        model: initialData.model || '',
        serial_no: initialData.serial_no || '',
        range: initialData.range || '',
        least_count: initialData.least_count || '',
        accuracy: initialData.accuracy || '',
        department: initialData.department || '',
        location: initialData.location || '',
        custodian_id: initialData.custodian_id || '',
        calibration_frequency_days: initialData.calibration_frequency_days || 90,
        last_calibration_date: initialData.last_calibration_date ? initialData.last_calibration_date.split('T')[0] : '',
        calibration_agency: initialData.calibration_agency || '',
        nabl_accredited: initialData.nabl_accredited || false,
        msa_required: initialData.msa_required || false,
        gage_r_and_r_percent: initialData.gage_r_and_r_percent || '',
        bias: initialData.bias || '',
        linearity: initialData.linearity || ''
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.gauge_name.trim()) {
          errors.gauge_name = 'Gauge name is required';
          isValid = false;
        }
        if (!formData.gauge_type) {
          errors.gauge_type = 'Gauge type is required';
          isValid = false;
        }
        if (!formData.gauge_code.trim()) {
          errors.gauge_code = 'Gauge code is required';
          isValid = false;
        }
        if (!formData.make) {
          errors.make = 'Make is required';
          isValid = false;
        }
        if (!formData.model) {
          errors.model = 'Model is required';
          isValid = false;
        }
        break;

      case 1: // Technical Details
        if (!formData.serial_no) {
          errors.serial_no = 'Serial number is required';
          isValid = false;
        }
        if (!formData.range) {
          errors.range = 'Range is required';
          isValid = false;
        }
        if (!formData.least_count) {
          errors.least_count = 'Least count is required';
          isValid = false;
        }
        if (!formData.accuracy) {
          errors.accuracy = 'Accuracy is required';
          isValid = false;
        }
        if (!formData.department) {
          errors.department = 'Department is required';
          isValid = false;
        }
        if (!formData.location) {
          errors.location = 'Location is required';
          isValid = false;
        }
        break;

      case 2: // Calibration & MSA
        if (!formData.calibration_frequency_days) {
          errors.calibration_frequency_days = 'Calibration frequency is required';
          isValid = false;
        }
        if (!formData.last_calibration_date) {
          errors.last_calibration_date = 'Last calibration date is required';
          isValid = false;
        }
        if (!formData.calibration_agency) {
          errors.calibration_agency = 'Calibration agency is required';
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

    if (!formData.gauge_name.trim()) {
      errors.gauge_name = 'Gauge name is required';
      isValid = false;
    }
    if (!formData.gauge_type) {
      errors.gauge_type = 'Gauge type is required';
      isValid = false;
    }
    if (!formData.gauge_code.trim()) {
      errors.gauge_code = 'Gauge code is required';
      isValid = false;
    }
    if (!formData.make) {
      errors.make = 'Make is required';
      isValid = false;
    }
    if (!formData.model) {
      errors.model = 'Model is required';
      isValid = false;
    }
    if (!formData.serial_no) {
      errors.serial_no = 'Serial number is required';
      isValid = false;
    }
    if (!formData.range) {
      errors.range = 'Range is required';
      isValid = false;
    }
    if (!formData.least_count) {
      errors.least_count = 'Least count is required';
      isValid = false;
    }
    if (!formData.accuracy) {
      errors.accuracy = 'Accuracy is required';
      isValid = false;
    }
    if (!formData.department) {
      errors.department = 'Department is required';
      isValid = false;
    }
    if (!formData.location) {
      errors.location = 'Location is required';
      isValid = false;
    }
    if (!formData.calibration_frequency_days) {
      errors.calibration_frequency_days = 'Calibration frequency is required';
      isValid = false;
    }
    if (!formData.last_calibration_date) {
      errors.last_calibration_date = 'Last calibration date is required';
      isValid = false;
    }
    if (!formData.calibration_agency) {
      errors.calibration_agency = 'Calibration agency is required';
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
        gauge_name: formData.gauge_name,
        gauge_type: formData.gauge_type,
        gauge_code: formData.gauge_code,
        make: formData.make,
        model: formData.model,
        serial_no: formData.serial_no,
        range: formData.range,
        least_count: formData.least_count,
        accuracy: formData.accuracy,
        department: formData.department,
        location: formData.location,
        custodian_id: formData.custodian_id || null,
        calibration_frequency_days: Number(formData.calibration_frequency_days),
        last_calibration_date: formData.last_calibration_date,
        calibration_agency: formData.calibration_agency,
        nabl_accredited: formData.nabl_accredited,
        msa_required: formData.msa_required,
        gage_r_and_r_percent: formData.gage_r_and_r_percent ? Number(formData.gage_r_and_r_percent) : undefined,
        bias: formData.bias ? Number(formData.bias) : undefined,
        linearity: formData.linearity ? Number(formData.linearity) : undefined
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/api/gauges/${initialData._id}`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/gauges`, requestData, {
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
        setError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} gauge`);
      }
    } catch (err) {
      console.error('Error saving gauge:', err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} gauge. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      gauge_name: '',
      gauge_type: '',
      gauge_code: '',
      make: '',
      model: '',
      serial_no: '',
      range: '',
      least_count: '',
      accuracy: '',
      department: '',
      location: '',
      custodian_id: '',
      calibration_frequency_days: 90,
      last_calibration_date: '',
      calibration_agency: '',
      nabl_accredited: false,
      msa_required: false,
      gage_r_and_r_percent: '',
      bias: '',
      linearity: ''
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
                <GaugeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Gauge Name <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="gauge_name"
                      value={formData.gauge_name}
                      onChange={handleChange}
                      placeholder="e.g., Digital Vernier Caliper"
                      error={!!fieldErrors.gauge_name}
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
                    {fieldErrors.gauge_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.gauge_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Gauge Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.gauge_type}>
                      <Select
                        name="gauge_type"
                        value={formData.gauge_type}
                        onChange={handleChange}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 45 * 5, // 5 items visible
                              overflowY: 'auto',
                              '&::-webkit-scrollbar': {
                                display: 'none' // hide scrollbar (Chrome)
                              },
                              scrollbarWidth: 'none', // hide scrollbar (Firefox)
                            }
                          }
                        }}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        <MenuItem value="" disabled>Select gauge type</MenuItem>
                        {GAUGE_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.gauge_type && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.gauge_type}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Gauge Code <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="gauge_code"
                      value={formData.gauge_code}
                      onChange={handleChange}
                      placeholder="e.g., G-001-2026"
                      error={!!fieldErrors.gauge_code}
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
                    {fieldErrors.gauge_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.gauge_code}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Make <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      placeholder="e.g., Mitutoyo"
                      error={!!fieldErrors.make}
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
                    {fieldErrors.make && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.make}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Model <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., 500-196-30"
                      error={!!fieldErrors.model}
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
                    {fieldErrors.model && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.model}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Serial No <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="serial_no"
                      value={formData.serial_no}
                      onChange={handleChange}
                      placeholder="e.g., M789456123"
                      error={!!fieldErrors.serial_no}
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
                    {fieldErrors.serial_no && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.serial_no}
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
                      Range <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="range"
                      value={formData.range}
                      onChange={handleChange}
                      placeholder="e.g., 0-150mm"
                      error={!!fieldErrors.range}
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
                    {fieldErrors.range && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.range}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Least Count <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="least_count"
                      value={formData.least_count}
                      onChange={handleChange}
                      placeholder="e.g., 0.01mm"
                      error={!!fieldErrors.least_count}
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
                    {fieldErrors.least_count && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.least_count}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Accuracy <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="accuracy"
                      value={formData.accuracy}
                      onChange={handleChange}
                      placeholder="e.g., ±0.02mm"
                      error={!!fieldErrors.accuracy}
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
                    {fieldErrors.accuracy && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.accuracy}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Department <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.department}>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        displayEmpty
                        disabled={loadingDepartments}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        <MenuItem value="" disabled>Select department</MenuItem>
                        {departments.map(dept => (
                          <MenuItem key={dept._id} value={dept.DepartmentName} sx={{ fontSize: '0.75rem' }}>
                            {dept.DepartmentName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.department && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.department}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Location <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Bay 3, Shelf A"
                      error={!!fieldErrors.location}
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
                    {fieldErrors.location && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.location}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Custodian (Employee)
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="custodian_id"
                        value={formData.custodian_id}
                        onChange={handleChange}
                        displayEmpty
                        disabled={loadingEmployees}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        <MenuItem value="" disabled>Select custodian</MenuItem>
                        {employees.map(emp => (
                          <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
                            {emp.FirstName} {emp.LastName} ({emp.EmployeeID})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                <PeopleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Calibration & MSA
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Calibration Frequency (days) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="calibration_frequency_days"
                      value={formData.calibration_frequency_days}
                      onChange={handleChange}
                      placeholder="90"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">days</InputAdornment>,
                      }}
                      error={!!fieldErrors.calibration_frequency_days}
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
                    {fieldErrors.calibration_frequency_days && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.calibration_frequency_days}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Last Calibration Date <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="last_calibration_date"
                      value={formData.last_calibration_date}
                      onChange={handleChange}
                      error={!!fieldErrors.last_calibration_date}
                      InputLabelProps={{ shrink: true }}
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
                    {fieldErrors.last_calibration_date && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.last_calibration_date}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Calibration Agency <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="calibration_agency"
                      value={formData.calibration_agency}
                      onChange={handleChange}
                      placeholder="e.g., ABC Calibration Lab"
                      error={!!fieldErrors.calibration_agency}
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
                    {fieldErrors.calibration_agency && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.calibration_agency}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="nabl_accredited"
                          checked={formData.nabl_accredited}
                          onChange={handleChange}
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': { color: COLORS.primary }
                          }}
                        />
                      }
                      label="NABL Accredited"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                    MSA (Measurement System Analysis)
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="msa_required"
                        checked={formData.msa_required}
                        onChange={handleChange}
                        sx={{
                          color: COLORS.primary,
                          '&.Mui-checked': { color: COLORS.primary }
                        }}
                      />
                    }
                    label="MSA Required"
                  />
                </Grid>

                {formData.msa_required && (
                  <>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Gage R&R (%)
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          name="gage_r_and_r_percent"
                          value={formData.gage_r_and_r_percent}
                          onChange={handleChange}
                          placeholder="7.2"
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

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Bias
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          name="bias"
                          value={formData.bias}
                          onChange={handleChange}
                          placeholder="0.005"
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
                          Linearity
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          name="linearity"
                          value={formData.linearity}
                          onChange={handleChange}
                          placeholder="0.012"
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
                  </>
                )}
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
          {isEditMode ? 'Edit Gauge' : 'Add New Gauge'}
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
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Gauge' : 'Create Gauge')}
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

export default AddGauge;