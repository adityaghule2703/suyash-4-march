import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  styled,
  Autocomplete
} from '@mui/material';
import { 
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching other components
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
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
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// 🔥 Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Basic Information', 'Physical Properties & Details'];

// Validation helper functions
const validateMaterialId = (value) => {
  if (!value?.trim()) {
    return 'Material ID is required';
  } else if (value.length > 50) {
    return 'Material ID should not exceed 50 characters';
  }
  return '';
};

const validateMaterialCode = (value) => {
  if (!value?.trim()) {
    return 'Material code is required';
  } else if (value.length > 50) {
    return 'Material code should not exceed 50 characters';
  }
  return '';
};

const validateMaterialName = (value) => {
  if (!value?.trim()) {
    return 'Material name is required';
  } else if (value.length > 100) {
    return 'Material name should not exceed 100 characters';
  }
  return '';
};

const validateDescription = (value) => {
  if (value && value.length > 500) {
    return 'Description should not exceed 500 characters';
  }
  return '';
};

const validateDensity = (value) => {
  if (value && (isNaN(value) || parseFloat(value) <= 0)) {
    return 'Density must be a positive number';
  }
  return '';
};

const validateEffectiveRate = (value) => {
  if (value && (isNaN(value) || parseFloat(value) <= 0)) {
    return 'Effective rate must be a positive number';
  }
  return '';
};

const AddMaterial = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    material_id: '',
    MaterialCode: '',
    MaterialName: '',
    Description: '',
    Density: '',
    Unit: 'Kg',
    Standard: '',
    Grade: '',
    Color: '',
    EffectiveRate: '',
    IsActive: true
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('Kg');

  // Enum values for Unit field
  const unitOptions = ['Kg', 'Gram', 'Ton'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Handle numeric fields
    const numericFields = ['Density', 'EffectiveRate'];
    
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

  const handleUnitChange = (event, newValue) => {
    setSelectedUnit(newValue);
    setFieldErrors(prev => ({
      ...prev,
      Unit: ''
    }));
    setFormData(prev => ({
      ...prev,
      Unit: newValue || 'Kg'
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'material_id':
        return validateMaterialId(value);
      case 'MaterialCode':
        return validateMaterialCode(value);
      case 'MaterialName':
        return validateMaterialName(value);
      case 'Description':
        return validateDescription(value);
      case 'Density':
        return validateDensity(value);
      case 'EffectiveRate':
        return validateEffectiveRate(value);
      default:
        return '';
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        // Material ID
        const materialIdError = validateField('material_id', formData.material_id);
        if (materialIdError) {
          errors.material_id = materialIdError;
          isValid = false;
        }

        // Material Code
        const materialCodeError = validateField('MaterialCode', formData.MaterialCode);
        if (materialCodeError) {
          errors.MaterialCode = materialCodeError;
          isValid = false;
        }

        // Material Name
        const materialNameError = validateField('MaterialName', formData.MaterialName);
        if (materialNameError) {
          errors.MaterialName = materialNameError;
          isValid = false;
        }

        // Description (optional)
        if (formData.Description) {
          const descriptionError = validateField('Description', formData.Description);
          if (descriptionError) {
            errors.Description = descriptionError;
            isValid = false;
          }
        }
        break;
      
      case 1: // Physical Properties & Details
        // Density (optional)
        if (formData.Density) {
          const densityError = validateField('Density', formData.Density);
          if (densityError) {
            errors.Density = densityError;
            isValid = false;
          }
        }

        // Effective Rate (optional)
        if (formData.EffectiveRate) {
          const rateError = validateField('EffectiveRate', formData.EffectiveRate);
          if (rateError) {
            errors.EffectiveRate = rateError;
            isValid = false;
          }
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
      { name: 'material_id', label: 'Material ID' },
      { name: 'MaterialCode', label: 'Material code' },
      { name: 'MaterialName', label: 'Material name' }
    ];

    requiredFields.forEach(field => {
      if (!formData[field.name]?.trim()) {
        errors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    // Validate each field with custom validations
    if (formData.material_id) {
      const error = validateField('material_id', formData.material_id);
      if (error) errors.material_id = error;
    }

    if (formData.MaterialCode) {
      const error = validateField('MaterialCode', formData.MaterialCode);
      if (error) errors.MaterialCode = error;
    }

    if (formData.MaterialName) {
      const error = validateField('MaterialName', formData.MaterialName);
      if (error) errors.MaterialName = error;
    }

    if (formData.Description) {
      const error = validateField('Description', formData.Description);
      if (error) errors.Description = error;
    }

    if (formData.Density) {
      const error = validateField('Density', formData.Density);
      if (error) errors.Density = error;
    }

    if (formData.EffectiveRate) {
      const error = validateField('EffectiveRate', formData.EffectiveRate);
      if (error) errors.EffectiveRate = error;
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
      const response = await axios.post(`${BASE_URL}/api/materials`, {
        material_id: formData.material_id,
        MaterialCode: formData.MaterialCode,
        MaterialName: formData.MaterialName,
        Description: formData.Description,
        Density: formData.Density ? parseFloat(formData.Density) : null,
        Unit: formData.Unit,
        Standard: formData.Standard,
        Grade: formData.Grade,
        Color: formData.Color,
        EffectiveRate: formData.EffectiveRate ? parseFloat(formData.EffectiveRate) : null,
        IsActive: true
      }, {
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
        setError(response.data.message || 'Failed to add material');
      }
    } catch (err) {
      console.error('Error adding material:', err);
      setError(err.response?.data?.message || 'Failed to add material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      material_id: '',
      MaterialCode: '',
      MaterialName: '',
      Description: '',
      Density: '',
      Unit: 'Kg',
      Standard: '',
      Grade: '',
      Color: '',
      EffectiveRate: '',
      IsActive: true
    });
    setSelectedUnit('Kg');
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MATERIAL ID <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="material_id"
                      value={formData.material_id}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., MAT-CU-001"
                      error={!!fieldErrors.material_id}
                      helperText={fieldErrors.material_id}
                      inputProps={{ maxLength: 50 }}
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MATERIAL CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="MaterialCode"
                      value={formData.MaterialCode}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., CU-C101"
                      error={!!fieldErrors.MaterialCode}
                      helperText={fieldErrors.MaterialCode}
                      inputProps={{ maxLength: 50 }}
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      UNIT
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={unitOptions}
                      value={selectedUnit}
                      onChange={handleUnitChange}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select unit"
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
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </Typography>
                        </li>
                      )}
                      ListboxProps={{
                        sx: {
                          '& .MuiAutocomplete-option': {
                            fontSize: '0.75rem', py: 1, px: 1.5
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MATERIAL NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="MaterialName"
                      value={formData.MaterialName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., Copper"
                      error={!!fieldErrors.MaterialName}
                      helperText={fieldErrors.MaterialName}
                      inputProps={{ maxLength: 100 }}
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DESCRIPTION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="e.g., Electrolytic Copper - High Conductivity"
                      error={!!fieldErrors.Description}
                      helperText={fieldErrors.Description}
                      inputProps={{ maxLength: 500 }}
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1: // Physical Properties & Details
        return (
          <Stack spacing={2}>
            {/* Physical Properties Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Physical Properties
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DENSITY
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Density"
                      value={formData.Density}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 8.96"
                      error={!!fieldErrors.Density}
                      helperText={fieldErrors.Density}
                      InputProps={{
                        endAdornment: (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                            g/cm³
                          </Typography>
                        ),
                      }}
                      inputProps={{ 
                        step: "0.01", 
                        min: 0,
                        onWheel: (e) => e.target.blur()
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none', margin: 0
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Optional - Leave blank if not applicable
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STANDARD
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Standard"
                      value={formData.Standard}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., ASTM B152"
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GRADE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Grade"
                      value={formData.Grade}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., C101"
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Additional Details Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Additional Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COLOR
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="Color"
                      value={formData.Color}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Reddish Brown"
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EFFECTIVE RATE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="EffectiveRate"
                      value={formData.EffectiveRate}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 850.00"
                      error={!!fieldErrors.EffectiveRate}
                      helperText={fieldErrors.EffectiveRate}
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mr: 0.5 }}>
                            ₹
                          </Typography>
                        ),
                      }}
                      inputProps={{ 
                        step: "0.01", 
                        min: 0,
                        onWheel: (e) => e.target.blur()
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none', margin: 0
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Optional - Leave blank if not applicable
                    </Typography>
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
          overflow: 'hidden',
          maxHeight: '95vh'
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
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Add New Material
        </Typography>

        {/* 🔥 Modern Stepper with Gradient Connector */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem',
                alignItems: 'center'
              },
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
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
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
            },
            '&:disabled': {
              borderColor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !formData.material_id || !formData.MaterialCode || !formData.MaterialName}
              startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
                },
                '&:disabled': {
                  bgcolor: COLORS.border,
                  color: COLORS.text.tertiary
                }
              }}
            >
              {loading ? 'Adding...' : 'Add Material'}
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
                },
                '&:disabled': {
                  bgcolor: COLORS.border,
                  color: COLORS.text.tertiary
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

export default AddMaterial;