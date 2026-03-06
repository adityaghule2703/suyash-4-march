import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControlLabel,
  Switch,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  styled
} from '@mui/material';
import { 
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// 🔥 Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Basic Information', 'Rate & Cost Details'];

// Validation helper functions
const validateMaterialName = (value) => {
  if (!value?.trim()) {
    return 'Material name is required';
  }
  return '';
};

const validateGrade = (value) => {
  if (!value?.trim()) {
    return 'Grade is required';
  }
  return '';
};

const validateRatePerKG = (value) => {
  if (!value || value <= 0) {
    return 'Rate per KG must be greater than 0';
  }
  if (isNaN(value)) {
    return 'Rate per KG must be a valid number';
  }
  return '';
};

const validateScrapPercentage = (value) => {
  if (!value && value !== 0) {
    return 'Scrap percentage is required';
  }
  if (isNaN(value) || value < 0 || value > 100) {
    return 'Scrap percentage must be between 0 and 100';
  }
  return '';
};

const validateTransportLossPercentage = (value) => {
  if (!value && value !== 0) {
    return 'Transport loss percentage is required';
  }
  if (isNaN(value) || value < 0 || value > 100) {
    return 'Transport loss percentage must be between 0 and 100';
  }
  return '';
};

const validateProfileConversionRate = (value) => {
  if (!value && value !== 0) {
    return 'Profile conversion rate is required';
  }
  if (isNaN(value) || value < 0) {
    return 'Profile conversion rate must be a positive number';
  }
  return '';
};

const validateDateEffective = (value) => {
  if (!value) {
    return 'Date effective is required';
  }
  return '';
};

const AddRawMaterial = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    MaterialName: '',
    Grade: '',
    RatePerKG: '',
    ScrapPercentage: '',
    scrap_rate_per_kg: '',
    TransportLossPercentage: '',
    transport_rate_per_kg: '',
    profile_conversion_rate: '',
    DateEffective: new Date().toISOString().split('T')[0],
    IsActive: true
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for materials dropdown
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Fetch materials for dropdown
  useEffect(() => {
    if (open) {
      fetchMaterials();
    }
  }, [open]);

  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/materials`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMaterials(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  // Calculate derived rates when base values change
  useEffect(() => {
    calculateDerivedRates();
  }, [formData.RatePerKG, formData.ScrapPercentage, formData.TransportLossPercentage]);

  const calculateDerivedRates = () => {
    const ratePerKG = parseFloat(formData.RatePerKG) || 0;
    const scrapPercentage = parseFloat(formData.ScrapPercentage) || 0;
    const transportPercentage = parseFloat(formData.TransportLossPercentage) || 0;

    const scrapRate = (ratePerKG * scrapPercentage) / 100;
    const transportRate = (ratePerKG * transportPercentage) / 100;

    setFormData(prev => ({
      ...prev,
      scrap_rate_per_kg: scrapRate.toFixed(2),
      transport_rate_per_kg: transportRate.toFixed(2)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Handle numeric fields
    const numericFields = ['RatePerKG', 'ScrapPercentage', 'TransportLossPercentage', 'profile_conversion_rate'];
    
    if (numericFields.includes(name)) {
      // Allow only numbers and decimal point
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMaterialChange = (event, newValue) => {
    setSelectedMaterial(newValue);
    setFieldErrors(prev => ({
      ...prev,
      MaterialName: '',
      Grade: ''
    }));
    
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        MaterialName: newValue.MaterialName,
        Grade: newValue.Grade || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        MaterialName: '',
        Grade: ''
      }));
    }
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      IsActive: e.target.checked
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'MaterialName':
        return validateMaterialName(value);
      case 'Grade':
        return validateGrade(value);
      case 'RatePerKG':
        return validateRatePerKG(value);
      case 'ScrapPercentage':
        return validateScrapPercentage(value);
      case 'TransportLossPercentage':
        return validateTransportLossPercentage(value);
      case 'profile_conversion_rate':
        return validateProfileConversionRate(value);
      case 'DateEffective':
        return validateDateEffective(value);
      default:
        return '';
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        // Material Name
        const materialNameError = validateField('MaterialName', formData.MaterialName);
        if (materialNameError) {
          errors.MaterialName = materialNameError;
          isValid = false;
        }

        // Grade
        const gradeError = validateField('Grade', formData.Grade);
        if (gradeError) {
          errors.Grade = gradeError;
          isValid = false;
        }
        break;
      
      case 1: // Rate & Cost Details
        // Rate Per KG
        const rateError = validateField('RatePerKG', formData.RatePerKG);
        if (rateError) {
          errors.RatePerKG = rateError;
          isValid = false;
        }

        // Scrap Percentage
        const scrapError = validateField('ScrapPercentage', formData.ScrapPercentage);
        if (scrapError) {
          errors.ScrapPercentage = scrapError;
          isValid = false;
        }

        // Transport Loss Percentage
        const transportError = validateField('TransportLossPercentage', formData.TransportLossPercentage);
        if (transportError) {
          errors.TransportLossPercentage = transportError;
          isValid = false;
        }

        // Profile Conversion Rate
        const profileError = validateField('profile_conversion_rate', formData.profile_conversion_rate);
        if (profileError) {
          errors.profile_conversion_rate = profileError;
          isValid = false;
        }

        // Date Effective
        const dateError = validateField('DateEffective', formData.DateEffective);
        if (dateError) {
          errors.DateEffective = dateError;
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

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    // Required fields
    const requiredFields = [
      { name: 'MaterialName', label: 'Material name' },
      { name: 'Grade', label: 'Grade' },
      { name: 'RatePerKG', label: 'Rate per KG' },
      { name: 'ScrapPercentage', label: 'Scrap percentage' },
      { name: 'TransportLossPercentage', label: 'Transport loss percentage' },
      { name: 'profile_conversion_rate', label: 'Profile conversion rate' },
      { name: 'DateEffective', label: 'Date effective' }
    ];

    requiredFields.forEach(field => {
      if (!formData[field.name] && formData[field.name] !== 0) {
        errors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    // Validate each field with custom validations
    if (formData.MaterialName) {
      const error = validateField('MaterialName', formData.MaterialName);
      if (error) errors.MaterialName = error;
    }

    if (formData.Grade) {
      const error = validateField('Grade', formData.Grade);
      if (error) errors.Grade = error;
    }

    if (formData.RatePerKG) {
      const error = validateField('RatePerKG', formData.RatePerKG);
      if (error) errors.RatePerKG = error;
    }

    if (formData.ScrapPercentage !== '') {
      const error = validateField('ScrapPercentage', formData.ScrapPercentage);
      if (error) errors.ScrapPercentage = error;
    }

    if (formData.TransportLossPercentage !== '') {
      const error = validateField('TransportLossPercentage', formData.TransportLossPercentage);
      if (error) errors.TransportLossPercentage = error;
    }

    if (formData.profile_conversion_rate !== '') {
      const error = validateField('profile_conversion_rate', formData.profile_conversion_rate);
      if (error) errors.profile_conversion_rate = error;
    }

    if (formData.DateEffective) {
      const error = validateField('DateEffective', formData.DateEffective);
      if (error) errors.DateEffective = error;
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
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare the request body according to API specification
      const requestBody = {
        MaterialName: formData.MaterialName,
        Grade: formData.Grade,
        RatePerKG: parseFloat(formData.RatePerKG),
        ScrapPercentage: parseFloat(formData.ScrapPercentage),
        scrap_rate_per_kg: parseFloat(formData.scrap_rate_per_kg),
        TransportLossPercentage: parseFloat(formData.TransportLossPercentage),
        transport_rate_per_kg: parseFloat(formData.transport_rate_per_kg),
        profile_conversion_rate: parseFloat(formData.profile_conversion_rate),
        DateEffective: formData.DateEffective,
        IsActive: formData.IsActive
      };

      const response = await axios.post(`${BASE_URL}/api/raw-materials`, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add raw material');
      }
    } catch (err) {
      console.error('Error adding raw material:', err);
      setError(err.response?.data?.message || 'Failed to add raw material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      MaterialName: '',
      Grade: '',
      RatePerKG: '',
      ScrapPercentage: '',
      scrap_rate_per_kg: '',
      TransportLossPercentage: '',
      transport_rate_per_kg: '',
      profile_conversion_rate: '',
      DateEffective: new Date().toISOString().split('T')[0],
      IsActive: true
    });
    setFieldErrors({});
    setSelectedMaterial(null);
    setActiveStep(0);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculateEffectiveRate = () => {
    const baseRate = parseFloat(formData.RatePerKG) || 0;
    const scrap = parseFloat(formData.scrap_rate_per_kg) || 0;
    const transport = parseFloat(formData.transport_rate_per_kg) || 0;
    const profileRate = parseFloat(formData.profile_conversion_rate) || 0;
    
    return baseRate + scrap + transport + profileRate;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Material Selection
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    fullWidth
                    options={materials}
                    loading={loadingMaterials}
                    value={selectedMaterial}
                    onChange={handleMaterialChange}
                    getOptionLabel={(option) => 
                      `${option.MaterialName}${option.Grade ? ` - ${option.Grade}` : ''}${option.MaterialCode ? ` (${option.MaterialCode})` : ''}`
                    }
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Select Material *"
                        required
                        disabled={loading}
                        error={!!fieldErrors.MaterialName}
                        helperText={fieldErrors.MaterialName}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 1 }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingMaterials ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {option.MaterialName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {option.MaterialCode} {option.Grade && `| Grade: ${option.Grade}`}
                          </Typography>
                        </Box>
                      </li>
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Material Name *"
                    name="MaterialName"
                    value={formData.MaterialName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={!!fieldErrors.MaterialName}
                    helperText={fieldErrors.MaterialName}
                    InputProps={{
                      readOnly: true,
                      sx: { bgcolor: '#f5f5f5', borderRadius: 1 }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Grade *"
                    name="Grade"
                    value={formData.Grade}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={!!fieldErrors.Grade}
                    helperText={fieldErrors.Grade}
                    InputProps={{
                      readOnly: true,
                      sx: { bgcolor: '#f5f5f5', borderRadius: 1 }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Material Info Summary */}
            {selectedMaterial && (
              <Paper sx={{ p: 2, backgroundColor: '#E3F2FD', borderRadius: 1, border: '1px solid #90CAF9' }}>
                <Typography variant="caption" sx={{ color: '#1976D2', fontWeight: 600, display: 'block', mb: 1 }}>
                  Material Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="textSecondary">Code:</Typography>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography variant="caption" fontWeight={500}>{selectedMaterial.MaterialCode}</Typography>
                  </Grid>
                  {selectedMaterial.Density && (
                    <>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="textSecondary">Density:</Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography variant="caption" fontWeight={500}>
                          {selectedMaterial.Density} {selectedMaterial.Unit || ''}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            )}
          </Stack>
        );
      
      case 1: // Rate & Cost Details
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Rate Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Rate per KG *"
                    name="RatePerKG"
                    value={formData.RatePerKG}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0.00"
                    error={!!fieldErrors.RatePerKG}
                    helperText={fieldErrors.RatePerKG}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    inputProps={{ 
                      step: "0.01", 
                      min: 0,
                      onWheel: (e) => e.target.blur()
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Profile Conversion Rate *"
                    name="profile_conversion_rate"
                    value={formData.profile_conversion_rate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0.00"
                    error={!!fieldErrors.profile_conversion_rate}
                    helperText={fieldErrors.profile_conversion_rate}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    inputProps={{ 
                      step: "0.01", 
                      min: 0,
                      onWheel: (e) => e.target.blur()
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Loss Percentages
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Scrap Percentage *"
                    name="ScrapPercentage"
                    value={formData.ScrapPercentage}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0"
                    error={!!fieldErrors.ScrapPercentage}
                    helperText={fieldErrors.ScrapPercentage}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{ 
                      step: "0.1", 
                      min: 0,
                      max: 100,
                      onWheel: (e) => e.target.blur()
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Transport Loss % *"
                    name="TransportLossPercentage"
                    value={formData.TransportLossPercentage}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0"
                    error={!!fieldErrors.TransportLossPercentage}
                    helperText={fieldErrors.TransportLossPercentage}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{ 
                      step: "0.1", 
                      min: 0,
                      max: 100,
                      onWheel: (e) => e.target.blur()
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Calculated Rates (Read Only)
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Scrap Rate per KG"
                    name="scrap_rate_per_kg"
                    value={formData.scrap_rate_per_kg}
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      sx: { bgcolor: '#f5f5f5', borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Transport Rate per KG"
                    name="transport_rate_per_kg"
                    value={formData.transport_rate_per_kg}
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      sx: { bgcolor: '#f5f5f5', borderRadius: 1 }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Validity & Status
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Date Effective *"
                    name="DateEffective"
                    type="date"
                    value={formData.DateEffective}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={!!fieldErrors.DateEffective}
                    helperText={fieldErrors.DateEffective}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                {/* <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="IsActive"
                        checked={formData.IsActive}
                        onChange={handleSwitchChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Active Material"
                    sx={{ mt: 1 }}
                  />
                </Grid> */}
              </Grid>
            </Paper>

            {/* Calculation Preview */}
            {formData.RatePerKG && formData.ScrapPercentage && formData.TransportLossPercentage && (
              <Paper sx={{ p: 2, backgroundColor: '#E8F5E9', borderRadius: 1, border: '1px solid #C8E6C9' }}>
                <Typography variant="subtitle2" sx={{ color: '#2E7D32', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Rate Calculation Preview
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">Base Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" fontWeight={500} align="right">
                      ₹{parseFloat(formData.RatePerKG).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">Scrap Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" fontWeight={500} align="right" color="warning.main">
                      + ₹{parseFloat(formData.scrap_rate_per_kg || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">Transport Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" fontWeight={500} align="right" color="warning.main">
                      + ₹{parseFloat(formData.transport_rate_per_kg || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">Profile Conversion Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" fontWeight={500} align="right" color="warning.main">
                      + ₹{parseFloat(formData.profile_conversion_rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ borderTop: '1px dashed #BDBDBD', pt: 1, mt: 1 }}>
                      <Grid container>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body1" fontWeight={600} color="textPrimary">
                            Effective Rate:
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body1" fontWeight={700} color="success.main" align="right">
                            ₹{calculateEffectiveRate().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
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
          borderRadius: 1.5,
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        py: 1.5,
        px: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, color: '#101010', mb: 1 }}>
          Add Raw Material
        </Typography>

        {/* 🔥 Modern Stepper with Gradient Connector */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 1, mt: 1 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.85rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2, overflow: 'auto' }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>{error}</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2,
        py: 1.5,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
          startIcon={<NavigateBeforeIcon />}
          sx={{ color: '#666' }}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ mr: 1, color: '#666' }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="small"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
              }}
            >
              {loading ? 'Adding...' : 'Add Material'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="small"
              endIcon={<NavigateNextIcon />}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
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

export default AddRawMaterial;