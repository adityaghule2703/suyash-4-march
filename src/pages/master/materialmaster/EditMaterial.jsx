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
  InputAdornment,
  FormControlLabel,
  Switch,
  styled
} from '@mui/material';
import { 
  Edit as EditIcon,
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

const EditMaterial = ({ open, onClose, material, onUpdate }) => {
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

  // Enum values for Unit field
  const unitOptions = ['Kg', 'Gram', 'Ton'];

  useEffect(() => {
    if (material) {
      setFormData({
        material_id: material.material_id || '',
        MaterialCode: material.MaterialCode || '',
        MaterialName: material.MaterialName || '',
        Description: material.Description || '',
        Density: material.Density?.toString() || '',
        Unit: material.Unit || 'Kg',
        Standard: material.Standard || '',
        Grade: material.Grade || '',
        Color: material.Color || '',
        EffectiveRate: material.EffectiveRate?.toString() || '',
        IsActive: material.IsActive !== undefined ? material.IsActive : true
      });
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
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
      const response = await axios.put(`${BASE_URL}/api/materials/${material._id}`, {
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
        IsActive: formData.IsActive
      }, {
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
        setError(response.data.message || 'Failed to update material');
      }
    } catch (err) {
      console.error('Error updating material:', err);
      setError(err.response?.data?.message || 'Failed to update material. Please try again.');
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
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Material ID *"
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
                      '& .MuiOutlinedInput-root': { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Material Code *"
                    name="MaterialCode"
                    value={formData.MaterialCode}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., CU-C101"
                    error={!!fieldErrors.MaterialCode}
                    helperText={fieldErrors.MaterialCode}
                    inputProps={{ maxLength: 50 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Unit</InputLabel>
                    <Select
                      name="Unit"
                      value={formData.Unit}
                      onChange={handleSelectChange}
                      label="Unit"
                      disabled={loading}
                      sx={{ borderRadius: 1 }}
                    >
                      {unitOptions.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    placeholder="e.g., Copper"
                    error={!!fieldErrors.MaterialName}
                    helperText={fieldErrors.MaterialName}
                    inputProps={{ maxLength: 100 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1: // Physical Properties & Details
        return (
          <Stack spacing={2}>
            {/* Physical Properties Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Physical Properties
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Density"
                    name="Density"
                    value={formData.Density}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 8.96"
                    error={!!fieldErrors.Density}
                    helperText={fieldErrors.Density}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g/cm³</InputAdornment>,
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
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Standard"
                    name="Standard"
                    value={formData.Standard}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., ASTM B152"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Grade"
                    name="Grade"
                    value={formData.Grade}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., C101"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Additional Details Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Additional Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Color"
                    name="Color"
                    value={formData.Color}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Reddish Brown"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Effective Rate"
                    name="EffectiveRate"
                    value={formData.EffectiveRate}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 850.00"
                    error={!!fieldErrors.EffectiveRate}
                    helperText={fieldErrors.EffectiveRate}
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
                {/* <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="IsActive"
                        checked={formData.IsActive}
                        onChange={handleChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Active Material"
                  />
                </Grid> */}
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
          Edit Material
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
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
              }}
            >
              {loading ? 'Updating...' : 'Update Material'}
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

export default EditMaterial;