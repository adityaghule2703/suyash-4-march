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
  Chip,
  styled
} from '@mui/material';
import { 
  Edit as EditIcon, 
  CloudUpload as CloudUploadIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching Users component
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

// Modern Stepper Connector with Primary Color
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

const steps = ['Company Information', 'Bank & Contact Details'];

// Validation helper functions
const validateGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s\-]/g, ''));
};

const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifsc ? ifscRegex.test(ifsc) : true;
};

const EditCompanies = ({ open, onClose, company, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    company_id: '',
    company_name: '',
    address: '',
    gstin: '',
    pan: '',
    state: '',
    state_code: '',
    phone: '',
    email: '',
    bank_details: {
      bank_name: '',
      account_no: '',
      ifsc: '',
      branch: ''
    },
    is_active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (company) {
      setFormData({
        company_id: company.company_id || '',
        company_name: company.company_name || '',
        address: company.address || '',
        gstin: company.gstin || '',
        pan: company.pan || '',
        state: company.state || '',
        state_code: company.state_code || '',
        phone: company.phone || '',
        email: company.email || '',
        bank_details: {
          bank_name: company.bank_details?.bank_name || '',
          account_no: company.bank_details?.account_no || '',
          ifsc: company.bank_details?.ifsc || '',
          branch: company.bank_details?.branch || ''
        },
        is_active: company.is_active !== undefined ? company.is_active : true
      });
      
      if (company.logo_path) {
        setLogoPreview(`${BASE_URL}/${company.logo_path}`);
      }
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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
    
    if (name === 'bank_name' || name === 'account_no' || name === 'ifsc' || name === 'branch') {
      const processedValue = name === 'ifsc' ? value.toUpperCase() : value;
      
      setFormData(prev => ({
        ...prev,
        bank_details: {
          ...prev.bank_details,
          [name]: processedValue
        }
      }));
    } else {
      let processedValue = value;
      if (name === 'gstin' || name === 'pan') {
        processedValue = value.toUpperCase();
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 2 * 1024 * 1024;
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }
      
      if (file.size > maxSize) {
        setError('Logo size should be less than 2MB');
        return;
      }
      
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setError('');
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'gstin':
        if (value && !validateGST(value)) {
          return 'Please enter a valid GSTIN (e.g., 27AAPFU0939F1Z5)';
        }
        break;
      case 'pan':
        if (value && !validatePAN(value)) {
          return 'Please enter a valid PAN (e.g., ABCDE1234F)';
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid Indian mobile number';
        }
        break;
      case 'state_code':
        if (value && (value < 1 || value > 99)) {
          return 'State code must be between 1 and 99';
        }
        break;
      case 'ifsc':
        if (value && !validateIFSC(value)) {
          return 'Please enter a valid IFSC code (e.g., SBIN0123456)';
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
      case 0:
        if (!formData.company_id?.trim()) {
          errors.company_id = 'Company ID is required';
          isValid = false;
        } else if (formData.company_id.length > 20) {
          errors.company_id = 'Company ID should not exceed 20 characters';
          isValid = false;
        }

        if (!formData.company_name?.trim()) {
          errors.company_name = 'Company name is required';
          isValid = false;
        } else if (formData.company_name.length > 100) {
          errors.company_name = 'Company name should not exceed 100 characters';
          isValid = false;
        }

        if (!formData.address?.trim()) {
          errors.address = 'Address is required';
          isValid = false;
        }

        if (!formData.gstin?.trim()) {
          errors.gstin = 'GSTIN is required';
          isValid = false;
        } else {
          const gstError = validateField('gstin', formData.gstin);
          if (gstError) {
            errors.gstin = gstError;
            isValid = false;
          }
        }

        if (!formData.pan?.trim()) {
          errors.pan = 'PAN is required';
          isValid = false;
        } else {
          const panError = validateField('pan', formData.pan);
          if (panError) {
            errors.pan = panError;
            isValid = false;
          }
        }

        if (!formData.state?.trim()) {
          errors.state = 'State is required';
          isValid = false;
        }

        if (!formData.state_code?.toString().trim()) {
          errors.state_code = 'State code is required';
          isValid = false;
        } else {
          const stateCodeError = validateField('state_code', Number(formData.state_code));
          if (stateCodeError) {
            errors.state_code = stateCodeError;
            isValid = false;
          }
        }
        break;
      
      case 1:
        if (!formData.email?.trim()) {
          errors.email = 'Email is required';
          isValid = false;
        } else {
          const emailError = validateField('email', formData.email);
          if (emailError) {
            errors.email = emailError;
            isValid = false;
          }
        }

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

        if (formData.bank_details.ifsc) {
          const ifscError = validateField('ifsc', formData.bank_details.ifsc);
          if (ifscError) {
            errors.ifsc = ifscError;
            isValid = false;
          }
        }

        if (formData.bank_details.account_no && !/^\d{9,18}$/.test(formData.bank_details.account_no)) {
          errors.account_no = 'Account number should be 9-18 digits';
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

    if (!formData.company_id?.trim()) {
      errors.company_id = 'Company ID is required';
      isValid = false;
    }

    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
      isValid = false;
    }

    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.gstin?.trim()) {
      errors.gstin = 'GSTIN is required';
      isValid = false;
    } else {
      const gstError = validateField('gstin', formData.gstin);
      if (gstError) {
        errors.gstin = gstError;
        isValid = false;
      }
    }

    if (!formData.pan?.trim()) {
      errors.pan = 'PAN is required';
      isValid = false;
    } else {
      const panError = validateField('pan', formData.pan);
      if (panError) {
        errors.pan = panError;
        isValid = false;
      }
    }

    if (!formData.state?.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }

    if (!formData.state_code?.toString().trim()) {
      errors.state_code = 'State code is required';
      isValid = false;
    } else {
      const stateCodeError = validateField('state_code', Number(formData.state_code));
      if (stateCodeError) {
        errors.state_code = stateCodeError;
        isValid = false;
      }
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else {
      const emailError = validateField('email', formData.email);
      if (emailError) {
        errors.email = emailError;
        isValid = false;
      }
    }

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

      const dataToSend = {
        company_id: formData.company_id,
        company_name: formData.company_name,
        address: formData.address,
        gstin: formData.gstin,
        pan: formData.pan,
        state: formData.state,
        state_code: Number(formData.state_code),
        phone: formData.phone,
        email: formData.email,
        is_active: formData.is_active,
        bank_details: {
          bank_name: formData.bank_details.bank_name || '',
          account_no: formData.bank_details.account_no || '',
          ifsc: formData.bank_details.ifsc ? formData.bank_details.ifsc.toUpperCase() : '',
          branch: formData.bank_details.branch || ''
        }
      };

      if (logoFile) {
        const formDataWithLogo = new FormData();
        
        Object.keys(dataToSend).forEach(key => {
          if (key === 'bank_details') {
            formDataWithLogo.append(key, JSON.stringify(dataToSend[key]));
          } else {
            formDataWithLogo.append(key, dataToSend[key]);
          }
        });
        
        formDataWithLogo.append('logo', logoFile);

        const response = await axios.put(`${BASE_URL}/api/company/${company._id}`, formDataWithLogo, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data) {
          onUpdate(response.data.data || response.data);
          resetForm();
          onClose();
        }
      } else {
        const response = await axios.put(`${BASE_URL}/api/company/${company._id}`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          onUpdate(response.data.data || response.data);
          resetForm();
          onClose();
        }
      }
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.response?.data?.message || 'Failed to update company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      company_name: '',
      address: '',
      gstin: '',
      pan: '',
      state: '',
      state_code: '',
      phone: '',
      email: '',
      bank_details: {
        bank_name: '',
        account_no: '',
        ifsc: '',
        branch: ''
      },
      is_active: true
    });
    setFieldErrors({});
    setLogoFile(null);
    setLogoPreview('');
    setActiveStep(0);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Logo Upload Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Company Logo
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon sx={{ fontSize: '1rem' }} />}
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
                      Upload New Logo (Max 2MB)
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleLogoChange}
                      />
                    </Button>
                    {logoPreview && (
                      <Box
                        component="img"
                        src={logoPreview}
                        alt="Logo preview"
                        sx={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 1 }}
                      />
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 1 }}>
                    Supported formats: JPEG, PNG, GIF, WEBP (Max 2MB)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Company Information Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Company Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COMPANY ID <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="company_id"
                      value={formData.company_id}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., COMP001"
                      error={!!fieldErrors.company_id}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                    {fieldErrors.company_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.company_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COMPANY NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Tech Solutions Ltd"
                      error={!!fieldErrors.company_name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                    {fieldErrors.company_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.company_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      disabled={loading}
                      placeholder="Enter complete address"
                      error={!!fieldErrors.address}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                    {fieldErrors.address && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GSTIN <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 27AAPFU0939F1Z5"
                      error={!!fieldErrors.gstin}
                      inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      15 characters: 2 digits + 10 PAN + 3 chars
                    </Typography>
                    {fieldErrors.gstin && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.gstin}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAN <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., ABCDE1234F"
                      error={!!fieldErrors.pan}
                      inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      10 characters: 5 letters + 4 numbers + 1 letter
                    </Typography>
                    {fieldErrors.pan && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.pan}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Maharashtra"
                      error={!!fieldErrors.state}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                    {fieldErrors.state && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.state}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="state_code"
                      value={formData.state_code}
                      onChange={handleChange}
                      type="number"
                      disabled={loading}
                      placeholder="e.g., 27"
                      error={!!fieldErrors.state_code}
                      inputProps={{ min: 1, max: 99 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Between 1 and 99
                    </Typography>
                    {fieldErrors.state_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.state_code}
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
            {/* Contact Details Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Contact Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMAIL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="company@example.com"
                      error={!!fieldErrors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                    {fieldErrors.email && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.email}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PHONE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 9876543210 or +91 9876543210"
                      error={!!fieldErrors.phone}
                      inputProps={{ maxLength: 15 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      Indian mobile number with/without +91
                    </Typography>
                    {fieldErrors.phone && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.phone}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Details Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Bank Details (Optional)
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BANK NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bank_name"
                      value={formData.bank_details.bank_name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., State Bank of India"
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BRANCH
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="branch"
                      value={formData.bank_details.branch}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Andheri East"
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ACCOUNT NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="account_no"
                      value={formData.bank_details.account_no}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 123456789012"
                      error={!!fieldErrors.account_no}
                      inputProps={{ maxLength: 18 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        }
                      }}
                    />
                    {fieldErrors.account_no && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.account_no}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      IFSC CODE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="ifsc"
                      value={formData.bank_details.ifsc}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., SBIN0123456"
                      error={!!fieldErrors.ifsc}
                      inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      4 letters + 0 + 6 alphanumeric
                    </Typography>
                    {fieldErrors.ifsc && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ifsc}
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Company
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {company?._id && (
            <Chip
              label={`ID: ${company._id.slice(-6)}`}
              size="small"
              sx={{ 
                fontSize: '0.65rem',
                fontWeight: 500,
                height: 20,
                bgcolor: COLORS.background.light,
                color: COLORS.text.secondary,
                border: `1px solid ${COLORS.border}`,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          )}
          <Chip
            label={formData.is_active ? 'Active' : 'Inactive'}
            size="small"
            sx={{ 
              fontSize: '0.65rem',
              fontWeight: 500,
              height: 20,
              bgcolor: formData.is_active ? COLORS.chips.active : COLORS.chips.inactive,
              color: formData.is_active ? COLORS.primaryDark : COLORS.text.secondary,
              border: `1px solid ${formData.is_active ? '#86efac' : COLORS.border}`,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        </Box>
      </DialogTitle>

      {/* Modern Stepper with Primary Color */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
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
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5,
              '& .MuiAlert-icon': { fontSize: '1.25rem' }
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
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
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
            size="small"
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
              size="small"
              startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Updating...' : 'Update Company'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="small"
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

export default EditCompanies;