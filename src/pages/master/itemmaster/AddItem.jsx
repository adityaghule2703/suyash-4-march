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

  const handleHSNChange = (event) => {
    const selectedHSNCode = event.target.value;
    setFieldErrors(prev => ({
      ...prev,
      hsn_code: ''
    }));
    setFormData(prev => ({
      ...prev,
      hsn_code: selectedHSNCode
    }));
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
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Part Number *"
                    name="part_no"
                    value={formData.part_no}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., PART001"
                    error={!!fieldErrors.part_no}
                    helperText={fieldErrors.part_no}
                    inputProps={{ maxLength: 50 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Item Number *"
                    name="item_no"
                    value={formData.item_no}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., ITEM001"
                    error={!!fieldErrors.item_no}
                    helperText={fieldErrors.item_no}
                    inputProps={{ maxLength: 50 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="small" required error={!!fieldErrors.unit}>
                    <InputLabel>Unit *</InputLabel>
                    <Select
                      name="unit"
                      value={formData.unit}
                      onChange={handleSelectChange}
                      label="Unit *"
                      required
                      disabled={loading}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="">
                        <em>Select Unit</em>
                      </MenuItem>
                      {unitOptions.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.unit && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {fieldErrors.unit}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Part Description *"
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1: // Drawing & Material
        return (
          <Stack spacing={2}>
            {/* Drawing Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Drawing Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Drawing Number"
                    name="drawing_no"
                    value={formData.drawing_no}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., DRG001"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Revision Number"
                    name="revision_no"
                    value={formData.revision_no}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Rev 1.0"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Material Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Material Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Material *"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., Copper"
                    error={!!fieldErrors.material}
                    helperText={fieldErrors.material}
                    inputProps={{ maxLength: 100 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="RM Grade"
                    name="rm_grade"
                    value={formData.rm_grade}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Grade A"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Density (g/cm³)"
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
          </Stack>
        );
      
      case 2: // RM Details & Tax
        return (
          <Stack spacing={2}>
            {/* Raw Material Details */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Raw Material Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="RM Source"
                    name="rm_source"
                    value={formData.rm_source}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., New India CT"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="RM Type"
                    name="rm_type"
                    value={formData.rm_type}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Strip, Sheet, Rod"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="RM Specification"
                    name="rm_spec"
                    value={formData.rm_spec}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Copper"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Strip Size (mm)"
                    name="strip_size"
                    value={formData.strip_size}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 3660"
                    error={!!fieldErrors.strip_size}
                    helperText={fieldErrors.strip_size}
                    inputProps={{ 
                      min: 0,
                      step: "0.01",
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
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pitch (mm)"
                    name="pitch"
                    value={formData.pitch}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 42"
                    error={!!fieldErrors.pitch}
                    helperText={fieldErrors.pitch}
                    inputProps={{ 
                      min: 0,
                      step: "0.01",
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
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Number of Cavities"
                    name="no_of_cavity"
                    value={formData.no_of_cavity}
                    onChange={handleChange}
                    disabled={loading}
                    type="number"
                    placeholder="e.g., 1"
                    error={!!fieldErrors.no_of_cavity}
                    helperText={fieldErrors.no_of_cavity}
                    inputProps={{ 
                      min: 1, 
                      step: 1,
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

            {/* Tax Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Tax Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>HSN Code</InputLabel>
                    <Select
                      name="hsn_code"
                      value={formData.hsn_code}
                      onChange={handleHSNChange}
                      label="HSN Code"
                      disabled={loading || loadingHsn}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="">
                        <em>{loadingHsn ? 'Loading...' : 'Select HSN Code'}</em>
                      </MenuItem>
                      {hsnCodes.map((hsn) => (
                        <MenuItem key={hsn._id} value={hsn.HSNCode}>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {hsn.HSNCode}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {hsn.Description} (GST: {hsn.GSTPercentage}%)
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 3: // Process Parameters
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Process Parameters
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="RM Rejection Percentage (%)"
                    name="rm_rejection_percent"
                    value={formData.rm_rejection_percent}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 2"
                    error={!!fieldErrors.rm_rejection_percent}
                    helperText={fieldErrors.rm_rejection_percent}
                    inputProps={{ 
                      min: 0, 
                      max: 100, 
                      step: 0.1,
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
                    label="Scrap Realisation Percentage (%)"
                    name="scrap_realisation_percent"
                    value={formData.scrap_realisation_percent}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 98"
                    error={!!fieldErrors.scrap_realisation_percent}
                    helperText={fieldErrors.scrap_realisation_percent}
                    inputProps={{ 
                      min: 0, 
                      max: 100, 
                      step: 0.1,
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
          Add New Item
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
              {loading ? 'Adding...' : 'Add Item'}
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

export default AddItem;