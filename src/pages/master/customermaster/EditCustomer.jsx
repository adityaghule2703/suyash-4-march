import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  IconButton,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, CUSTOMER_TYPE_OPTIONS, INDUSTRY_SEGMENT_OPTIONS, PRIORITY_OPTIONS, PAYMENT_TERMS_OPTIONS, CURRENCY_OPTIONS } from './constants';

const EditCustomer = ({ open, onClose, customer, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_code: customer.customer_code || '',
        customer_name: customer.customer_name || '',
        customer_type: customer.customer_type || 'OEM',
        industry_segment: customer.industry_segment || '',
        priority: customer.priority || 'Regular',
        gstin: customer.gstin || '',
        pan: customer.pan || '',
        tan: customer.tan || '',
        msme_number: customer.msme_number || '',
        is_sez: customer.is_sez || false,
        is_export: customer.is_export || false,
        credit_limit: customer.credit_limit || '',
        credit_days: customer.credit_days || '',
        payment_terms: customer.payment_terms || 'Net 30',
        currency: customer.currency || 'INR',
        billing_address: customer.billing_address || {
          line1: '',
          line2: '',
          city: '',
          district: '',
          state: '',
          state_code: '',
          pincode: '',
          country: 'India'
        },
        bank_details: customer.bank_details || {
          bank_name: '',
          account_no: '',
          ifsc: '',
          branch: '',
          account_name: ''
        }
      });
      setContacts(customer.contacts || []);
    }
  }, [customer]);

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
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handlePrimaryContactChange = (index) => {
    const updatedContacts = contacts.map((contact, i) => ({
      ...contact,
      is_primary: i === index
    }));
    setContacts(updatedContacts);
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

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.customer_code?.trim()) {
      errors.customer_code = 'Customer code is required';
      isValid = false;
    }
    if (!formData.customer_name?.trim()) {
      errors.customer_name = 'Customer name is required';
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
    
    if (!formData.billing_address?.line1?.trim()) {
      errors.address_line1 = 'Address line 1 is required';
      isValid = false;
    }
    if (!formData.billing_address?.city?.trim()) {
      errors.address_city = 'City is required';
      isValid = false;
    }
    if (!formData.billing_address?.state?.trim()) {
      errors.address_state = 'State is required';
      isValid = false;
    }
    if (!formData.billing_address?.state_code) {
      errors.address_state_code = 'State code is required';
      isValid = false;
    }
    if (!formData.billing_address?.pincode?.trim()) {
      errors.address_pincode = 'Pincode is required';
      isValid = false;
    }
    
    for (let i = 0; i < contacts.length; i++) {
      if (!contacts[i].name?.trim()) {
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

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        ...formData,
        credit_limit: formData.credit_limit ? Number(formData.credit_limit) : undefined,
        credit_days: formData.credit_days ? Number(formData.credit_days) : undefined,
        contacts: contacts
      };

      const response = await axios.put(`${BASE_URL}/api/customers/${customer._id}`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update customer');
      }
    } catch (err) {
      console.error('Error updating customer:', err);
      setError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        mb: 2,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Customer
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Basic Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              
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
                    value={formData.customer_code || ''}
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
                    value={formData.customer_name || ''}
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
                      value={formData.customer_type || 'OEM'}
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
                      value={formData.industry_segment || ''}
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
                      value={formData.priority || 'Regular'}
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
                    value={formData.gstin || ''}
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
                    value={formData.pan || ''}
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
              
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_sez || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_sez: e.target.checked }))}
                        size="small"
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.75rem' }}>SEZ Unit</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_export || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_export: e.target.checked }))}
                        size="small"
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.75rem' }}>Export Customer</Typography>}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Address */}
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
                    value={formData.billing_address?.line1 || ''}
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
                    value={formData.billing_address?.line2 || ''}
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
                    value={formData.billing_address?.city || ''}
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
                    value={formData.billing_address?.district || ''}
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
                    value={formData.billing_address?.state || ''}
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
                    value={formData.billing_address?.state_code || ''}
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
                    value={formData.billing_address?.pincode || ''}
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
                    value={formData.billing_address?.country || 'India'}
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

          {/* Contacts */}
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
                        value={contact.name || ''}
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
                      {fieldErrors[`contact_${index}_name`] && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors[`contact_${index}_name`]}
                        </Typography>
                      )}
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
                        value={contact.designation || ''}
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
                        value={contact.email || ''}
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
                      {fieldErrors[`contact_${index}_email`] && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors[`contact_${index}_email`]}
                        </Typography>
                      )}
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
                        value={contact.mobile || ''}
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
                      {fieldErrors[`contact_${index}_mobile`] && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors[`contact_${index}_mobile`]}
                        </Typography>
                      )}
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
                        value={contact.phone || ''}
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
                        value={contact.department || ''}
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

          {/* Financial & Bank */}
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
                    value={formData.credit_limit || ''}
                    onChange={handleChange}
                    placeholder="1000000"
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
                    value={formData.credit_days || ''}
                    onChange={handleChange}
                    placeholder="60"
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
                      value={formData.payment_terms || 'Net 30'}
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
                      value={formData.currency || 'INR'}
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
                    value={formData.bank_details?.bank_name || ''}
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
                    value={formData.bank_details?.account_name || ''}
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
                    value={formData.bank_details?.account_no || ''}
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
                    value={formData.bank_details?.ifsc || ''}
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
                    value={formData.bank_details?.branch || ''}
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
          
          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
        <Button
          onClick={onClose}
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
          onClick={handleSubmit}
          disabled={loading}
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
              bgcolor: COLORS.primaryDark 
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomer;