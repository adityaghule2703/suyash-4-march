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
  styled,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddMaterial from '../materialmaster/AddMaterial';


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
  if (!value && value !== 0) {
    return 'Rate per KG is required';
  }
  if (isNaN(value) || value <= 0) {
    return 'Rate per KG must be greater than 0';
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

const EditRawMaterial = ({ open, onClose, material, onUpdate }) => {
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
  
  // State for Add Material dialog
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);

  // Fetch materials for dropdown
  useEffect(() => {
    if (open) {
      fetchMaterials();
    }
  }, [open]);

  // Set form data when material prop changes
  useEffect(() => {
    if (material) {
      setFormData({
        MaterialName: material.MaterialName || '',
        Grade: material.Grade || '',
        RatePerKG: material.RatePerKG?.toString() || '',
        ScrapPercentage: material.ScrapPercentage?.toString() || '',
        scrap_rate_per_kg: material.scrap_rate_per_kg?.toString() || '',
        TransportLossPercentage: material.TransportLossPercentage?.toString() || '',
        transport_rate_per_kg: material.transport_rate_per_kg?.toString() || '',
        profile_conversion_rate: material.profile_conversion_rate?.toString() || '',
        DateEffective: material.DateEffective ? material.DateEffective.split('T')[0] : new Date().toISOString().split('T')[0],
        IsActive: material.IsActive !== undefined ? material.IsActive : true
      });

      // Set selected material if we have the material name
      if (material.MaterialName && materials.length > 0) {
        const matchedMaterial = materials.find(m => m.MaterialName === material.MaterialName);
        if (matchedMaterial) {
          setSelectedMaterial(matchedMaterial);
        }
      }
    }
  }, [material, materials]);

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

  // Handle material added from AddMaterial dialog
  const handleMaterialAdded = (newMaterial) => {
    // Add the new material to the materials list
    setMaterials(prev => [...prev, newMaterial]);
    
    // Auto-select the newly added material
    setSelectedMaterial(newMaterial);
    setFormData(prev => ({
      ...prev,
      MaterialName: newMaterial.MaterialName,
      Grade: newMaterial.Grade || ''
    }));
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

      const response = await axios.put(`${BASE_URL}/api/raw-materials/${material._id}`, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update raw material');
      }
    } catch (err) {
      console.error('Error updating raw material:', err);
      setError(err.response?.data?.message || 'Failed to update raw material. Please try again.');
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

  // Label component for consistency
  const Label = ({ children, required }) => (
    <Typography sx={{ 
      fontSize: '0.7rem', 
      fontWeight: 600, 
      color: COLORS.text.secondary, 
      letterSpacing: '0.5px' 
    }}>
      {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </Typography>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Stack spacing={2}>
            {/* Material Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Material Selection
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Label required>SELECT MATERIAL</Label>
                      <Tooltip title="Add New Material">
                        <IconButton
                          size="small"
                          onClick={() => setAddMaterialOpen(true)}
                          sx={{
                            color: COLORS.primary,
                            p: 0.25,
                            '&:hover': { bgcolor: COLORS.primaryLight }
                          }}
                        >
                          <AddIcon sx={{ fontSize: '0.8rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
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
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select material"
                          required
                          error={!!fieldErrors.MaterialName}
                          helperText={fieldErrors.MaterialName}
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
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingMaterials ? <CircularProgress color="inherit" size={16} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                              {option.MaterialName}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                              {option.MaterialCode} {option.Grade && `| Grade: ${option.Grade}`}
                            </Typography>
                          </Box>
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
                    {!loadingMaterials && materials.length === 0 && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                        No materials available. Please click the + button to add a material first.
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>MATERIAL NAME</Label>
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
                      InputProps={{
                        readOnly: true,
                        sx: { 
                          bgcolor: COLORS.background.light,
                          borderRadius: 1.5
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: COLORS.text.primary
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
                    <Label required>GRADE</Label>
                    <TextField
                      fullWidth
                      size="small"
                      name="Grade"
                      value={formData.Grade}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., C101"
                      error={!!fieldErrors.Grade}
                      helperText={fieldErrors.Grade}
                      InputProps={{
                        readOnly: true,
                        sx: { 
                          bgcolor: COLORS.background.light,
                          borderRadius: 1.5
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: COLORS.text.primary
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Material Info Summary */}
            {selectedMaterial && (
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  Code: {selectedMaterial.MaterialCode}
                  {selectedMaterial.Density && ` | Density: ${selectedMaterial.Density} ${selectedMaterial.Unit || ''}`}
                </Typography>
              </Box>
            )}
          </Stack>
        );
      
      case 1: // Rate & Cost Details
        return (
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Rate per KG */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>RATE PER KG</Label>
                  <TextField
                    fullWidth
                    size="small"
                    name="RatePerKG"
                    value={formData.RatePerKG}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0.00"
                    error={!!fieldErrors.RatePerKG}
                    helperText={fieldErrors.RatePerKG}
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
                </Box>
              </Box>

              {/* Profile Conversion Rate */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>PROFILE CONVERSION RATE</Label>
                  <TextField
                    fullWidth
                    size="small"
                    name="profile_conversion_rate"
                    value={formData.profile_conversion_rate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0.00"
                    error={!!fieldErrors.profile_conversion_rate}
                    helperText={fieldErrors.profile_conversion_rate}
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
                </Box>
              </Box>

              {/* Scrap Percentage */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>SCRAP PERCENTAGE</Label>
                  <TextField
                    fullWidth
                    size="small"
                    name="ScrapPercentage"
                    value={formData.ScrapPercentage}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0"
                    error={!!fieldErrors.ScrapPercentage}
                    helperText={fieldErrors.ScrapPercentage}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                          %
                        </Typography>
                      ),
                    }}
                    inputProps={{ 
                      step: "0.1", 
                      min: 0,
                      max: 100,
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
                </Box>
              </Box>

              {/* Transport Loss Percentage */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>TRANSPORT LOSS %</Label>
                  <TextField
                    fullWidth
                    size="small"
                    name="TransportLossPercentage"
                    value={formData.TransportLossPercentage}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0"
                    error={!!fieldErrors.TransportLossPercentage}
                    helperText={fieldErrors.TransportLossPercentage}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                          %
                        </Typography>
                      ),
                    }}
                    inputProps={{ 
                      step: "0.1", 
                      min: 0,
                      max: 100,
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
                </Box>
              </Box>

              {/* Date Effective */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>DATE EFFECTIVE</Label>
                  <TextField
                    fullWidth
                    size="small"
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
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Status Switch */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    Active Status
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.IsActive}
                        onChange={handleSwitchChange}
                        disabled={loading}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: COLORS.primary,
                            '&:hover': {
                              bgcolor: `${COLORS.primary}20`
                            }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: COLORS.primary
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {formData.IsActive ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                  />
                </Box>
              </Box>

              {/* Scrap Rate (Read Only) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    SCRAP RATE PER KG
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="scrap_rate_per_kg"
                    value={formData.scrap_rate_per_kg}
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mr: 0.5 }}>
                          ₹
                        </Typography>
                      ),
                      sx: { bgcolor: COLORS.background.light, borderRadius: 1.5 }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem',
                        color: COLORS.text.primary
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Transport Rate (Read Only) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    TRANSPORT RATE PER KG
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transport_rate_per_kg"
                    value={formData.transport_rate_per_kg}
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mr: 0.5 }}>
                          ₹
                        </Typography>
                      ),
                      sx: { bgcolor: COLORS.background.light, borderRadius: 1.5 }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem',
                        color: COLORS.text.primary
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Calculation Preview */}
            {formData.RatePerKG && formData.ScrapPercentage && formData.TransportLossPercentage && (
              <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primaryDark, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Rate Calculation Preview
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Base Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary, textAlign: 'right' }}>
                      ₹{parseFloat(formData.RatePerKG).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scrap Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.primaryDark, textAlign: 'right' }}>
                      + ₹{parseFloat(formData.scrap_rate_per_kg || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Transport Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.primaryDark, textAlign: 'right' }}>
                      + ₹{parseFloat(formData.transport_rate_per_kg || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Profile Conversion Rate:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.primaryDark, textAlign: 'right' }}>
                      + ₹{parseFloat(formData.profile_conversion_rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ borderTop: `1px dashed ${COLORS.border}`, pt: 1, mt: 1 }}>
                      <Grid container>
                        <Grid size={{ xs: 6 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                            Effective Rate:
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primaryDark, textAlign: 'right' }}>
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
    <>
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
          mb: 1,
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
            Edit Raw Material
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
                disabled={loading || !formData.MaterialName || !formData.Grade || !formData.RatePerKG}
                startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? 'Updating...' : 'Update Material'}
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

      {/* Add Material Dialog */}
      <AddMaterial
        open={addMaterialOpen}
        onClose={() => setAddMaterialOpen(false)}
        onAdd={handleMaterialAdded}
      />
    </>
  );
};

export default EditRawMaterial;