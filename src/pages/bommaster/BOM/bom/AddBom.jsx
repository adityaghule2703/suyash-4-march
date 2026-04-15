// AddBom.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  IconButton,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  ProductionQuantityLimits as ProductionIcon,
  DateRange as DateRangeIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF'
};

// Enums
const BOM_TYPE_OPTIONS = ['Manufacturing', 'Subcontract', 'Phantom', 'Variant'];
const STATUS_OPTIONS = ['Pending', 'Active', 'Approved', 'Cancelled', 'Archived'];
const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece', 'Sheet', 'Roll'];

const steps = ['Basic Information', 'Production Parameters', 'Components', 'Review & Submit'];

// Modern Stepper Connector
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

const AddBom = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data from APIs
  const [parentItems, setParentItems] = useState([]);
  const [componentItems, setComponentItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    parent_item_id: '',
    bom_version: 'v1.0',
    bom_type: 'Manufacturing',
    status: 'Pending',
    batch_size: 1,
    yield_percent: 100,
    setup_time_min: 30,
    cycle_time_min: 5.5,
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: '',
    created_by: localStorage.getItem('userId') || ''
  });
  
  const [components, setComponents] = useState([
    {
      level: 1,
      component_item_id: '',
      component_part_no: '',
      component_desc: '',
      quantity_per: 1,
      unit: 'Nos',
      scrap_percent: 0,
      is_phantom: false,
      is_subcontract: false,
      subcontract_vendor: null,
      reference_designator: '',
      remarks: ''
    }
  ]);
  
  // Fetch parent items (item_role = 'parent')
  const fetchParentItems = useCallback(async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const parents = response.data.data.filter(item => item.item_role === 'parent');
        setParentItems(parents);
      }
    } catch (err) {
      console.error('Error fetching parent items:', err);
    } finally {
      setLoadingItems(false);
    }
  }, []);
  
  // Fetch component items (item_role = 'component')
  const fetchComponentItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const components = response.data.data.filter(item => item.item_role === 'component');
        setComponentItems(components);
      }
    } catch (err) {
      console.error('Error fetching component items:', err);
    }
  }, []);
  
  useEffect(() => {
    if (open) {
      fetchParentItems();
      fetchComponentItems();
    }
  }, [open, fetchParentItems, fetchComponentItems]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
const handleComponentChange = (index, field, value) => {
  const updatedComponents = [...components];
  updatedComponents[index][field] = value;
  
  // Auto-fill part_no and description when component_item_id is selected
  if (field === 'component_item_id' && value) {
    const selectedItem = componentItems.find(item => item._id === value);
    if (selectedItem) {
      updatedComponents[index].component_part_no = selectedItem.part_no || '';
      updatedComponents[index].component_desc = selectedItem.part_description || '';
      updatedComponents[index].unit = selectedItem.unit || 'Nos';
      
      // Check for unit mismatch warning
      if (selectedItem.unit && updatedComponents[index].unit !== selectedItem.unit) {
        setError(`Warning: Component "${selectedItem.part_no}" unit mismatch. Item unit is ${selectedItem.unit}, selected ${updatedComponents[index].unit}`);
        // Clear error after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
    }
  }
  
  setComponents(updatedComponents);
  setFieldErrors(prev => ({ ...prev, [`comp_${index}_${field}`]: '' }));
};
  
  const addComponent = () => {
    setComponents([
      ...components,
      {
        level: components.length + 1,
        component_item_id: '',
        component_part_no: '',
        component_desc: '',
        quantity_per: 1,
        unit: 'Nos',
        scrap_percent: 0,
        is_phantom: false,
        is_subcontract: false,
        subcontract_vendor: null,
        reference_designator: '',
        remarks: ''
      }
    ]);
  };
  
  const removeComponent = (index) => {
    if (components.length > 1) {
      const updatedComponents = components.filter((_, i) => i !== index);
      updatedComponents.forEach((comp, idx) => {
        comp.level = idx + 1;
      });
      setComponents(updatedComponents);
    }
  };
  
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    switch (step) {
      case 0: // Basic Information
        if (!formData.parent_item_id) {
          errors.parent_item_id = 'Parent item is required';
          isValid = false;
        }
        if (!formData.bom_version.trim()) {
          errors.bom_version = 'BOM version is required';
          isValid = false;
        }
        if (!formData.bom_type) {
          errors.bom_type = 'BOM type is required';
          isValid = false;
        }
        if (!formData.effective_from) {
          errors.effective_from = 'Effective from date is required';
          isValid = false;
        }
        break;
        
      case 2: // Components
        components.forEach((comp, index) => {
          if (!comp.component_item_id) {
            errors[`comp_${index}_component_item_id`] = `Component ${index + 1}: Item is required`;
            isValid = false;
          }
          if (!comp.quantity_per || comp.quantity_per <= 0) {
            errors[`comp_${index}_quantity_per`] = `Component ${index + 1}: Valid quantity is required`;
            isValid = false;
          }
        });
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
  // Validate final step (components)
  if (!validateStep(2)) {
    return;
  }
  
  // Additional validation for unit consistency
  const unitMismatches = [];
  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    const selectedItem = componentItems.find(item => item._id === comp.component_item_id);
    if (selectedItem && selectedItem.unit && comp.unit !== selectedItem.unit) {
      unitMismatches.push(`Component "${comp.component_part_no || selectedItem.part_no}": Unit mismatch. Item unit is ${selectedItem.unit}, provided ${comp.unit}`);
    }
  }
  
  if (unitMismatches.length > 0) {
    setError(unitMismatches.join('\n'));
    setActiveStep(2);
    return;
  }
  
  setLoading(true);
  setError('');
  
  try {
    const token = localStorage.getItem('token');
    
    const submitData = {
      ...formData,
      batch_size: Number(formData.batch_size),
      yield_percent: Number(formData.yield_percent),
      setup_time_min: Number(formData.setup_time_min),
      cycle_time_min: Number(formData.cycle_time_min),
      components: components.map(comp => ({
        ...comp,
        level: Number(comp.level),
        quantity_per: Number(comp.quantity_per),
        scrap_percent: Number(comp.scrap_percent)
      }))
    };
    
    const response = await axios.post(`${BASE_URL}/api/boms`, submitData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      onAdd(response.data.data);
      onClose();
      resetForm();
    } else {
      setError(response.data.message || 'Failed to add BOM');
    }
  } catch (err) {
    console.error('Error adding BOM:', err);
    
    // Extract error message from the response
    let errorMessage = 'Failed to add BOM. Please try again.';
    
    if (err.response?.data) {
      const data = err.response.data;
      
      // Check if there's an errors array (your backend response)
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        errorMessage = data.errors.join('\n');
      }
      // Check for message field
      else if (data.message) {
        errorMessage = data.message;
      }
      // Check for error field
      else if (data.error) {
        errorMessage = data.error;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  
  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      parent_item_id: '',
      bom_version: 'v1.0',
      bom_type: 'Manufacturing',
      status: 'Pending',
      batch_size: 1,
      yield_percent: 100,
      setup_time_min: 30,
      cycle_time_min: 5.5,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: '',
      created_by: localStorage.getItem('userId') || ''
    });
    setComponents([
      {
        level: 1,
        component_item_id: '',
        component_part_no: '',
        component_desc: '',
        quantity_per: 1,
        unit: 'Nos',
        scrap_percent: 0,
        is_phantom: false,
        is_subcontract: false,
        subcontract_vendor: null,
        reference_designator: '',
        remarks: ''
      }
    ]);
    setFieldErrors({});
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
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PARENT ITEM <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={parentItems}
                      getOptionLabel={(option) => `${option.part_no} - ${option.part_description}`}
                      value={parentItems.find(item => item._id === formData.parent_item_id) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, parent_item_id: newValue?._id || '' }));
                        setFieldErrors(prev => ({ ...prev, parent_item_id: '' }));
                      }}
                      loading={loadingItems}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          error={!!fieldErrors.parent_item_id}
                          helperText={fieldErrors.parent_item_id}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      BOM VERSION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bom_version"
                      value={formData.bom_version}
                      onChange={handleChange}
                      placeholder="v1.0"
                      error={!!fieldErrors.bom_version}
                      helperText={fieldErrors.bom_version}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      BOM TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.bom_type}>
                      <Select
                        name="bom_type"
                        value={formData.bom_type}
                        onChange={handleChange}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {BOM_TYPE_OPTIONS.map(option => (
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
                      STATUS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {STATUS_OPTIONS.map(option => (
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
                      EFFECTIVE FROM <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="effective_from"
                      value={formData.effective_from}
                      onChange={handleChange}
                      error={!!fieldErrors.effective_from}
                      helperText={fieldErrors.effective_from}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      EFFECTIVE TO
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="effective_to"
                      value={formData.effective_to}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      InputLabelProps={{ shrink: true }}
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
                <ProductionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Production Parameters
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Batch Size
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="batch_size"
                      value={formData.batch_size}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Yield (%)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="yield_percent"
                      value={formData.yield_percent}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Setup Time (min)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="setup_time_min"
                      value={formData.setup_time_min}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Cycle Time (min)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="cycle_time_min"
                      value={formData.cycle_time_min}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 2:
        return (
          <Stack spacing={2}>
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
                Components <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {components.map((component, index) => (
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
                      Component {index + 1}
                    </Typography>
                    {components.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeComponent(index)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          COMPONENT ITEM <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={componentItems}
                          getOptionLabel={(option) => `${option.part_no} - ${option.part_description}`}
                          value={componentItems.find(item => item._id === component.component_item_id) || null}
                          onChange={(event, newValue) => handleComponentChange(index, 'component_item_id', newValue?._id || '')}
                          loading={loadingItems}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!fieldErrors[`comp_${index}_component_item_id`]}
                              helperText={fieldErrors[`comp_${index}_component_item_id`]}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          QUANTITY PER <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={component.quantity_per}
                          onChange={(e) => handleComponentChange(index, 'quantity_per', e.target.value)}
                          error={!!fieldErrors[`comp_${index}_quantity_per`]}
                          helperText={fieldErrors[`comp_${index}_quantity_per`]}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          UNIT
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={component.unit}
                            onChange={(e) => handleComponentChange(index, 'unit', e.target.value)}
                            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
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
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          SCRAP %
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={component.scrap_percent}
                          onChange={(e) => handleComponentChange(index, 'scrap_percent', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          REFERENCE DESIGNATOR
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={component.reference_designator}
                          onChange={(e) => handleComponentChange(index, 'reference_designator', e.target.value)}
                          placeholder="e.g., R1, C2, U3"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          REMARKS
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={component.remarks}
                          onChange={(e) => handleComponentChange(index, 'remarks', e.target.value)}
                          placeholder="Additional notes..."
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={addComponent}
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
                Add Component
              </Button>
            </Paper>
          </Stack>
        );
        
      case 3:
        return (
          <Stack spacing={2}>
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
                Review & Submit
              </Typography>
              
              <Stack spacing={2}>
                {/* Basic Info Summary */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Item:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {parentItems.find(item => item._id === formData.parent_item_id)?.part_no || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Version:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.bom_version}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Type:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.bom_type}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.status}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective From:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.effective_from}</Typography>
                    </Grid>
                    {formData.effective_to && (
                      <>
                        <Grid size={{ xs: 6 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective To:</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.effective_to}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
                
                {/* Production Parameters Summary */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Production Parameters
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Batch Size:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.batch_size}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Yield:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.yield_percent}%</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Setup Time:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.setup_time_min} min</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Cycle Time:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.cycle_time_min} min</Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Components Summary */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Components ({components.length})
                  </Typography>
                  {components.map((comp, idx) => (
                    <Box key={idx} sx={{ mb: 1, pb: 1, borderBottom: idx < components.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {comp.component_part_no || 'Not selected'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        Qty: {comp.quantity_per} {comp.unit} | Scrap: {comp.scrap_percent}%
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Stack>
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
          borderRadius: 2,
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
          Add New BOM
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      {/* Stepper */}
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
              py: 0.5
            }}
          >
               <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
      Validation Error
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>
      {error}
    </Typography>
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
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? 'Adding...' : 'Add BOM'}
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
                '&:hover': { bgcolor: COLORS.primaryDark }
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

export default AddBom;