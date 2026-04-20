import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  styled,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddItem from '../itemmaster/AddItem';


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

// Options
const LEAD_SOURCE_OPTIONS = ['Website', 'Email', 'WhatsApp', 'Phone', 'Exhibition', 'Referral', 'Cold Outreach', 'Walk-In', 'LinkedIn', 'Other'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
const INDUSTRY_OPTIONS = ['Switchgear', 'Automotive', 'Electronics', 'Construction', 'Manufacturing', 'Power', 'Telecom', 'Other'];
const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

const steps = ['Basic Information', 'Contact Details', 'Enquired Items', 'Additional Info'];

const AddLead = ({ open, onClose, onAdd }) => {
  const [leadType, setLeadType] = useState('exhibition');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Data fetching states
  const [materials, setMaterials] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  // Dialog states for Add Item
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [currentFieldType, setCurrentFieldType] = useState(null); // 'material_grade' or 'part_no'

  // Exhibition lead form data
  const [formData, setFormData] = useState({
    lead_source: 'Exhibition',
    lead_source_detail: '',
    subject: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_mobile: '',
    designation: '',
    industry: '',
    priority: 'Medium',
    estimated_value: '',
    tags: []
  });

  // Minimal lead form data
  const [minimalFormData, setMinimalFormData] = useState({
    lead_source: 'Phone',
    subject: '',
    company_name: '',
    contact_name: ''
  });

  // Enquired items with material grade and part no from masters
  const [enquiredItems, setEnquiredItems] = useState([
    {
      description: '',
      quantity: '',
      unit: 'Nos',
      target_price: '',
      material_grade: '',
      part_no: ''
    }
  ]);

  const [tagInput, setTagInput] = useState('');
  const [selectedLeadSource, setSelectedLeadSource] = useState('Exhibition');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Fetch materials from Material Master
  const fetchMaterials = useCallback(async () => {
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
  }, []);

  // Fetch items from Item Master
  const fetchItems = useCallback(async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchMaterials();
      fetchItems();
    }
  }, [open, fetchMaterials, fetchItems]);

  // Handle item added from AddItem dialog
  const handleItemAdded = (newItem) => {
    // Add the new item to items list
    setItems(prev => [...prev, newItem]);
    
    // If we were adding from a specific field, auto-select it
    if (currentItemIndex !== null && currentFieldType) {
      if (currentFieldType === 'part_no') {
        handleEnquiredItemChange(currentItemIndex, 'part_no', newItem.part_no);
        // Auto-fill description if available
        if (newItem.part_description && !enquiredItems[currentItemIndex].description) {
          handleEnquiredItemChange(currentItemIndex, 'description', newItem.part_description);
        }
      } else if (currentFieldType === 'material_grade' && newItem.material) {
        handleEnquiredItemChange(currentItemIndex, 'material_grade', newItem.material);
      }
    }
    
    // Reset tracking
    setCurrentItemIndex(null);
    setCurrentFieldType(null);
  };

  // Handle material added (if you have a separate AddMaterial component)
  const handleMaterialAdded = (newMaterial) => {
    setMaterials(prev => [...prev, newMaterial]);
    
    // Auto-select the new material for the current item
    if (currentItemIndex !== null && currentFieldType === 'material_grade') {
      handleEnquiredItemChange(currentItemIndex, 'material_grade', newMaterial.Grade);
    }
    
    setCurrentItemIndex(null);
    setCurrentFieldType(null);
  };

  const handleLeadTypeChange = (type) => {
    setLeadType(type);
    setError('');
    setActiveStep(0);
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleMinimalChange = (e) => {
    const { name, value } = e.target;
    setMinimalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleLeadSourceChange = (event, newValue) => {
    setSelectedLeadSource(newValue);
    setFormData(prev => ({
      ...prev,
      lead_source: newValue || 'Exhibition'
    }));
  };

  const handlePriorityChange = (event, newValue) => {
    setSelectedPriority(newValue);
    setFormData(prev => ({
      ...prev,
      priority: newValue || 'Medium'
    }));
  };

  const handleIndustryChange = (event, newValue) => {
    setSelectedIndustry(newValue);
    setFormData(prev => ({
      ...prev,
      industry: newValue || ''
    }));
  };

  const handleEnquiredItemChange = (index, field, value) => {
    const updatedItems = [...enquiredItems];
    updatedItems[index][field] = value;
    
    // Auto-fill description if part_no is selected
    if (field === 'part_no' && value) {
      const selectedItem = items.find(item => item.part_no === value);
      if (selectedItem && !updatedItems[index].description) {
        updatedItems[index].description = selectedItem.part_description || '';
      }
    }
    
    // Auto-fill material grade if selected from material master
    if (field === 'material_grade' && value) {
      const selectedMaterial = materials.find(m => m.Grade === value);
      if (selectedMaterial && !updatedItems[index].description && !updatedItems[index].part_no) {
        updatedItems[index].description = selectedMaterial.MaterialName || '';
      }
    }
    
    setEnquiredItems(updatedItems);
    
    setFieldErrors(prev => ({
      ...prev,
      [`item_${index}_${field}`]: ''
    }));
  };

  const addEnquiredItem = () => {
    setEnquiredItems([...enquiredItems, {
      description: '',
      quantity: '',
      unit: 'Nos',
      target_price: '',
      material_grade: '',
      part_no: ''
    }]);
  };

  const removeEnquiredItem = (index) => {
    if (enquiredItems.length > 1) {
      const updatedItems = enquiredItems.filter((_, i) => i !== index);
      setEnquiredItems(updatedItems);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.lead_source_detail.trim()) {
          errors.lead_source_detail = 'Lead source detail is required';
          isValid = false;
        }
        
        if (!formData.subject.trim()) {
          errors.subject = 'Subject is required';
          isValid = false;
        }
        
        if (!formData.company_name.trim()) {
          errors.company_name = 'Company name is required';
          isValid = false;
        }
        break;
      
      case 1: // Contact Details
        if (!formData.contact_name.trim()) {
          errors.contact_name = 'Contact name is required';
          isValid = false;
        }
        
        if (formData.contact_email && !validateEmail(formData.contact_email)) {
          errors.contact_email = 'Please enter a valid email address';
          isValid = false;
        }
        
        if (formData.contact_mobile && !validatePhone(formData.contact_mobile)) {
          errors.contact_mobile = 'Please enter a valid 10-digit mobile number starting with 6-9';
          isValid = false;
        }
        break;
      
      case 2: // Enquired Items
        for (let i = 0; i < enquiredItems.length; i++) {
          if (!enquiredItems[i].description.trim()) {
            errors[`item_${i}_description`] = `Item ${i + 1}: Description is required`;
            isValid = false;
          }
          if (!enquiredItems[i].quantity) {
            errors[`item_${i}_quantity`] = `Item ${i + 1}: Quantity is required`;
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

    if (!formData.lead_source_detail.trim()) {
      errors.lead_source_detail = 'Lead source detail is required';
      isValid = false;
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }
    
    if (!formData.company_name.trim()) {
      errors.company_name = 'Company name is required';
      isValid = false;
    }
    
    if (!formData.contact_name.trim()) {
      errors.contact_name = 'Contact name is required';
      isValid = false;
    }
    
    if (formData.contact_email && !validateEmail(formData.contact_email)) {
      errors.contact_email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (formData.contact_mobile && !validatePhone(formData.contact_mobile)) {
      errors.contact_mobile = 'Please enter a valid 10-digit mobile number starting with 6-9';
      isValid = false;
    }
    
    for (let i = 0; i < enquiredItems.length; i++) {
      if (!enquiredItems[i].description.trim()) {
        errors[`item_${i}_description`] = `Item ${i + 1}: Description is required`;
        isValid = false;
      }
      if (!enquiredItems[i].quantity) {
        errors[`item_${i}_quantity`] = `Item ${i + 1}: Quantity is required`;
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
      
      const requestData = {
        ...formData,
        estimated_value: formData.estimated_value ? Number(formData.estimated_value) : undefined,
        enquired_items: enquiredItems.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          target_price: item.target_price ? Number(item.target_price) : undefined
        }))
      };

      const response = await axios.post(`${BASE_URL}/api/leads`, requestData, {
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
        setError(response.data.message || 'Failed to add lead');
      }
    } catch (err) {
      console.error('Error adding lead:', err);
      setError(err.response?.data?.message || 'Failed to add lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMinimalSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!minimalFormData.subject.trim()) {
        setError('Subject is required');
        setLoading(false);
        return;
      }
      if (!minimalFormData.company_name.trim()) {
        setError('Company name is required');
        setLoading(false);
        return;
      }
      if (!minimalFormData.contact_name.trim()) {
        setError('Contact name is required');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${BASE_URL}/api/leads`, minimalFormData, {
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
        setError(response.data.message || 'Failed to add lead');
      }
    } catch (err) {
      console.error('Error adding lead:', err);
      setError(err.response?.data?.message || 'Failed to add lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLeadType('exhibition');
    setActiveStep(0);
    setFormData({
      lead_source: 'Exhibition',
      lead_source_detail: '',
      subject: '',
      company_name: '',
      contact_name: '',
      contact_email: '',
      contact_mobile: '',
      designation: '',
      industry: '',
      priority: 'Medium',
      estimated_value: '',
      tags: []
    });
    setMinimalFormData({
      lead_source: 'Phone',
      subject: '',
      company_name: '',
      contact_name: ''
    });
    setEnquiredItems([{
      description: '',
      quantity: '',
      unit: 'Nos',
      target_price: '',
      material_grade: '',
      part_no: ''
    }]);
    setTagInput('');
    setSelectedLeadSource('Exhibition');
    setSelectedPriority('Medium');
    setSelectedIndustry('');
    setFieldErrors({});
    setError('');
    setCurrentItemIndex(null);
    setCurrentFieldType(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Open Add Item dialog
  const openAddItemDialog = (index, fieldType) => {
    setCurrentItemIndex(index);
    setCurrentFieldType(fieldType);
    setAddItemOpen(true);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Basic Information Section */}
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
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Lead Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LEAD SOURCE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={LEAD_SOURCE_OPTIONS}
                      value={selectedLeadSource}
                      onChange={handleLeadSourceChange}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select lead source"
                          required
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
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LEAD SOURCE DETAIL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="lead_source_detail"
                      value={formData.lead_source_detail}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., ELECRAMA 2025"
                      error={!!fieldErrors.lead_source_detail}
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
                    {fieldErrors.lead_source_detail && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.lead_source_detail}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SUBJECT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Copper Busbar Enquiry"
                      error={!!fieldErrors.subject}
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
                    {fieldErrors.subject && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.subject}
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
                      placeholder="e.g., Siemens India Ltd"
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

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      INDUSTRY
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={INDUSTRY_OPTIONS}
                      value={selectedIndustry}
                      onChange={handleIndustryChange}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select industry"
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
                            }
                          }}
                        />
                      )}
                    />
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
                <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Contact Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CONTACT NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Rajesh Sharma"
                      error={!!fieldErrors.contact_name}
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
                    {fieldErrors.contact_name && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.contact_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DESIGNATION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      disabled={loading}
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
                      EMAIL
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="rajesh@siemens.com"
                      error={!!fieldErrors.contact_email}
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
                      e.g., name@company.com
                    </Typography>
                    {fieldErrors.contact_email && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.contact_email}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MOBILE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="contact_mobile"
                      value={formData.contact_mobile}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="9876543210"
                      error={!!fieldErrors.contact_mobile}
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
                      10-digit mobile number starting with 6-9
                    </Typography>
                    {fieldErrors.contact_mobile && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.contact_mobile}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* Enquired Items Section */}
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
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Enquired Items <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {enquiredItems.map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Item {index + 1}
                    </Typography>
                    {enquiredItems.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeEnquiredItem(index)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          DESCRIPTION <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.description}
                          onChange={(e) => handleEnquiredItemChange(index, 'description', e.target.value)}
                          placeholder="e.g., Copper Busbar 10x50x1000mm"
                          error={!!fieldErrors[`item_${index}_description`]}
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
                        {fieldErrors[`item_${index}_description`] && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors[`item_${index}_description`]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleEnquiredItemChange(index, 'quantity', e.target.value)}
                          placeholder="500"
                          error={!!fieldErrors[`item_${index}_quantity`]}
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
                        {fieldErrors[`item_${index}_quantity`] && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors[`item_${index}_quantity`]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          UNIT
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={item.unit}
                            onChange={(e) => handleEnquiredItemChange(index, 'unit', e.target.value)}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '& .MuiSelect-select': {
                                py: 1,
                                px: 1.5
                              }
                            }}
                          >
                            {UNIT_OPTIONS.map(option => (
                              <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          TARGET PRICE
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.target_price}
                          onChange={(e) => handleEnquiredItemChange(index, 'target_price', e.target.value)}
                          placeholder="120"
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
                    
                    {/* MATERIAL GRADE Field with Add Button */}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                            MATERIAL GRADE
                          </Typography>
                          <Tooltip title="Add New Material">
                            <IconButton
                              size="small"
                              onClick={() => openAddItemDialog(index, 'material_grade')}
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
                          options={materials.map(m => m.Grade).filter(g => g)}
                          loading={loadingMaterials}
                          value={item.material_grade}
                          onChange={(event, newValue) => handleEnquiredItemChange(index, 'material_grade', newValue || '')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select or type grade"
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
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingMaterials && <CircularProgress size={16} />}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    
                    {/* PART NO Field with Add Button */}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                            PART NO
                          </Typography>
                          <Tooltip title="Add New Item">
                            <IconButton
                              size="small"
                              onClick={() => openAddItemDialog(index, 'part_no')}
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
                          options={items.map(i => i.part_no).filter(p => p)}
                          loading={loadingItems}
                          value={item.part_no}
                          onChange={(event, newValue) => handleEnquiredItemChange(index, 'part_no', newValue || '')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select or type part no"
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
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingItems && <CircularProgress size={16} />}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={addEnquiredItem}
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
                Add Item
              </Button>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            {/* Additional Info Section */}
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PRIORITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={PRIORITY_OPTIONS}
                      value={selectedPriority}
                      onChange={handlePriorityChange}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select priority"
                          required
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
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ESTIMATED VALUE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="estimated_value"
                      type="number"
                      value={formData.estimated_value}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="250000"
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
                      Estimated value in INR
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      TAGS
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
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
                          }
                        }}
                      />
                      <Button
                        variant="outlined"
                        onClick={addTag}
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
                        Add
                      </Button>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          onDelete={() => removeTag(tag)}
                          sx={{
                            fontSize: '0.7rem',
                            height: 24,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary,
                            '&:hover': {
                              bgcolor: COLORS.primaryLight
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Lead Information Preview */}
            {(formData.subject || formData.company_name) && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5, 
                border: `1px solid ${COLORS.primary}`,
                boxShadow: 'none'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: COLORS.primaryDark, 
                  mb: 1.5 
                }}>
                  Lead Information Summary
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subject:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.subject || 'Not specified'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.company_name || 'Not specified'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.contact_name || 'Not specified'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Priority:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.priority}
                    </Typography>
                  </Stack>
                  
                  {formData.estimated_value && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Estimated Value:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        ₹{Number(formData.estimated_value).toLocaleString()}
                      </Typography>
                    </Stack>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Tags:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {formData.tags.join(', ')}
                      </Typography>
                    </Stack>
                  )}
                  
                  {enquiredItems.length > 0 && enquiredItems[0].description && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Items:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {enquiredItems.length} item(s)
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  // Render Minimal Lead Form
  const renderMinimalForm = () => {
    return (
      <Stack spacing={2}>
        <Paper sx={{ 
          p: 2, 
          bgcolor: COLORS.background.white, 
          borderRadius: 1.5, 
          border: `1px solid ${COLORS.border}`,
          boxShadow: 'none'
        }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  LEAD SOURCE
                </Typography>
                <Autocomplete
                  fullWidth
                  options={LEAD_SOURCE_OPTIONS}
                  value={minimalFormData.lead_source}
                  onChange={(event, newValue) => {
                    setMinimalFormData(prev => ({
                      ...prev,
                      lead_source: newValue || 'Phone'
                    }));
                  }}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select lead source"
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
                        }
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  SUBJECT <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="subject"
                  value={minimalFormData.subject}
                  onChange={handleMinimalChange}
                  disabled={loading}
                  placeholder="e.g., AL Busbar enquiry"
                  error={!!fieldErrors.minimal_subject}
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
                  COMPANY NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="company_name"
                  value={minimalFormData.company_name}
                  onChange={handleMinimalChange}
                  disabled={loading}
                  placeholder="e.g., ABC Electricals"
                  error={!!fieldErrors.minimal_company_name}
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
                  CONTACT NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="contact_name"
                  value={minimalFormData.contact_name}
                  onChange={handleMinimalChange}
                  disabled={loading}
                  placeholder="e.g., Suresh Patel"
                  error={!!fieldErrors.minimal_contact_name}
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
          </Grid>
        </Paper>
      </Stack>
    );
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
            Add New Lead
          </Typography>
        </DialogTitle>

        {/* Lead Type Selection */}
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant={leadType === 'exhibition' ? 'contained' : 'outlined'}
              onClick={() => handleLeadTypeChange('exhibition')}
              sx={{
                flex: 1,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                bgcolor: leadType === 'exhibition' ? COLORS.primary : 'transparent',
                borderColor: COLORS.border,
                color: leadType === 'exhibition' ? COLORS.text.light : COLORS.text.secondary,
                '&:hover': {
                  bgcolor: leadType === 'exhibition' ? COLORS.primaryDark : COLORS.primaryLight
                }
              }}
            >
              Exhibition Lead (With Enquired Items)
            </Button>
            <Button
              variant={leadType === 'minimal' ? 'contained' : 'outlined'}
              onClick={() => handleLeadTypeChange('minimal')}
              sx={{
                flex: 1,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                bgcolor: leadType === 'minimal' ? COLORS.primary : 'transparent',
                borderColor: COLORS.border,
                color: leadType === 'minimal' ? COLORS.text.light : COLORS.text.secondary,
                '&:hover': {
                  bgcolor: leadType === 'minimal' ? COLORS.primaryDark : COLORS.primaryLight
                }
              }}
            >
              Minimal Lead (Required Fields Only)
            </Button>
          </Box>
        </Box>

        {leadType === 'exhibition' ? (
          <>
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
                    {loading ? 'Adding...' : 'Add Lead'}
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
          </>
        ) : (
          <>
            <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
              {renderMinimalForm()}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2, 
                    borderRadius: 1.5,
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
              justifyContent: 'flex-end',
              gap: 1
            }}>
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
                disabled={loading || !minimalFormData.subject || !minimalFormData.company_name || !minimalFormData.contact_name}
                startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  height: 32,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
              >
                {loading ? 'Adding...' : 'Add Lead'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add Item Dialog */}
      <AddItem
        open={addItemOpen}
        onClose={() => {
          setAddItemOpen(false);
          setCurrentItemIndex(null);
          setCurrentFieldType(null);
        }}
        onAdd={handleItemAdded}
      />
    </>
  );
};

export default AddLead;