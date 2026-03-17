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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const steps = ['Basic Info', 'Drawing & Material', 'RM Details & Tax', 'Process Parameters'];

// Validation helper functions
const validatePartNo = (partNo) => {
  if (!partNo?.trim()) {
    return 'Part number is required';
  } else if (partNo.length > 50) {
    return 'Part number should not exceed 50 characters';
  }
  return '';
};

const validatePartDescription = (desc) => {
  if (!desc?.trim()) {
    return 'Part description is required';
  } else if (desc.length > 200) {
    return 'Part description should not exceed 200 characters';
  }
  return '';
};

const validateItemNo = (itemNo) => {
  if (!itemNo?.trim()) {
    return 'Item number is required';
  } else if (itemNo.length > 50) {
    return 'Item number should not exceed 50 characters';
  }
  return '';
};

const validateMaterial = (material) => {
  if (!material?.trim()) {
    return 'Material is required';
  } else if (material.length > 100) {
    return 'Material should not exceed 100 characters';
  }
  return '';
};

const validateDensity = (density) => {
  if (density && (isNaN(density) || density <= 0)) {
    return 'Density must be a positive number';
  }
  return '';
};

const validateStripSize = (size) => {
  if (size && (isNaN(size) || size <= 0)) {
    return 'Strip size must be a positive number';
  }
  return '';
};

const validatePitch = (pitch) => {
  if (pitch && (isNaN(pitch) || pitch <= 0)) {
    return 'Pitch must be a positive number';
  }
  return '';
};

const validateNoOfCavity = (cavity) => {
  if (cavity && (isNaN(cavity) || cavity < 1)) {
    return 'Number of cavities must be at least 1';
  }
  return '';
};

const validatePercentage = (value, fieldName) => {
  if (value && (isNaN(value) || value < 0 || value > 100)) {
    return `${fieldName} must be between 0 and 100`;
  }
  return '';
};

