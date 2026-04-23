import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, CUSTOMER_TYPE_OPTIONS, INDUSTRY_SEGMENT_OPTIONS, PRIORITY_OPTIONS, PAYMENT_TERMS_OPTIONS, CURRENCY_OPTIONS } from './constants';

const AddCustomer = ({ open, onClose, onAdd }) => {
  const [customerType, setCustomerType] = useState('full');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Common form data for Full OEM type
  const [formData, setFormData] = useState({
    customer_code: '',
    customer_name: '',
    customer_type: 'OEM',
    industry_segment: '',
    priority: 'Regular',
    gstin: '',
    pan: '',
    tan: '',
    msme_number: '',
    is_sez: false,
    is_export: false,
    credit_limit: '',
    credit_days: '',
    payment_terms: 'Net 30',
    currency: 'INR',
    billing_address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: '',
      pincode: '',
      country: 'India'
    },
    bank_details: {
      bank_name: '',
      account_no: '',
      ifsc: '',
      branch: '',
      account_name: ''
    }
  });

  const [contacts, setContacts] = useState([
    {
      name: '',
      designation: '',
      department: '',
      phone: '',
      mobile: '',
      email: '',
      is_primary: true
    }
  ]);

  // Minimal form data - using same structure as full form
  const [minimalFormData, setMinimalFormData] = useState({
    customer_code: '',
    customer_name: '',
    customer_type: 'Direct',
    billing_address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: '',
      pincode: '',
      country: 'India'
    }
  });

  // Export form data - using same structure as full form
  const [exportFormData, setExportFormData] = useState({
    customer_code: '',
    customer_name: '',
    customer_type: 'Export',
    is_export: true,
    currency: 'USD',
    billing_address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: '',
      pincode: '',
      country: ''
    }
  });

  // Validation functions
  const validateGSTIN = (gstin) => {
    if (!gstin) return true;
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validatePAN = (pan) => {
    if (!pan) return true;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(cleanPhone);
  };

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    setError('');
    setActiveStep(0);
    setFieldErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCustomerType('full');
    setActiveStep(0);
    setFormData({
      customer_code: '',
      customer_name: '',
      customer_type: 'OEM',
      industry_segment: '',
      priority: 'Regular',
      gstin: '',
      pan: '',
      tan: '',
      msme_number: '',
      is_sez: false,
      is_export: false,
      credit_limit: '',
      credit_days: '',
      payment_terms: 'Net 30',
      currency: 'INR',
      billing_address: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: '',
        pincode: '',
        country: 'India'
      },
      bank_details: {
        bank_name: '',
        account_no: '',
        ifsc: '',
        branch: '',
        account_name: ''
      }
    });
    setContacts([{
      name: '',
      designation: '',
      department: '',
      phone: '',
      mobile: '',
      email: '',
      is_primary: true
    }]);
    setMinimalFormData({
      customer_code: '',
      customer_name: '',
      customer_type: 'Direct',
      billing_address: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: '',
        pincode: '',
        country: 'India'
      }
    });
    setExportFormData({
      customer_code: '',
      customer_name: '',
      customer_type: 'Export',
      is_export: true,
      currency: 'USD',
      billing_address: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: '',
        pincode: '',
        country: ''
      }
    });
    setFieldErrors({});
    setError('');
  };

  // Full OEM form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value
      }
    }));
    setFieldErrors(prev => ({ ...prev, [`address_${field}`]: '' }));
  };

  const handleBankChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [field]: value
      }
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
    setFieldErrors(prev => ({ ...prev, [`contact_${index}_${field}`]: '' }));
  };

  const addContact = () => {
    setContacts([...contacts, {
      name: '',
      designation: '',
      department: '',
      phone: '',
      mobile: '',
      email: '',
      is_primary: false
    }]);
  };

  const removeContact = (index) => {
    if (contacts.length > 1) {
      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);
    }
  };

  const handlePrimaryContactChange = (index) => {
    const updatedContacts = contacts.map((contact, i) => ({
      ...contact,
      is_primary: i === index
    }));
    setContacts(updatedContacts);
  };

  // Minimal form handlers - using same structure as full form
  const handleMinimalChange = (e) => {
    const { name, value } = e.target;
    setMinimalFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMinimalAddressChange = (field, value) => {
    setMinimalFormData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value
      }
    }));
    setFieldErrors(prev => ({ ...prev, [`address_${field}`]: '' }));
  };

  // Export form handlers - using same structure as full form
  const handleExportChange = (e) => {
    const { name, value } = e.target;
    setExportFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleExportAddressChange = (field, value) => {
    setExportFormData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value
      }
    }));
    setFieldErrors(prev => ({ ...prev, [`address_${field}`]: '' }));
  };

  // Validation for Full form
  const validateFullStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.customer_code.trim()) {
          errors.customer_code = 'Customer code is required';
          isValid = false;
        }
        if (!formData.customer_name.trim()) {
          errors.customer_name = 'Customer name is required';
          isValid = false;
        }
        if (!formData.customer_type) {
          errors.customer_type = 'Customer type is required';
          isValid = false;
        }
        if (formData.gstin && !validateGSTIN(formData.gstin)) {
          errors.gstin = 'Please enter a valid GSTIN';
          isValid = false;
        }
        if (formData.pan && !validatePAN(formData.pan)) {
          errors.pan = 'Please enter a valid PAN';
          isValid = false;
        }
        break;
      
      case 1: // Address & Contact
        if (!formData.billing_address.line1.trim()) {
          errors.address_line1 = 'Address line 1 is required';
          isValid = false;
        }
        if (!formData.billing_address.city.trim()) {
          errors.address_city = 'City is required';
          isValid = false;
        }
        if (!formData.billing_address.state.trim()) {
          errors.address_state = 'State is required';
          isValid = false;
        }
        if (!formData.billing_address.state_code) {
          errors.address_state_code = 'State code is required';
          isValid = false;
        }
        if (!formData.billing_address.pincode.trim()) {
          errors.address_pincode = 'Pincode is required';
          isValid = false;
        }
        
        for (let i = 0; i < contacts.length; i++) {
          if (!contacts[i].name.trim()) {
            errors[`contact_${i}_name`] = `Contact ${i + 1}: Name is required`;
            isValid = false;
          }
          if (contacts[i].email && !validateEmail(contacts[i].email)) {
            errors[`contact_${i}_email`] = `Contact ${i + 1}: Invalid email`;
            isValid = false;
          }
          if (contacts[i].mobile && !validatePhone(contacts[i].mobile)) {
            errors[`contact_${i}_mobile`] = `Contact ${i + 1}: Invalid mobile number`;
            isValid = false;
          }
        }
        
        if (!contacts.some(c => c.is_primary)) {
          errors.primary_contact = 'At least one primary contact is required';
          isValid = false;
        }
        break;
      
      case 2: // Financial & Bank
        if (formData.credit_limit && isNaN(formData.credit_limit)) {
          errors.credit_limit = 'Credit limit must be a number';
          isValid = false;
        }
        if (formData.credit_days && isNaN(formData.credit_days)) {
          errors.credit_days = 'Credit days must be a number';
          isValid = false;
        }
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const validateFullForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.customer_code.trim()) {
      errors.customer_code = 'Customer code is required';
      isValid = false;
    }
    if (!formData.customer_name.trim()) {
      errors.customer_name = 'Customer name is required';
      isValid = false;
    }
    if (!formData.customer_type) {
      errors.customer_type = 'Customer type is required';
      isValid = false;
    }
    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      errors.gstin = 'Please enter a valid GSTIN';
      isValid = false;
    }
    if (formData.pan && !validatePAN(formData.pan)) {
      errors.pan = 'Please enter a valid PAN';
      isValid = false;
    }
    
    if (!formData.billing_address.line1.trim()) {
      errors.address_line1 = 'Address line 1 is required';
      isValid = false;
    }
    if (!formData.billing_address.city.trim()) {
      errors.address_city = 'City is required';
      isValid = false;
    }
    if (!formData.billing_address.state.trim()) {
      errors.address_state = 'State is required';
      isValid = false;
    }
    if (!formData.billing_address.state_code) {
      errors.address_state_code = 'State code is required';
      isValid = false;
    }
    if (!formData.billing_address.pincode.trim()) {
      errors.address_pincode = 'Pincode is required';
      isValid = false;
    }
    
    for (let i = 0; i < contacts.length; i++) {
      if (!contacts[i].name.trim()) {
        errors[`contact_${i}_name`] = `Contact ${i + 1}: Name is required`;
        isValid = false;
      }
      if (contacts[i].email && !validateEmail(contacts[i].email)) {
        errors[`contact_${i}_email`] = `Contact ${i + 1}: Invalid email`;
        isValid = false;
      }
      if (contacts[i].mobile && !validatePhone(contacts[i].mobile)) {
        errors[`contact_${i}_mobile`] = `Contact ${i + 1}: Invalid mobile number`;
        isValid = false;
      }
    }
    
    if (!contacts.some(c => c.is_primary)) {
      errors.primary_contact = 'At least one primary contact is required';
      isValid = false;
    }
    
    if (formData.credit_limit && isNaN(formData.credit_limit)) {
      errors.credit_limit = 'Credit limit must be a number';
      isValid = false;
    }
    if (formData.credit_days && isNaN(formData.credit_days)) {
      errors.credit_days = 'Credit days must be a number';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const validateMinimalForm = () => {
    const errors = {};
    let isValid = true;

    if (!minimalFormData.customer_code.trim()) {
      errors.customer_code = 'Customer code is required';
      isValid = false;
    }
    if (!minimalFormData.customer_name.trim()) {
      errors.customer_name = 'Customer name is required';
      isValid = false;
    }
    if (!minimalFormData.customer_type) {
      errors.customer_type = 'Customer type is required';
      isValid = false;
    }
    if (!minimalFormData.billing_address.line1.trim()) {
      errors.address_line1 = 'Address line 1 is required';
      isValid = false;
    }
    if (!minimalFormData.billing_address.city.trim()) {
      errors.address_city = 'City is required';
      isValid = false;
    }
    if (!minimalFormData.billing_address.state.trim()) {
      errors.address_state = 'State is required';
      isValid = false;
    }
    if (!minimalFormData.billing_address.state_code) {
      errors.address_state_code = 'State code is required';
      isValid = false;
    }
    if (!minimalFormData.billing_address.pincode.trim()) {
      errors.address_pincode = 'Pincode is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill all required fields');
    }
    return isValid;
  };

  const validateExportForm = () => {
    const errors = {};
    let isValid = true;

    if (!exportFormData.customer_code.trim()) {
      errors.customer_code = 'Customer code is required';
      isValid = false;
    }
    if (!exportFormData.customer_name.trim()) {
      errors.customer_name = 'Customer name is required';
      isValid = false;
    }
    if (!exportFormData.billing_address.line1.trim()) {
      errors.address_line1 = 'Address line 1 is required';
      isValid = false;
    }
    if (!exportFormData.billing_address.city.trim()) {
      errors.address_city = 'City is required';
      isValid = false;
    }
    if (!exportFormData.billing_address.state.trim()) {
      errors.address_state = 'State is required';
      isValid = false;
    }
    if (!exportFormData.billing_address.state_code) {
      errors.address_state_code = 'State code is required';
      isValid = false;
    }
    if (!exportFormData.billing_address.pincode.trim()) {
      errors.address_pincode = 'Pincode is required';
      isValid = false;
    }
    if (!exportFormData.billing_address.country.trim()) {
      errors.address_country = 'Country is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill all required fields');
    }
    return isValid;
  };

  const handleFullNext = () => {
    if (validateFullStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleFullBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFullSubmit = async () => {
    if (!validateFullForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        ...formData,
        credit_limit: formData.credit_limit ? Number(formData.credit_limit) : undefined,
        credit_days: formData.credit_days ? Number(formData.credit_days) : undefined,
        contacts: contacts,
        billing_address: formData.billing_address
      };

      const response = await axios.post(`${BASE_URL}/api/customers`, requestData, {
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
        setError(response.data.message || 'Failed to add customer');
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err.response?.data?.message || 'Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMinimalSubmit = async () => {
    if (!validateMinimalForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${BASE_URL}/api/customers`, minimalFormData, {
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
        setError(response.data.message || 'Failed to add customer');
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err.response?.data?.message || 'Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSubmit = async () => {
    if (!validateExportForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${BASE_URL}/api/customers`, exportFormData, {
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
        setError(response.data.message || 'Failed to add customer');
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err.response?.data?.message || 'Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Full OEM Form Render
  const renderFullForm = () => {
    const steps = ['Basic Info', 'Address & Contacts', 'Financial & Bank'];

    return (
      <>
        <Box sx={{ px: 2.5, pt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
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

        <DialogContent sx={{ p: 2.5 }}>
          {activeStep === 0 && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Basic Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Customer Code <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="customer_code"
                        value={formData.customer_code}
                        onChange={handleChange}
                        placeholder="e.g., SIEMENS001"
                        error={!!fieldErrors.customer_code}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.customer_code && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.customer_code}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Customer Name <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="e.g., Siemens India Ltd"
                        error={!!fieldErrors.customer_name}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.customer_name && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.customer_name}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Customer Type <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small" error={!!fieldErrors.customer_type}>
                        <Select
                          value={formData.customer_type}
                          onChange={handleChange}
                          name="customer_type"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '& .MuiSelect-select': { py: 1, px: 1.5 }
                          }}
                        >
                          {CUSTOMER_TYPE_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Industry Segment
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.industry_segment}
                          onChange={handleChange}
                          name="industry_segment"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '& .MuiSelect-select': { py: 1, px: 1.5 }
                          }}
                        >
                          {INDUSTRY_SEGMENT_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option || 'None'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Priority
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.priority}
                          onChange={handleChange}
                          name="priority"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '& .MuiSelect-select': { py: 1, px: 1.5 }
                          }}
                        >
                          {PRIORITY_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option || 'Regular'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        GSTIN
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        placeholder="27AAECS7112G1Z5"
                        error={!!fieldErrors.gstin}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.gstin && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.gstin}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        PAN
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        placeholder="AAECS7112G"
                        error={!!fieldErrors.pan}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.pan && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.pan}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                </Grid>
              </Paper>
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Billing Address <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Address Line 1 <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.line1}
                        onChange={(e) => handleAddressChange('line1', e.target.value)}
                        placeholder="e.g., Kalwa Works, Thane"
                        error={!!fieldErrors.address_line1}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.address_line1 && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.address_line1}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Address Line 2
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.line2}
                        onChange={(e) => handleAddressChange('line2', e.target.value)}
                        placeholder="e.g., Near Railway Station"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        City <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="e.g., Thane"
                        error={!!fieldErrors.address_city}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.address_city && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.address_city}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        District
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.district}
                        onChange={(e) => handleAddressChange('district', e.target.value)}
                        placeholder="e.g., Thane"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        State <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="e.g., Maharashtra"
                        error={!!fieldErrors.address_state}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.address_state && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.address_state}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        State Code <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.state_code}
                        onChange={(e) => handleAddressChange('state_code', e.target.value)}
                        placeholder="e.g., 27"
                        error={!!fieldErrors.address_state_code}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.address_state_code && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.address_state_code}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Pincode <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.pincode}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                        placeholder="e.g., 400605"
                        error={!!fieldErrors.address_pincode}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                      {fieldErrors.address_pincode && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.address_pincode}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Country
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.billing_address.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        placeholder="e.g., India"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Contact Persons <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                {contacts.map((contact, index) => (
                  <Paper key={index} sx={{ p: 1.5, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Contact {index + 1}
                      </Typography>
                      <Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={contact.is_primary}
                              onChange={() => handlePrimaryContactChange(index)}
                              size="small"
                            />
                          }
                          label={<Typography sx={{ fontSize: '0.7rem' }}>Primary</Typography>}
                        />
                        {contacts.length > 1 && (
                          <IconButton size="small" onClick={() => removeContact(index)} sx={{ color: '#EF4444' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Stack>
                    
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Name <span style={{ color: '#EF4444' }}>*</span>
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={contact.name}
                            onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                            placeholder="e.g., Rajesh Sharma"
                            error={!!fieldErrors[`contact_${index}_name`]}
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Designation
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={contact.designation}
                            onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                            placeholder="e.g., Purchase Manager"
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Email
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            type="email"
                            value={contact.email}
                            onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                            placeholder="rajesh@company.com"
                            error={!!fieldErrors[`contact_${index}_email`]}
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Mobile
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={contact.mobile}
                            onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                            placeholder="9876543210"
                            error={!!fieldErrors[`contact_${index}_mobile`]}
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Phone
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={contact.phone}
                            onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                            placeholder="022-12345678"
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Department
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={contact.department}
                            onChange={(e) => handleContactChange(index, 'department', e.target.value)}
                            placeholder="e.g., Procurement"
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                
                <Button
                  variant="outlined"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={addContact}
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
                  Add Contact
                </Button>
                
                {fieldErrors.primary_contact && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                    {fieldErrors.primary_contact}
                  </Typography>
                )}
              </Paper>
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <CreditCardIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Financial Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Credit Limit
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="credit_limit"
                        type="number"
                        value={formData.credit_limit}
                        onChange={handleChange}
                        placeholder="1000000"
                        error={!!fieldErrors.credit_limit}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Credit Days
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="credit_days"
                        type="number"
                        value={formData.credit_days}
                        onChange={handleChange}
                        placeholder="60"
                        error={!!fieldErrors.credit_days}
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Payment Terms
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.payment_terms}
                          onChange={handleChange}
                          name="payment_terms"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '& .MuiSelect-select': { py: 1, px: 1.5 }
                          }}
                        >
                          {PAYMENT_TERMS_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Currency
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.currency}
                          onChange={handleChange}
                          name="currency"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            '& .MuiSelect-select': { py: 1, px: 1.5 }
                          }}
                        >
                          {CURRENCY_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <AccountBalanceIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Bank Details
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Bank Name
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.bank_details.bank_name}
                        onChange={(e) => handleBankChange('bank_name', e.target.value)}
                        placeholder="e.g., HDFC Bank"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Account Name
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.bank_details.account_name}
                        onChange={(e) => handleBankChange('account_name', e.target.value)}
                        placeholder="e.g., Siemens India Ltd"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Account Number
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.bank_details.account_no}
                        onChange={(e) => handleBankChange('account_no', e.target.value)}
                        placeholder="e.g., 1234567890"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        IFSC Code
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.bank_details.ifsc}
                        onChange={(e) => handleBankChange('ifsc', e.target.value)}
                        placeholder="e.g., HDFC0001234"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Branch
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.bank_details.branch}
                        onChange={(e) => handleBankChange('branch', e.target.value)}
                        placeholder="e.g., Thane Branch"
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
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, justifyContent: 'space-between' }}>
          <Button
            onClick={handleFullBack}
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
              }
            }}
          >
            Back
          </Button>
          <Box>
            <Button
              onClick={handleClose}
              disabled={loading}
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
            {activeStep === 2 ? (
              <Button
                variant="contained"
                onClick={handleFullSubmit}
                disabled={loading}
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? 'Adding...' : 'Add Customer'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleFullNext}
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
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      </>
    );
  };

  // Minimal Form Render - Using SAME MUI structure as first type
  const renderMinimalForm = () => {
    return (
      <>
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            {/* Basic Information Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer Code <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_code"
                      value={minimalFormData.customer_code}
                      onChange={handleMinimalChange}
                      placeholder="e.g., BASIC001"
                      error={!!fieldErrors.customer_code}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.customer_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.customer_code}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer Name <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_name"
                      value={minimalFormData.customer_name}
                      onChange={handleMinimalChange}
                      placeholder="e.g., Basic Customer Pvt Ltd"
                      error={!!fieldErrors.customer_name}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.customer_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.customer_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.customer_type}>
                      <Select
                        value={minimalFormData.customer_type}
                        onChange={handleMinimalChange}
                        name="customer_type"
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {CUSTOMER_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Billing Address Section - Using SAME structure as first type */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Billing Address <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Address Line 1 <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.line1}
                      onChange={(e) => handleMinimalAddressChange('line1', e.target.value)}
                      placeholder="e.g., 123 MG Road"
                      error={!!fieldErrors.address_line1}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_line1 && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_line1}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Address Line 2
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.line2}
                      onChange={(e) => handleMinimalAddressChange('line2', e.target.value)}
                      placeholder="e.g., Near City Center"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      City <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.city}
                      onChange={(e) => handleMinimalAddressChange('city', e.target.value)}
                      placeholder="e.g., Pune"
                      error={!!fieldErrors.address_city}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_city && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_city}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      District
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.district}
                      onChange={(e) => handleMinimalAddressChange('district', e.target.value)}
                      placeholder="e.g., Pune"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      State <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.state}
                      onChange={(e) => handleMinimalAddressChange('state', e.target.value)}
                      placeholder="e.g., Maharashtra"
                      error={!!fieldErrors.address_state}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_state && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_state}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      State Code <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.state_code}
                      onChange={(e) => handleMinimalAddressChange('state_code', e.target.value)}
                      placeholder="e.g., 27"
                      error={!!fieldErrors.address_state_code}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_state_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_state_code}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Pincode <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.pincode}
                      onChange={(e) => handleMinimalAddressChange('pincode', e.target.value)}
                      placeholder="e.g., 411001"
                      error={!!fieldErrors.address_pincode}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_pincode && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_pincode}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Country
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={minimalFormData.billing_address.country}
                      onChange={(e) => handleMinimalAddressChange('country', e.target.value)}
                      placeholder="e.g., India"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
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
          <Button
            variant="contained"
            onClick={handleMinimalSubmit}
            disabled={loading}
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Adding...' : 'Add Customer'}
          </Button>
        </DialogActions>
      </>
    );
  };

  // Export Form Render - Using SAME MUI structure as first type
  const renderExportForm = () => {
    return (
      <>
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            {/* Basic Information Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Export Customer Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer Code <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_code"
                      value={exportFormData.customer_code}
                      onChange={handleExportChange}
                      placeholder="e.g., ACME-US-001"
                      error={!!fieldErrors.customer_code}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.customer_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.customer_code}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer Name <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_name"
                      value={exportFormData.customer_name}
                      onChange={handleExportChange}
                      placeholder="e.g., ACME Corporation"
                      error={!!fieldErrors.customer_name}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.customer_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.customer_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Currency
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={exportFormData.currency}
                        onChange={handleExportChange}
                        name="currency"
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {CURRENCY_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Billing Address Section - Using SAME structure as first type */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Billing Address <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Address Line 1 <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.line1}
                      onChange={(e) => handleExportAddressChange('line1', e.target.value)}
                      placeholder="e.g., 123 Industrial Ave"
                      error={!!fieldErrors.address_line1}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_line1 && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_line1}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Address Line 2
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.line2}
                      onChange={(e) => handleExportAddressChange('line2', e.target.value)}
                      placeholder="e.g., Suite 100"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      City <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.city}
                      onChange={(e) => handleExportAddressChange('city', e.target.value)}
                      placeholder="e.g., Detroit"
                      error={!!fieldErrors.address_city}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_city && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_city}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      District
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.district}
                      onChange={(e) => handleExportAddressChange('district', e.target.value)}
                      placeholder="e.g., Wayne County"
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      State <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.state}
                      onChange={(e) => handleExportAddressChange('state', e.target.value)}
                      placeholder="e.g., Michigan"
                      error={!!fieldErrors.address_state}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_state && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_state}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      State Code <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.state_code}
                      onChange={(e) => handleExportAddressChange('state_code', e.target.value)}
                      placeholder="e.g., 1"
                      error={!!fieldErrors.address_state_code}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_state_code && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_state_code}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Pincode <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.pincode}
                      onChange={(e) => handleExportAddressChange('pincode', e.target.value)}
                      placeholder="e.g., 48201"
                      error={!!fieldErrors.address_pincode}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_pincode && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_pincode}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Country <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={exportFormData.billing_address.country}
                      onChange={(e) => handleExportAddressChange('country', e.target.value)}
                      placeholder="e.g., USA"
                      error={!!fieldErrors.address_country}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                    {fieldErrors.address_country && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.address_country}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
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
          <Button
            variant="contained"
            onClick={handleExportSubmit}
            disabled={loading}
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Adding...' : 'Add Customer'}
          </Button>
        </DialogActions>
      </>
    );
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add New Customer
        </Typography>
      </DialogTitle>

      {/* Customer Type Selection */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant={customerType === 'full' ? 'contained' : 'outlined'}
            onClick={() => handleCustomerTypeChange('full')}
            sx={{
              flex: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              bgcolor: customerType === 'full' ? COLORS.primary : 'transparent',
              borderColor: COLORS.border,
              color: customerType === 'full' ? COLORS.text.light : COLORS.text.secondary,
              '&:hover': {
                bgcolor: customerType === 'full' ? COLORS.primaryDark : COLORS.primaryLight
              }
            }}
          >
            Full OEM Customer
          </Button>
          <Button
            variant={customerType === 'minimal' ? 'contained' : 'outlined'}
            onClick={() => handleCustomerTypeChange('minimal')}
            sx={{
              flex: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              bgcolor: customerType === 'minimal' ? COLORS.primary : 'transparent',
              borderColor: COLORS.border,
              color: customerType === 'minimal' ? COLORS.text.light : COLORS.text.secondary,
              '&:hover': {
                bgcolor: customerType === 'minimal' ? COLORS.primaryDark : COLORS.primaryLight
              }
            }}
          >
            Minimal Customer
          </Button>
          <Button
            variant={customerType === 'export' ? 'contained' : 'outlined'}
            onClick={() => handleCustomerTypeChange('export')}
            sx={{
              flex: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              bgcolor: customerType === 'export' ? COLORS.primary : 'transparent',
              borderColor: COLORS.border,
              color: customerType === 'export' ? COLORS.text.light : COLORS.text.secondary,
              '&:hover': {
                bgcolor: customerType === 'export' ? COLORS.primaryDark : COLORS.primaryLight
              }
            }}
          >
            Export Customer
          </Button>
        </Box>
      </Box>

      {customerType === 'full' && renderFullForm()}
      {customerType === 'minimal' && renderMinimalForm()}
      {customerType === 'export' && renderExportForm()}
    </Dialog>
  );
};

export default AddCustomer;