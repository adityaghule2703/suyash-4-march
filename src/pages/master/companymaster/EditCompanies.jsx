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

const steps = ['Company Information', 'Bank & Contact Details'];

// Validation helper functions
const validateGST = (gst) => {
  // GST format: 15 characters - 2 digits state code + 10 PAN + 1 entity number + 1 check digit + 1 alphabet
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

const validatePAN = (pan) => {
  // PAN format: 5 letters + 4 numbers + 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  // Phone: 10 digits, optional +91 prefix, optional spaces/hyphens
  const phoneRegex = /^(\+91[\-\s]?)?[0]?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s\-]/g, ''));
};

const validateIFSC = (ifsc) => {
  // IFSC: 4 letters + 0 + 6 alphanumeric
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifsc ? ifscRegex.test(ifsc) : true; // Optional field
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
      
      // Set logo preview if exists
      if (company.logo_path) {
        setLogoPreview(`${BASE_URL}/${company.logo_path}`);
      }
    }
  }, [company]);

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
    
    // Handle nested bank_details fields
    if (name === 'bank_name' || name === 'account_no' || name === 'ifsc' || name === 'branch') {
      // Convert to uppercase for IFSC
      const processedValue = name === 'ifsc' ? value.toUpperCase() : value;
      
      setFormData(prev => ({
        ...prev,
        bank_details: {
          ...prev.bank_details,
          [name]: processedValue
        }
      }));
    } else {
      // Convert GSTIN and PAN to uppercase
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
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
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
      case 0: // Company Information
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
      
      case 1: // Bank & Contact Details
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

        // Validate IFSC if provided
        if (formData.bank_details.ifsc) {
          const ifscError = validateField('ifsc', formData.bank_details.ifsc);
          if (ifscError) {
            errors.ifsc = ifscError;
            isValid = false;
          }
        }

        // Validate account number if provided
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

    // Company Information validation
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

      // If there's a new logo file, use FormData
      if (logoFile) {
        const formDataWithLogo = new FormData();
        
        // Append all fields
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
        // No new logo, send as JSON
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
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Company Logo
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={loading}
                      sx={{ height: '40px', borderRadius: 1 }}
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
                        sx={{ height: 40, width: 40, objectFit: 'contain' }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    Supported formats: JPEG, PNG, GIF, WEBP (Max 2MB)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Company Information Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Company Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Company ID *"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., COMP001"
                    error={!!fieldErrors.company_id}
                    helperText={fieldErrors.company_id}
                    inputProps={{ maxLength: 20 }}
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Company Name *"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={!!fieldErrors.company_name}
                    helperText={fieldErrors.company_name}
                    inputProps={{ maxLength: 100 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Address *"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    multiline
                    rows={2}
                    disabled={loading}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GSTIN *"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., 27AAPFU0939F1Z5"
                    error={!!fieldErrors.gstin}
                    helperText={fieldErrors.gstin || '15 characters: 2 digits + 10 PAN + 3 chars'}
                    inputProps={{ maxLength: 15, style: { textTransform: 'uppercase' } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="PAN *"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., ABCDE1234F"
                    error={!!fieldErrors.pan}
                    helperText={fieldErrors.pan || '10 characters: 5 letters + 4 numbers + 1 letter'}
                    inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="State *"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={!!fieldErrors.state}
                    helperText={fieldErrors.state}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="State Code *"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleChange}
                    required
                    type="number"
                    disabled={loading}
                    error={!!fieldErrors.state_code}
                    helperText={fieldErrors.state_code || 'Between 1 and 99'}
                    inputProps={{ 
                      min: 1, 
                      max: 99,
                      step: 1,
                      onWheel: (e) => e.target.blur() // Prevent scroll from changing value
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
      
      case 1:
        return (
          <Stack spacing={2}>
            {/* Contact Details Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Contact Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="company@example.com"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g., 9876543210 or +91 9876543210"
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone || 'Indian mobile number with/without +91'}
                    inputProps={{ maxLength: 15 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Bank Details Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Bank Details (Optional)
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Bank Name"
                    name="bank_name"
                    value={formData.bank_details.bank_name}
                    onChange={handleChange}
                    disabled={loading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Branch"
                    name="branch"
                    value={formData.bank_details.branch}
                    onChange={handleChange}
                    disabled={loading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Account Number"
                    name="account_no"
                    value={formData.bank_details.account_no}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.account_no}
                    helperText={fieldErrors.account_no || '9-18 digits'}
                    inputProps={{ 
                      maxLength: 18,
                      pattern: '[0-9]*',
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="IFSC Code"
                    name="ifsc"
                    value={formData.bank_details.ifsc}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., SBIN0123456"
                    error={!!fieldErrors.ifsc}
                    helperText={fieldErrors.ifsc || '4 letters + 0 + 6 alphanumeric'}
                    inputProps={{ 
                      maxLength: 11,
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
                Company Status
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
                    label="Active Company"
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
          Edit Company
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
              {loading ? 'Updating...' : 'Update Company'}
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

export default EditCompanies;