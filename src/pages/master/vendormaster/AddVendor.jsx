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
  FormControlLabel,
  Switch,
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

const steps = ['Basic Information', 'Contact & Address', 'Tax & Status'];

// Validation helper functions
const validateGST = (gst) => {
  if (!gst) return true; // Optional field
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

const validateEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return false; // Required field
  // Remove all spaces, hyphens, and +91 prefix for validation
  const cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
  // Check if it's exactly 10 digits and starts with 6-9
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

const validateStateCode = (code) => {
  if (!code) return true; // Optional field
  const numCode = Number(code);
  return numCode >= 1 && numCode <= 99;
};

const AddVendor = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    vendor_code: '',
    vendor_name: '',
    vendor_type: 'Both',
    address: '',
    gstin: '',
    state: '',
    state_code: '',
    contact_person: '',
    phone: '',
    email: '',
    is_active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Vendor type options from enum
  const vendorTypes = [
    { value: 'RM', label: 'Raw Material' },
    { value: 'Process', label: 'Process' },
    { value: 'Both', label: 'Both' }
  ];

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
    
    // Handle different field types
    if (name === 'gstin') {
      // Auto uppercase for GSTIN
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else if (name === 'phone') {
      // Allow only digits, +, space, hyphen for phone
      const cleanValue = value.replace(/[^\d\s\-\+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else if (name === 'state_code') {
      // Only allow digits
      if (value === '' || /^\d*$/.test(value)) {
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
      case 'vendor_code':
        if (!value?.trim()) {
          return 'Vendor code is required';
        } else if (value.length > 20) {
          return 'Vendor code should not exceed 20 characters';
        }
        break;
      case 'vendor_name':
        if (!value?.trim()) {
          return 'Vendor name is required';
        } else if (value.length > 100) {
          return 'Vendor name should not exceed 100 characters';
        }
        break;
      case 'vendor_type':
        if (!value) {
          return 'Vendor type is required';
        }
        break;
      case 'contact_person':
        if (!value?.trim()) {
          return 'Contact person is required';
        }
        break;
      case 'phone':
        if (!value?.trim()) {
          return 'Phone number is required';
        } else if (!validatePhone(value)) {
          return 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address (e.g., vendor@gmail.com)';
        }
        break;
      case 'gstin':
        if (value && !validateGST(value)) {
          return 'Please enter a valid GSTIN (e.g., 27AAPFU0939F1Z5)';
        }
        break;
      case 'state_code':
        if (value && !validateStateCode(value)) {
          return 'State code must be between 1 and 99';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        // Vendor Code
        if (!formData.vendor_code?.trim()) {
          errors.vendor_code = 'Vendor code is required';
          isValid = false;
        } else if (formData.vendor_code.length > 20) {
          errors.vendor_code = 'Vendor code should not exceed 20 characters';
          isValid = false;
        }

        // Vendor Name
        if (!formData.vendor_name?.trim()) {
          errors.vendor_name = 'Vendor name is required';
          isValid = false;
        } else if (formData.vendor_name.length > 100) {
          errors.vendor_name = 'Vendor name should not exceed 100 characters';
          isValid = false;
        }

        // Vendor Type
        if (!formData.vendor_type) {
          errors.vendor_type = 'Vendor type is required';
          isValid = false;
        }
        break;
      
      case 1: // Contact & Address
        // Contact Person
        if (!formData.contact_person?.trim()) {
          errors.contact_person = 'Contact person is required';
          isValid = false;
        }

        // Phone
        if (!formData.phone?.trim()) {
          errors.phone = 'Phone number is required';
          isValid = false;
        } else {
          const phoneError = validateField('phone', formData.phone);
          if (phoneError) {
            errors.phone = phoneError;
            isValid = false;
          }
        }

        // Email (optional)
        if (formData.email) {
          const emailError = validateField('email', formData.email);
          if (emailError) {
            errors.email = emailError;
            isValid = false;
          }
        }

        // State Code (optional)
        if (formData.state_code) {
          const stateCodeError = validateField('state_code', formData.state_code);
          if (stateCodeError) {
            errors.state_code = stateCodeError;
            isValid = false;
          }
        }
        break;
      
      case 2: // Tax & Status
        // GSTIN (optional)
        if (formData.gstin) {
          const gstError = validateField('gstin', formData.gstin);
          if (gstError) {
            errors.gstin = gstError;
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

    // Vendor Code
    if (!formData.vendor_code?.trim()) {
      errors.vendor_code = 'Vendor code is required';
      isValid = false;
    }

    // Vendor Name
    if (!formData.vendor_name?.trim()) {
      errors.vendor_name = 'Vendor name is required';
      isValid = false;
    }

    // Vendor Type
    if (!formData.vendor_type) {
      errors.vendor_type = 'Vendor type is required';
      isValid = false;
    }

    // Contact Person
    if (!formData.contact_person?.trim()) {
      errors.contact_person = 'Contact person is required';
      isValid = false;
    }

    // Phone
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) {
        errors.phone = phoneError;
        isValid = false;
      }
    }

    // Email (optional)
    if (formData.email) {
      const emailError = validateField('email', formData.email);
      if (emailError) {
        errors.email = emailError;
        isValid = false;
      }
    }

    // GSTIN (optional)
    if (formData.gstin) {
      const gstError = validateField('gstin', formData.gstin);
      if (gstError) {
        errors.gstin = gstError;
        isValid = false;
      }
    }

    // State Code (optional)
    if (formData.state_code) {
      const stateCodeError = validateField('state_code', formData.state_code);
      if (stateCodeError) {
        errors.state_code = stateCodeError;
        isValid = false;
      }
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
      
      // Clean phone number before sending
      const cleanPhone = formData.phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
      
      const submissionData = {
        vendor_code: formData.vendor_code,
        vendor_name: formData.vendor_name,
        vendor_type: formData.vendor_type,
        address: formData.address || '',
        gstin: formData.gstin || '',
        state: formData.state || '',
        state_code: formData.state_code ? parseInt(formData.state_code) : null,
        contact_person: formData.contact_person,
        phone: cleanPhone,
        email: formData.email || '',
        is_active: formData.is_active
      };

      const response = await axios.post(`${BASE_URL}/api/vendors`, submissionData, {
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
        setError(response.data.message || 'Failed to add vendor');
      }
    } catch (err) {
      console.error('Error adding vendor:', err);
      setError(err.response?.data?.message || 'Failed to add vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vendor_code: '',
      vendor_name: '',
      vendor_type: 'Both',
      address: '',
      gstin: '',
      state: '',
      state_code: '',
      contact_person: '',
      phone: '',
      email: '',
      is_active: true
    });
    setFieldErrors({});
    setError('');
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
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Vendor Code *"
                    name="vendor_code"
                    value={formData.vendor_code}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., VEN001"
                    error={!!fieldErrors.vendor_code}
                    helperText={fieldErrors.vendor_code}
                    inputProps={{ maxLength: 20 }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Vendor Name *"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., ABC Enterprises"
                    error={!!fieldErrors.vendor_name}
                    helperText={fieldErrors.vendor_name}
                    inputProps={{ maxLength: 100 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small" required error={!!fieldErrors.vendor_type}>
                    <InputLabel>Vendor Type *</InputLabel>
                    <Select
                      name="vendor_type"
                      value={formData.vendor_type}
                      onChange={handleSelectChange}
                      label="Vendor Type *"
                      required
                      disabled={loading}
                      sx={{ borderRadius: 1 }}
                    >
                      {vendorTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.vendor_type && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {fieldErrors.vendor_type}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1: // Contact & Address
        return (
          <Stack spacing={2}>
            {/* Contact Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Contact Person *"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., John Doe"
                    error={!!fieldErrors.contact_person}
                    helperText={fieldErrors.contact_person}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., 9876543210"
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone || '10-digit mobile number starting with 6-9'}
                    inputProps={{ maxLength: 15 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    disabled={loading}
                    placeholder="vendor@gmail.com"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Address Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Address Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    disabled={loading}
                    placeholder="Street address, city, pincode"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Maharashtra"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="State Code"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 27"
                    error={!!fieldErrors.state_code}
                    helperText={fieldErrors.state_code || 'Between 1-99'}
                    inputProps={{ 
                      min: 1, 
                      max: 99,
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
          </Stack>
        );
      
      case 2: // Tax & Status
        return (
          <Stack spacing={2}>
            {/* Tax Information */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Tax Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GSTIN"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 27AAACM1234A1Z5"
                    error={!!fieldErrors.gstin}
                    helperText={fieldErrors.gstin || '15 characters: 2 digits + 10 PAN + 3 chars'}
                    inputProps={{ 
                      maxLength: 15,
                      style: { textTransform: 'uppercase' }
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Status Section */}
            {/* <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Vendor Status
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Active Vendor"
                  />
                </Grid>
              </Grid>
            </Paper> */}
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
          Add New Vendor
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
              {loading ? 'Adding...' : 'Add Vendor'}
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

export default AddVendor;