const AddItem = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    part_no: '',
    part_description: '',
    drawing_no: '',
    revision_no: '',
    rm_grade: '',
    density: '',
    unit: '',
    hsn_code: '',
    item_no: '',
    material: '',
    rm_source: '',
    rm_type: '',
    rm_spec: '',
    strip_size: '',
    pitch: '',
    no_of_cavity: 1,
    rm_rejection_percent: '',
    scrap_realisation_percent: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hsnCodes, setHsnCodes] = useState([]);
  const [loadingHsn, setLoadingHsn] = useState(false);
  const [selectedHSN, setSelectedHSN] = useState(null);

  // Options
  const unitOptions = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

  // Fetch HSN codes
  useEffect(() => {
    if (open) {
      fetchHsnCodes();
    }
  }, [open]);

  const fetchHsnCodes = async () => {
    try {
      setLoadingHsn(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/taxes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const activeHsnCodes = (response.data.data || [])
          .filter(tax => tax.IsActive === true)
          .map(tax => ({
            _id: tax._id,
            HSNCode: tax.HSNCode,
            Description: tax.Description,
            GSTPercentage: tax.GSTPercentage || 0
          }));
        setHsnCodes(activeHsnCodes);
      }
    } catch (err) {
      console.error('Error fetching HSN codes:', err);
    } finally {
      setLoadingHsn(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Handle numeric fields
    const numericFields = ['density', 'strip_size', 'pitch', 'no_of_cavity', 
                          'rm_rejection_percent', 'scrap_realisation_percent'];
    
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

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHSNChange = (event, newValue) => {
    setSelectedHSN(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        hsn_code: newValue.HSNCode
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        hsn_code: ''
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'part_no':
        return validatePartNo(value);
      case 'part_description':
        return validatePartDescription(value);
      case 'item_no':
        return validateItemNo(value);
      case 'material':
        return validateMaterial(value);
      case 'unit':
        if (!value) return 'Unit is required';
        break;
      case 'density':
        return validateDensity(value);
      case 'strip_size':
        return validateStripSize(value);
      case 'pitch':
        return validatePitch(value);
      case 'no_of_cavity':
        return validateNoOfCavity(value);
      case 'rm_rejection_percent':
        return validatePercentage(value, 'RM rejection percentage');
      case 'scrap_realisation_percent':
        return validatePercentage(value, 'Scrap realisation percentage');
      default:
        return '';
    }
    return '';
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Info
        // Part Number
        const partNoError = validateField('part_no', formData.part_no);
        if (partNoError) {
          errors.part_no = partNoError;
          isValid = false;
        }

        // Part Description
        const partDescError = validateField('part_description', formData.part_description);
        if (partDescError) {
          errors.part_description = partDescError;
          isValid = false;
        }

        // Item Number
        const itemNoError = validateField('item_no', formData.item_no);
        if (itemNoError) {
          errors.item_no = itemNoError;
          isValid = false;
        }

        // Unit
        if (!formData.unit) {
          errors.unit = 'Unit is required';
          isValid = false;
        }
        break;
      
      case 1: // Drawing & Material
        // Material
        const materialError = validateField('material', formData.material);
        if (materialError) {
          errors.material = materialError;
          isValid = false;
        }

        // Density (optional)
        if (formData.density) {
          const densityError = validateField('density', formData.density);
          if (densityError) {
            errors.density = densityError;
            isValid = false;
          }
        }
        break;
      
      case 2: // RM Details & Tax
        // Strip Size (optional)
        if (formData.strip_size) {
          const stripSizeError = validateField('strip_size', formData.strip_size);
          if (stripSizeError) {
            errors.strip_size = stripSizeError;
            isValid = false;
          }
        }

        // Pitch (optional)
        if (formData.pitch) {
          const pitchError = validateField('pitch', formData.pitch);
          if (pitchError) {
            errors.pitch = pitchError;
            isValid = false;
          }
        }

        // No of Cavity
        const cavityError = validateField('no_of_cavity', formData.no_of_cavity);
        if (cavityError) {
          errors.no_of_cavity = cavityError;
          isValid = false;
        }
        break;
      
      case 3: // Process Parameters
        // RM Rejection Percentage (optional)
        if (formData.rm_rejection_percent) {
          const rejectionError = validateField('rm_rejection_percent', formData.rm_rejection_percent);
          if (rejectionError) {
            errors.rm_rejection_percent = rejectionError;
            isValid = false;
          }
        }

        // Scrap Realisation Percentage (optional)
        if (formData.scrap_realisation_percent) {
          const scrapError = validateField('scrap_realisation_percent', formData.scrap_realisation_percent);
          if (scrapError) {
            errors.scrap_realisation_percent = scrapError;
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
      { name: 'part_no', label: 'Part number' },
      { name: 'part_description', label: 'Part description' },
      { name: 'item_no', label: 'Item number' },
      { name: 'material', label: 'Material' },
      { name: 'unit', label: 'Unit' }
    ];

    requiredFields.forEach(field => {
      if (!formData[field.name]?.trim()) {
        errors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    // Validate each field with custom validations
    if (formData.part_no) {
      const error = validateField('part_no', formData.part_no);
      if (error) errors.part_no = error;
    }

    if (formData.part_description) {
      const error = validateField('part_description', formData.part_description);
      if (error) errors.part_description = error;
    }

    if (formData.item_no) {
      const error = validateField('item_no', formData.item_no);
      if (error) errors.item_no = error;
    }

    if (formData.material) {
      const error = validateField('material', formData.material);
      if (error) errors.material = error;
    }

    if (formData.density) {
      const error = validateField('density', formData.density);
      if (error) errors.density = error;
    }

    if (formData.strip_size) {
      const error = validateField('strip_size', formData.strip_size);
      if (error) errors.strip_size = error;
    }

    if (formData.pitch) {
      const error = validateField('pitch', formData.pitch);
      if (error) errors.pitch = error;
    }

    if (formData.no_of_cavity) {
      const error = validateField('no_of_cavity', formData.no_of_cavity);
      if (error) errors.no_of_cavity = error;
    }

    if (formData.rm_rejection_percent) {
      const error = validateField('rm_rejection_percent', formData.rm_rejection_percent);
      if (error) errors.rm_rejection_percent = error;
    }

    if (formData.scrap_realisation_percent) {
      const error = validateField('scrap_realisation_percent', formData.scrap_realisation_percent);
      if (error) errors.scrap_realisation_percent = error;
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
      
      const submissionData = {
        ...formData,
        density: formData.density ? parseFloat(formData.density) : null,
        strip_size: formData.strip_size ? parseFloat(formData.strip_size) : null,
        pitch: formData.pitch ? parseFloat(formData.pitch) : null,
        no_of_cavity: formData.no_of_cavity ? parseInt(formData.no_of_cavity) : 1,
        rm_rejection_percent: formData.rm_rejection_percent ? parseFloat(formData.rm_rejection_percent) : null,
        scrap_realisation_percent: formData.scrap_realisation_percent ? parseFloat(formData.scrap_realisation_percent) : null
      };

      const response = await axios.post(`${BASE_URL}/api/items`, submissionData, {
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
        setError(response.data.message || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      part_no: '',
      part_description: '',
      drawing_no: '',
      revision_no: '',
      rm_grade: '',
      density: '',
      unit: '',
      hsn_code: '',
      item_no: '',
      material: '',
      rm_source: '',
      rm_type: '',
      rm_spec: '',
      strip_size: '',
      pitch: '',
      no_of_cavity: 1,
      rm_rejection_percent: '',
      scrap_realisation_percent: ''
    });
    setSelectedHSN(null);
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
      case 0: // Basic Info
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
                      PART NUMBER <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="part_no"
                      value={formData.part_no}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., PART001"
                      error={!!fieldErrors.part_no}
                      helperText={fieldErrors.part_no}
                      inputProps={{ maxLength: 50 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      ITEM NUMBER <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="item_no"
                      value={formData.item_no}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., ITEM001"
                      error={!!fieldErrors.item_no}
                      helperText={fieldErrors.item_no}
                      inputProps={{ maxLength: 50 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      UNIT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={unitOptions}
                      value={formData.unit || null}
                      onChange={(event, newValue) => {
                        setFieldErrors(prev => ({ ...prev, unit: '' }));
                        setFormData(prev => ({ ...prev, unit: newValue || '' }));
                      }}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select unit"
                          required
                          error={!!fieldErrors.unit}
                          helperText={fieldErrors.unit}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': {
                              py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                            },
                            '& .MuiFormHelperText-root': {
                              fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25
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
                      PART DESCRIPTION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="part_description"
                      value={formData.part_description}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      required
                      disabled={loading}
                      placeholder="Enter detailed part description"
                      error={!!fieldErrors.part_description}
                      helperText={fieldErrors.part_description}
                      inputProps={{ maxLength: 200 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
      
      case 1: // Drawing & Material
        return (
          <Stack spacing={2}>
            {/* Drawing Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Drawing Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DRAWING NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="drawing_no"
                      value={formData.drawing_no}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., DRG001"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      REVISION NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="revision_no"
                      value={formData.revision_no}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Rev 1.0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Material Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Material Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MATERIAL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., Copper"
                      error={!!fieldErrors.material}
                      helperText={fieldErrors.material}
                      inputProps={{ maxLength: 100 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      RM GRADE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rm_grade"
                      value={formData.rm_grade}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Grade A"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DENSITY (g/cm³)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="density"
                      value={formData.density}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 8.96"
                      error={!!fieldErrors.density}
                      helperText={fieldErrors.density}
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
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
      
      case 2: // RM Details & Tax
        return (
          <Stack spacing={2}>
            {/* Raw Material Details */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Raw Material Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RM SOURCE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rm_source"
                      value={formData.rm_source}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., New India CT"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RM TYPE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rm_type"
                      value={formData.rm_type}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Strip, Sheet, Rod"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RM SPECIFICATION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rm_spec"
                      value={formData.rm_spec}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Copper"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': {
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STRIP SIZE (mm)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="strip_size"
                      value={formData.strip_size}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 3660"
                      error={!!fieldErrors.strip_size}
                      helperText={fieldErrors.strip_size}
                      inputProps={{ 
                        min: 0, step: "0.01",
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
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      Optional
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PITCH (mm)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="pitch"
                      value={formData.pitch}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 42"
                      error={!!fieldErrors.pitch}
                      helperText={fieldErrors.pitch}
                      inputProps={{ 
                        min: 0, step: "0.01",
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
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      Optional
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      NUMBER OF CAVITIES
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="no_of_cavity"
                      value={formData.no_of_cavity}
                      onChange={handleChange}
                      disabled={loading}
                      type="number"
                      placeholder="e.g., 1"
                      error={!!fieldErrors.no_of_cavity}
                      helperText={fieldErrors.no_of_cavity}
                      inputProps={{ 
                        min: 1, step: 1,
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
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                </Grid>
              </Grid>
            </Paper>

            {/* Tax Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Tax Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      HSN CODE
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={hsnCodes}
                      loading={loadingHsn}
                      value={selectedHSN}
                      onChange={handleHSNChange}
                      getOptionLabel={(option) => option.HSNCode || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder={loadingHsn ? 'Loading...' : 'Select HSN code'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': {
                              py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
                            }
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingHsn ? <CircularProgress color="inherit" size={16} /> : null}
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
                              {option.HSNCode}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                              {option.Description} (GST: {option.GSTPercentage}%)
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Optional - Select HSN code for tax calculation
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 3: // Process Parameters
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Process Parameters
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RM REJECTION PERCENTAGE (%)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rm_rejection_percent"
                      value={formData.rm_rejection_percent}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 2"
                      error={!!fieldErrors.rm_rejection_percent}
                      helperText={fieldErrors.rm_rejection_percent}
                      inputProps={{ 
                        min: 0, max: 100, step: 0.1,
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
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      Optional - Percentage of raw material rejection
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SCRAP REALISATION PERCENTAGE (%)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="scrap_realisation_percent"
                      value={formData.scrap_realisation_percent}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 98"
                      error={!!fieldErrors.scrap_realisation_percent}
                      helperText={fieldErrors.scrap_realisation_percent}
                      inputProps={{ 
                        min: 0, max: 100, step: 0.1,
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
                          py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary
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
                      Optional - Percentage of scrap that can be recovered
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
          Add New Item
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
              disabled={loading}
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
              {loading ? 'Adding...' : 'Add Item'}
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

export default AddItem;