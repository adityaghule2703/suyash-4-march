import React, { useState, useEffect } from 'react';
import {
  // Layout components
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  
  // Form components
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  
  // Feedback components
  Alert,
  Typography,
  Chip,
  Divider,
  
  // Buttons and actions
  Button,
  IconButton,
  
  // Surfaces
  styled,
  
  // Utils
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  AddCircle as AddCircleIcon,
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

const AddQuotation = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [vendorType, setVendorType] = useState('Existing');
  const [formData, setFormData] = useState({
    vendor: {
      type: 'Existing',
      id: ''
    },
    template_id: '',
    valid_till: '',
    remarks: {
      internal: '',
      customer: ''
    },
    financials: {
      gst_percentage: 18
    },
    icc: {
      credit_on_input_days: -30,
      wip_fg_days: 30,
      credit_to_customer_days: 45,
      cost_of_capital: 0.10
    },
    items: []
  });
  
  const [newVendor, setNewVendor] = useState({
    vendor_name: '',
    vendor_type: 'RM',
    gstin: '',
    state: '',
    state_code: '',
    address: '',
    city: '',
    pincode: '',
    contact_person: '',
    phone: '',
    email: '',
    pan: ''
  });
  
  const [itemInput, setItemInput] = useState({
    part_no: '',
    quantity: '',
    part_name: ''
  });
  
  const [processes, setProcesses] = useState([]);
  const [selectedItemForProcess, setSelectedItemForProcess] = useState(null);
  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [currentProcessSelection, setCurrentProcessSelection] = useState({
    process_id: '',
    rate_per_hour: '',
    hours: '',
    outsourced_vendor_id: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Steps definition
  const steps = ['Template & Vendor', 'Items & Processes', 'Financials & Review'];

  // Vendor type options
  const vendorTypeOptions = ['RM', 'Process', 'Both' ];

  useEffect(() => {
    if (open) {
      fetchVendors();
      fetchItems();
      fetchProcesses();
      fetchTemplates();
    }
  }, [open]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const mappedVendors = (response.data.data || []).map(vendor => ({
          _id: vendor._id,
          vendor_name: vendor.vendor_name || vendor.VendorName,
          gstin: vendor.gstin || vendor.GSTIN,
          vendor_code: vendor.vendor_code || vendor.VendorCode,
          address: vendor.address || vendor.Address,
          city: vendor.city || vendor.City,
          state: vendor.state || vendor.State,
          state_code: vendor.state_code || vendor.StateCode,
          pincode: vendor.pincode || vendor.Pincode,
          contact_person: vendor.contact_person || vendor.ContactPerson,
          phone: vendor.phone || vendor.Phone,
          email: vendor.email || vendor.Email,
          pan: vendor.pan || vendor.PAN,
          vendor_type: vendor.vendor_type,
          is_active: vendor.is_active
        }));
        
        setVendors(mappedVendors);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again.');
    }
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const mappedItems = (response.data.data || []).map(item => ({
          _id: item._id,
          part_no: item.part_no || item.PartNo,
          part_name: item.part_description || item.PartDescription || item.PartName,
          unit: item.unit || item.Unit,
          hsn_code: item.hsn_code || item.HSNCode || item.hsnCode,
          part_description: item.part_description,
          drawing_no: item.drawing_no,
          revision_no: item.revision_no,
          material: item.material,
          is_active: item.is_active
        }));
        
        setItems(mappedItems);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    }
  };

  const fetchProcesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/processes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const mappedProcesses = (response.data.data || []).map(process => ({
          _id: process._id,
          process_id: process.process_id || process.ProcessID,
          process_name: process.process_name || process.ProcessName,
          category: process.category || process.Category,
          rate_type: process.rate_type || process.RateType,
          vendor_or_inhouse: process.vendor_or_inhouse || process.VendorOrInhouse || 'Vendor',
          is_active: process.is_active
        }));
        
        setProcesses(mappedProcesses);
      }
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError('Failed to load processes. Please try again.');
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/templates/dropdown`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTemplates(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates. Please try again.');
    }
  };

  const handleVendorTypeChange = (event) => {
    const type = event.target.value;
    setVendorType(type);
    setFormData(prev => ({
      ...prev,
      vendor: { ...prev.vendor, type }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleICCChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      icc: {
        ...prev.icc,
        [name]: value
      }
    }));
  };

  const handleFinancialsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      financials: {
        ...prev.financials,
        [name]: value
      }
    }));
  };

  const handleNewVendorChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartNoChange = (event, value) => {
    if (value) {
      const selectedItem = items.find(item => item.part_no === value);
      setItemInput(prev => ({
        ...prev,
        part_no: value,
        part_name: selectedItem ? selectedItem.part_name : ''
      }));
    } else {
      setItemInput(prev => ({
        ...prev,
        part_no: '',
        part_name: ''
      }));
    }
  };

  const handleAddItem = () => {
    if (!itemInput.part_no || !itemInput.quantity || parseInt(itemInput.quantity) <= 0) {
      setError('Please enter valid Part No and Quantity');
      return;
    }

    const selectedItem = items.find(item => item.part_no === itemInput.part_no);
    if (!selectedItem) {
      setError('Selected Part No not found in items list');
      return;
    }

    const newItem = {
      part_no: itemInput.part_no,
      quantity: parseInt(itemInput.quantity),
      part_name: selectedItem.part_name || '',
      costing_parameters: {
        ohp_percent_on_material: 10,
        ohp_percent_on_labour: 15,
        inspection_cost_per_nos: 0,
        tool_maintenance_cost_per_nos: 0,
        packing_cost_per_nos: 0,
        plating_cost_per_kg: 0,
        margin_percent: 15
      },
      processes: []
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setItemInput({ part_no: '', quantity: '', part_name: '' });
    setError('');
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemCostingParamChange = (itemIndex, paramName, value) => {
    const updatedItems = [...formData.items];
    updatedItems[itemIndex].costing_parameters[paramName] = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleOpenProcessDialog = (itemIndex) => {
    setSelectedItemForProcess(itemIndex);
    setCurrentProcessSelection({
      process_id: '',
      rate_per_hour: '',
      hours: '',
      outsourced_vendor_id: null
    });
    setOpenProcessDialog(true);
  };

  const handleCloseProcessDialog = () => {
    setOpenProcessDialog(false);
    setSelectedItemForProcess(null);
    setCurrentProcessSelection({
      process_id: '',
      rate_per_hour: '',
      hours: '',
      outsourced_vendor_id: null
    });
  };

  const handleProcessSelectionChange = (e) => {
    const { name, value } = e.target;
    setCurrentProcessSelection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProcessToItem = () => {
    if (!currentProcessSelection.process_id || 
        !currentProcessSelection.rate_per_hour || 
        parseFloat(currentProcessSelection.rate_per_hour) <= 0 ||
        !currentProcessSelection.hours || 
        parseFloat(currentProcessSelection.hours) <= 0) {
      setError('Please select a process and enter valid rate per hour and hours');
      return;
    }

    const selectedProcess = processes.find(p => p._id === currentProcessSelection.process_id);
    if (!selectedProcess) {
      setError('Selected process not found');
      return;
    }

    const itemProcesses = formData.items[selectedItemForProcess].processes;
    if (itemProcesses.some(p => p.process_id === currentProcessSelection.process_id)) {
      setError('This process has already been added to the item');
      return;
    }

    const updatedItems = [...formData.items];
    updatedItems[selectedItemForProcess].processes.push({
      process_id: currentProcessSelection.process_id,
      rate_per_hour: parseFloat(currentProcessSelection.rate_per_hour),
      hours: parseFloat(currentProcessSelection.hours),
      outsourced_vendor_id: currentProcessSelection.outsourced_vendor_id || null,
      process_name: selectedProcess.process_name,
      rate_type: selectedProcess.rate_type,
      vendor_or_inhouse: selectedProcess.vendor_or_inhouse
    });

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));

    handleCloseProcessDialog();
    setError('');
  };

  const handleRemoveProcessFromItem = (itemIndex, processIndex) => {
    const updatedItems = [...formData.items];
    updatedItems[itemIndex].processes.splice(processIndex, 1);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!formData.template_id) {
        errors.template_id = 'Template is required';
      }
      if (vendorType === 'Existing' && !formData.vendor.id) {
        errors['vendor.id'] = 'Please select a vendor';
      }
      if (vendorType === 'New') {
        if (!newVendor.vendor_name?.trim()) errors.vendor_name = 'Vendor name is required';
        if (!newVendor.gstin?.trim()) errors.gstin = 'GSTIN is required';
        if (!newVendor.state?.trim()) errors.state = 'State is required';
        if (!newVendor.address?.trim()) errors.address = 'Address is required';
        if (!newVendor.contact_person?.trim()) errors.contact_person = 'Contact person is required';
        if (!newVendor.phone?.trim()) errors.phone = 'Phone is required';
        if (!newVendor.email?.trim()) errors.email = 'Email is required';
      }
      if (!formData.valid_till) {
        errors.valid_till = 'Valid till date is required';
      }
    } else if (step === 1) {
      if (formData.items.length === 0) {
        errors.items = 'At least one item is required';
      }
      for (let i = 0; i < formData.items.length; i++) {
        if (formData.items[i].processes.length === 0) {
          errors[`item_${i}_processes`] = `Item ${formData.items[i].part_no} must have at least one process`;
          break;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    } else {
      setError('Please fill in all required fields in this section');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
  if (!validateStep(1)) {
    setError('Please fill in all required fields correctly');
    return;
  }

  setLoading(true);
  setError('');

  const payload = {
    template_id: formData.template_id,
    valid_till: formData.valid_till,
    remarks: {
      internal: formData.remarks.internal || '',
      customer: formData.remarks.customer || ''
    },
    financials: {
      gst_percentage: parseFloat(formData.financials.gst_percentage) || 18
    },
    icc: {
      credit_on_input_days: parseInt(formData.icc.credit_on_input_days) || -30,
      wip_fg_days: parseInt(formData.icc.wip_fg_days) || 30,
      credit_to_customer_days: parseInt(formData.icc.credit_to_customer_days) || 45,
      cost_of_capital: parseFloat(formData.icc.cost_of_capital) || 0.10
    },
    items: formData.items.map(item => ({
      part_no: item.part_no,
      quantity: parseInt(item.quantity) || 0,
      costing_parameters: {
        ohp_percent_on_material: parseFloat(item.costing_parameters?.ohp_percent_on_material) || 10,
        ohp_percent_on_labour: parseFloat(item.costing_parameters?.ohp_percent_on_labour) || 15,
        inspection_cost_per_nos: parseFloat(item.costing_parameters?.inspection_cost_per_nos) || 0,
        tool_maintenance_cost_per_nos: parseFloat(item.costing_parameters?.tool_maintenance_cost_per_nos) || 0,
        packing_cost_per_nos: parseFloat(item.costing_parameters?.packing_cost_per_nos) || 0,
        plating_cost_per_kg: parseFloat(item.costing_parameters?.plating_cost_per_kg) || 0,
        margin_percent: parseFloat(item.costing_parameters?.margin_percent) || 15
      },
      processes: item.processes.map(process => ({
        process_id: process.process_id,
        rate_per_hour: parseFloat(process.rate_per_hour) || 0,
        hours: parseFloat(process.hours) || 0,
        outsourced_vendor_id: process.outsourced_vendor_id || null
      }))
    }))
  };

  // Set vendor based on type
  if (vendorType === 'Existing') {
    payload.vendor = {
      type: 'Existing',
      id: formData.vendor.id  // Changed from 'existing' to 'id'
    };
  } else {
    // For New vendor
    payload.vendor = {
      type: 'New',
      new: {
        vendor_name: newVendor.vendor_name,
        vendor_type: newVendor.vendor_type || 'RM',
        address: newVendor.address,
        gstin: newVendor.gstin,
        state: newVendor.state,
        state_code: newVendor.state_code ? parseInt(newVendor.state_code) : null,
        contact_person: newVendor.contact_person,
        phone: newVendor.phone,
        email: newVendor.email,
        pan: newVendor.pan || ''
      }
    };
    
    // Add optional fields if provided
    if (newVendor.city) payload.vendor.new.city = newVendor.city;
    if (newVendor.pincode) payload.vendor.new.pincode = newVendor.pincode;
  }

  console.log('Submitting payload:', JSON.stringify(payload, null, 2));

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/api/quotations`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      responseType: 'blob'
    });

    if (response.data instanceof Blob) {
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'quotation.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onAdd({ success: true, filename });
      resetForm();
      onClose();
    }
  } catch (err) {
    console.error('Error adding quotation:', err);
    
    // Try to get error message from response if it's JSON
    if (err.response && err.response.data instanceof Blob) {
      const text = await err.response.data.text();
      try {
        const errorData = JSON.parse(text);
        setError(errorData.message || 'Failed to add quotation');
      } catch {
        setError('Failed to add quotation. Please try again.');
      }
    } else {
      setError(err.response?.data?.message || 'Failed to add quotation. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setVendorType('Existing');
    setFormData({
      vendor: {
        type: 'Existing',
        id: ''
      },
      template_id: '',
      valid_till: '',
      remarks: {
        internal: '',
        customer: ''
      },
      financials: {
        gst_percentage: 18
      },
      icc: {
        credit_on_input_days: -30,
        wip_fg_days: 30,
        credit_to_customer_days: 45,
        cost_of_capital: 0.10
      },
      items: []
    });
    setNewVendor({
      vendor_name: '',
      vendor_type: 'RM',
      gstin: '',
      state: '',
      state_code: '',
      address: '',
      city: '',
      pincode: '',
      contact_person: '',
      phone: '',
      email: '',
      pan: ''
    });
    setItemInput({ part_no: '', quantity: '', part_name: '' });
    setError('');
    setFieldErrors({});
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const partNoOptions = items.map(item => item.part_no).filter(Boolean);

  const getProcessName = (processId) => {
    const process = processes.find(p => p._id === processId);
    return process ? process.process_name : 'Unknown Process';
  };

  const renderOption = (props, option) => {
    const item = items.find(i => i.part_no === option);
    const { key, ...otherProps } = props;
    
    return (
      <li key={key} {...otherProps}>
        <Box>
          <Typography variant="body2">{option}</Typography>
          {item && (
            <Typography variant="caption" color="textSecondary">
              {item.part_name} • {item.unit || 'No unit'}
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Template Selection */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Template Selection
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
                    <InputLabel>Select Template *</InputLabel>
                    <Select
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleChange}
                      label="Select Template *"
                      disabled={loading || templates.length === 0}
                      error={!!fieldErrors.template_id}
                    >
                      <MenuItem value="">
                        <em>Select a template</em>
                      </MenuItem>
                      {templates.map((template) => (
                        <MenuItem key={template._id} value={template._id}>
                          <Typography variant="body2">
                            {template.template_name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.template_id && (
                      <FormHelperText error>{fieldErrors.template_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Vendor Type Selection */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Vendor Details
              </Typography>
              
              <RadioGroup row value={vendorType} onChange={handleVendorTypeChange} sx={{ mb: 1.5 }}>
                <FormControlLabel value="Existing" control={<Radio size="small" />} label="Existing Vendor" />
                <FormControlLabel value="New" control={<Radio size="small" />} label="New Vendor" />
              </RadioGroup>

              {vendorType === 'Existing' ? (
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
                  <InputLabel>Select Vendor *</InputLabel>
                  <Select
                    name="vendor.id"
                    value={formData.vendor.id}
                    onChange={handleChange}
                    disabled={loading || vendors.length === 0}
                    label="Select Vendor *"
                    error={!!fieldErrors['vendor.id']}
                  >
                    <MenuItem value="">
                      <em>Select a vendor</em>
                    </MenuItem>
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        <Stack direction="column" spacing={0.5}>
                          <Typography variant="body2">
                            {vendor.vendor_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {vendor.gstin} • {vendor.vendor_code}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors['vendor.id'] && (
                    <FormHelperText error>{fieldErrors['vendor.id']}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Vendor Name *"
                      name="vendor_name"
                      value={newVendor.vendor_name}
                      onChange={handleNewVendorChange}
                      required
                      error={!!fieldErrors.vendor_name}
                      helperText={fieldErrors.vendor_name}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
                      <InputLabel>Vendor Type *</InputLabel>
                      <Select
                        name="vendor_type"
                        value={newVendor.vendor_type}
                        onChange={handleNewVendorChange}
                        label="Vendor Type *"
                      >
                        {vendorTypeOptions.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="GSTIN *"
                      name="gstin"
                      value={newVendor.gstin}
                      onChange={handleNewVendorChange}
                      required
                      error={!!fieldErrors.gstin}
                      helperText={fieldErrors.gstin}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="PAN"
                      name="pan"
                      value={newVendor.pan}
                      onChange={handleNewVendorChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="State *"
                      name="state"
                      value={newVendor.state}
                      onChange={handleNewVendorChange}
                      required
                      error={!!fieldErrors.state}
                      helperText={fieldErrors.state}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="State Code"
                      name="state_code"
                      value={newVendor.state_code}
                      onChange={handleNewVendorChange}
                      type="number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address *"
                      name="address"
                      value={newVendor.address}
                      onChange={handleNewVendorChange}
                      required
                      multiline
                      rows={2}
                      error={!!fieldErrors.address}
                      helperText={fieldErrors.address}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City"
                      name="city"
                      value={newVendor.city}
                      onChange={handleNewVendorChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Pincode"
                      name="pincode"
                      value={newVendor.pincode}
                      onChange={handleNewVendorChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Contact Person *"
                      name="contact_person"
                      value={newVendor.contact_person}
                      onChange={handleNewVendorChange}
                      required
                      error={!!fieldErrors.contact_person}
                      helperText={fieldErrors.contact_person}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Phone *"
                      name="phone"
                      value={newVendor.phone}
                      onChange={handleNewVendorChange}
                      required
                      error={!!fieldErrors.phone}
                      helperText={fieldErrors.phone}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email *"
                      name="email"
                      value={newVendor.email}
                      onChange={handleNewVendorChange}
                      required
                      type="email"
                      error={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                </Grid>
              )}
            </Paper>

            {/* Valid Till Date */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Quotation Validity
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Valid Till *"
                name="valid_till"
                type="date"
                value={formData.valid_till}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTodayDate() }}
                error={!!fieldErrors.valid_till}
                helperText={fieldErrors.valid_till}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Add Item Form */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Add New Item
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    size="small"
                    freeSolo
                    options={partNoOptions}
                    value={itemInput.part_no}
                    onChange={handlePartNoChange}
                    onInputChange={(event, newInputValue) => {
                      setItemInput(prev => ({ ...prev, part_no: newInputValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Part No *"
                        placeholder="Search or select part number"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                      />
                    )}
                    renderOption={renderOption}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Quantity *"
                    name="quantity"
                    value={itemInput.quantity}
                    onChange={handleItemInputChange}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddItem}
                    startIcon={<AddCircleIcon />}
                    disabled={!itemInput.part_no || !itemInput.quantity}
                    sx={{ height: '40px', borderRadius: 1 }}
                  >
                    Add
                  </Button>
                </Grid>
                {itemInput.part_name && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">
                      Selected: {itemInput.part_name}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Items List */}
            {formData.items.length > 0 ? (
              formData.items.map((item, itemIndex) => (
                <Paper key={itemIndex} sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600, fontSize: '0.9rem' }}>
                      Item {itemIndex + 1}: {item.part_no}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(itemIndex)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Part Name"
                        value={item.part_name || items.find(i => i.part_no === item.part_no)?.part_name || ''}
                        disabled
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, bgcolor: '#f5f5f5' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Quantity"
                        value={item.quantity}
                        disabled
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, bgcolor: '#f5f5f5' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenProcessDialog(itemIndex)}
                        sx={{ height: '40px', borderRadius: 1 }}
                      >
                        Add Process
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Costing Parameters */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 500, display: 'block', mb: 1 }}>
                      Costing Parameters
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="OHP % Material"
                          type="number"
                          value={item.costing_parameters.ohp_percent_on_material}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'ohp_percent_on_material', e.target.value)}
                          inputProps={{ min: 0, step: 0.1 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="OHP % Labour"
                          type="number"
                          value={item.costing_parameters.ohp_percent_on_labour}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'ohp_percent_on_labour', e.target.value)}
                          inputProps={{ min: 0, step: 0.1 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Inspection Cost"
                          type="number"
                          value={item.costing_parameters.inspection_cost_per_nos}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'inspection_cost_per_nos', e.target.value)}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Tool Maint."
                          type="number"
                          value={item.costing_parameters.tool_maintenance_cost_per_nos}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'tool_maintenance_cost_per_nos', e.target.value)}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Packing Cost"
                          type="number"
                          value={item.costing_parameters.packing_cost_per_nos}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'packing_cost_per_nos', e.target.value)}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Plating Cost"
                          type="number"
                          value={item.costing_parameters.plating_cost_per_kg}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'plating_cost_per_kg', e.target.value)}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Margin %"
                          type="number"
                          value={item.costing_parameters.margin_percent}
                          onChange={(e) => handleItemCostingParamChange(itemIndex, 'margin_percent', e.target.value)}
                          inputProps={{ min: 0, step: 0.1 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Processes */}
                  {item.processes.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 500, display: 'block', mb: 1 }}>
                        Processes
                      </Typography>
                      <Stack spacing={1}>
                        {item.processes.map((process, processIndex) => (
                          <Paper key={processIndex} sx={{ p: 1, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {process.process_name || getProcessName(process.process_id)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Rate: ₹{process.rate_per_hour}/hr • Hours: {process.hours} • Total: ₹{(process.rate_per_hour * process.hours).toFixed(2)}
                                </Typography>
                              </Box>
                              <IconButton size="small" onClick={() => handleRemoveProcessFromItem(itemIndex, processIndex)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Paper>
              ))
            ) : (
              <Paper sx={{ p: 3, backgroundColor: '#F8FAFC', borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  No items added yet. Add items using the form above.
                </Typography>
              </Paper>
            )}

            {fieldErrors.items && (
              <Alert severity="error" sx={{ borderRadius: 1 }}>{fieldErrors.items}</Alert>
            )}
            {fieldErrors.item_0_processes && (
              <Alert severity="error" sx={{ borderRadius: 1 }}>{fieldErrors.item_0_processes}</Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* Financials Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Financial Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GST Percentage (%)"
                    name="gst_percentage"
                    type="number"
                    value={formData.financials.gst_percentage}
                    onChange={handleFinancialsChange}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* ICC Section */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Investment & Cost of Capital (ICC)
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Credit on Input Days"
                    name="credit_on_input_days"
                    type="number"
                    value={formData.icc.credit_on_input_days}
                    onChange={handleICCChange}
                    helperText="Negative for credit received"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="WIP/FG Days"
                    name="wip_fg_days"
                    type="number"
                    value={formData.icc.wip_fg_days}
                    onChange={handleICCChange}
                    inputProps={{ min: 0 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Credit to Customer Days"
                    name="credit_to_customer_days"
                    type="number"
                    value={formData.icc.credit_to_customer_days}
                    onChange={handleICCChange}
                    inputProps={{ min: 0 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cost of Capital"
                    name="cost_of_capital"
                    type="number"
                    value={formData.icc.cost_of_capital}
                    onChange={handleICCChange}
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                    helperText="e.g., 0.10 for 10%"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Remarks */}
            <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Remarks
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Internal Remarks"
                    name="remarks.internal"
                    value={formData.remarks.internal}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    placeholder="Internal notes or instructions..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer Remarks"
                    name="remarks.customer"
                    value={formData.remarks.customer}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    placeholder="Message for the customer..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Review Summary */}
            <Paper sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Template</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {templates.find(t => t._id === formData.template_id)?.template_name || 'Not selected'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Vendor Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{vendorType}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Vendor</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {vendorType === 'Existing' 
                      ? vendors.find(v => v._id === formData.vendor.id)?.vendor_name || 'Not selected'
                      : newVendor.vendor_name || 'New vendor'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Valid Till</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formData.valid_till ? new Date(formData.valid_till).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Total Items</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.items.length}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>GST %</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.financials.gst_percentage}%</Typography>
                </Grid>
              </Grid>

              {formData.items.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>Items Summary</Typography>
                  {formData.items.map((item, idx) => (
                    <Paper key={idx} sx={{ p: 1, mb: 1, backgroundColor: '#FFFFFF' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.part_no}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Qty: {item.quantity} • Processes: {item.processes.length}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>

            <Alert severity="info" sx={{ borderRadius: 1 }}>
              <Typography variant="body2">
                Please review all information before submitting. You can go back to make changes if needed.
              </Typography>
            </Alert>
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
          Create New Quotation
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
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
              }}
            >
              {loading ? 'Creating...' : 'Create'}
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

      {/* Process Selection Dialog */}
      <Dialog open={openProcessDialog} onClose={handleCloseProcessDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ py: 1.5, px: 2, backgroundColor: '#F8FAFC' }}>
          <Typography variant="subtitle2" fontWeight={600}>Add Process to Item</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Process *</InputLabel>
              <Select
                name="process_id"
                value={currentProcessSelection.process_id}
                onChange={handleProcessSelectionChange}
                label="Select Process *"
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">
                  <em>Select a process</em>
                </MenuItem>
                {processes.map((process) => (
                  <MenuItem key={process._id} value={process._id}>
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="body2">{process.process_name}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={process.rate_type} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={process.vendor_or_inhouse || 'Vendor'} 
                          size="small"
                          color={process.vendor_or_inhouse === 'Vendor' ? 'warning' : 'info'}
                        />
                      </Stack>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Rate per Hour (₹) *"
              name="rate_per_hour"
              type="number"
              value={currentProcessSelection.rate_per_hour}
              onChange={handleProcessSelectionChange}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#64748B' }}>₹</Typography>
              }}
              sx={{ borderRadius: 1 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Hours *"
              name="hours"
              type="number"
              value={currentProcessSelection.hours}
              onChange={handleProcessSelectionChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ borderRadius: 1 }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Outsourced Vendor (Optional)</InputLabel>
              <Select
                name="outsourced_vendor_id"
                value={currentProcessSelection.outsourced_vendor_id || ''}
                onChange={handleProcessSelectionChange}
                label="Outsourced Vendor (Optional)"
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">
                  <em>None (In-house)</em>
                </MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor._id} value={vendor._id}>
                    {vendor.vendor_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5, borderTop: '1px solid #E0E0E0' }}>
          <Button onClick={handleCloseProcessDialog} size="small">Cancel</Button>
          <Button 
            onClick={handleAddProcessToItem} 
            variant="contained"
            disabled={!currentProcessSelection.process_id || !currentProcessSelection.rate_per_hour || !currentProcessSelection.hours}
            size="small"
          >
            Add Process
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AddQuotation;