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
const validateMaterialID = (value) => {
  if (!value) {
    return 'Material is required';
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
    MaterialID: '',
    RatePerKG: '',
    profile_conversion_rate: '',
    ScrapPercentage: '',
    TransportLossPercentage: '',
    DateEffective: new Date().toISOString().split('T')[0],
    Description: ''
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

  // Fetch materials for dropdown using new API endpoint
  useEffect(() => {
    if (open) {
      fetchMaterials();
    }
  }, [open]);

  // Set form data when material prop changes
  useEffect(() => {
    if (material) {
      setFormData({
        MaterialID: material.MaterialID || '',
        RatePerKG: material.RatePerKG?.toString() || '',
        profile_conversion_rate: material.profile_conversion_rate?.toString() || '',
        ScrapPercentage: material.ScrapPercentage?.toString() || '',
        TransportLossPercentage: material.TransportLossPercentage?.toString() || '',
        DateEffective: material.DateEffective ? material.DateEffective.split('T')[0] : new Date().toISOString().split('T')[0],
        Description: material.Description || ''
      });

      // Set selected material if we have the MaterialID
      if (material.MaterialID && materials.length > 0) {
        const matchedMaterial = materials.find(m => m._id === material.MaterialID);
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
      // Updated API endpoint for materials dropdown
      const response = await axios.get(`https://codiantsolutions.com/api/suyashtest/api/materials/dropdown`, {
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
    const formattedMaterial = {
      _id: newMaterial._id,
      material_id: newMaterial.material_id,
      MaterialCode: newMaterial.MaterialCode,
      MaterialName: newMaterial.MaterialName,
      Density: newMaterial.Density,
      Unit: newMaterial.Unit,
      Grade: newMaterial.Grade,
      EffectiveRate: newMaterial.EffectiveRate
    };
    setMaterials(prev => [...prev, formattedMaterial]);
    
    // Auto-select the newly added material
    setSelectedMaterial(formattedMaterial);
    setFormData(prev => ({
      ...prev,
      MaterialID: formattedMaterial._id
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
      MaterialID: ''
    }));
    
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        MaterialID: newValue._id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        MaterialID: ''
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'MaterialID':
        return validateMaterialID(value);
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
        // Material ID
        const materialIdError = validateField('MaterialID', formData.MaterialID);
        if (materialIdError) {
          errors.MaterialID = materialIdError;
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
      { name: 'MaterialID', label: 'Material' },
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
    if (formData.MaterialID) {
      const error = validateField('MaterialID', formData.MaterialID);
      if (error) errors.MaterialID = error;
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
      
      // 🔥 Updated body with new structure
      const requestBody = {
        MaterialID: formData.MaterialID,
        RatePerKG: parseFloat(formData.RatePerKG),
        profile_conversion_rate: parseFloat(formData.profile_conversion_rate),
        ScrapPercentage: parseFloat(formData.ScrapPercentage),
        TransportLossPercentage: parseFloat(formData.TransportLossPercentage),
        DateEffective: formData.DateEffective,
        Description: formData.Description || ''
      };

      // Remove empty Description if not provided
      if (!requestBody.Description) {
        delete requestBody.Description;
      }

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
      MaterialID: '',
      RatePerKG: '',
      profile_conversion_rate: '',
      ScrapPercentage: '',
      TransportLossPercentage: '',
      DateEffective: new Date().toISOString().split('T')[0],
      Description: ''
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
                          error={!!fieldErrors.MaterialID}
                          helperText={fieldErrors.MaterialID}
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
                              {option.Density && ` | Density: ${option.Density} ${option.Unit || ''}`}
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
                    <Label>DESCRIPTION</Label>
                    <TextField
                      fullWidth
                      size="small"
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="e.g., Q2 2025 rate"
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Optional - Add any notes about this rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Material Info Summary */}
            {selectedMaterial && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 0.5 }}>
                  Selected Material Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Material Code:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedMaterial.MaterialCode || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Grade:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedMaterial.Grade || '-'}
                    </Typography>
                  </Grid>
                  {selectedMaterial.Density && (
                    <>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Density:</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {selectedMaterial.Density} {selectedMaterial.Unit || ''}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
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
            </Box>
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
                disabled={loading || !formData.MaterialID || !formData.RatePerKG}
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