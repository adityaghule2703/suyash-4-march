import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Radio,
  RadioGroup,
  Autocomplete,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  styled
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

// 🔥 Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
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
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Steps definition
  const steps = ['Template & Vendor', 'Items & Processes', 'Financials & Review'];

  // Vendor type options
  const vendorTypeOptions = ['RM', 'Process', 'Both'];

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

  const handleTemplateChange = (event, newValue) => {
    setSelectedTemplate(newValue);
    setFieldErrors(prev => ({ ...prev, template_id: '' }));
    setFormData(prev => ({
      ...prev,
      template_id: newValue?._id || ''
    }));
  };

  const handleVendorChange = (event, newValue) => {
    setSelectedVendor(newValue);
    setFieldErrors(prev => ({ ...prev, 'vendor.id': '' }));
    setFormData(prev => ({
      ...prev,
      vendor: { ...prev.vendor, id: newValue?._id || '' }
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

  const handleProcessSelectionChange = (event, newValue) => {
    if (newValue) {
      setCurrentProcessSelection(prev => ({
        ...prev,
        process_id: newValue._id
      }));
    } else {
      setCurrentProcessSelection(prev => ({
        ...prev,
        process_id: ''
      }));
    }
  };

  const handleProcessFieldChange = (e) => {
    const { name, value } = e.target;
    setCurrentProcessSelection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOutsourcedVendorChange = (event, newValue) => {
    setCurrentProcessSelection(prev => ({
      ...prev,
      outsourced_vendor_id: newValue?._id || null
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
        id: formData.vendor.id
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
      
      if (newVendor.city) payload.vendor.new.city = newVendor.city;
      if (newVendor.pincode) payload.vendor.new.pincode = newVendor.pincode;
    }

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
    setSelectedTemplate(null);
    setSelectedVendor(null);
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

  const renderItemOption = (props, option) => {
    const item = items.find(i => i.part_no === option);
    const { key, ...otherProps } = props;
    
    return (
      <li key={key} {...otherProps}>
        <Box>
          <Typography sx={{ fontSize: '0.75rem' }}>{option}</Typography>
          {item && (
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
              {item.part_name} • {item.unit || 'No unit'}
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  const renderProcessOption = (props, option) => (
    <li {...props}>
      <Box>
        <Typography sx={{ fontSize: '0.75rem' }}>{option.process_name}</Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
          <Chip 
            label={option.rate_type} 
            size="small" 
            variant="outlined"
            sx={{ fontSize: '0.65rem', height: 20 }}
          />
          <Chip 
            label={option.vendor_or_inhouse || 'Vendor'} 
            size="small"
            color={option.vendor_or_inhouse === 'Vendor' ? 'warning' : 'info'}
            sx={{ fontSize: '0.65rem', height: 20 }}
          />
        </Box>
      </Box>
    </li>
  );

  const renderVendorOption = (props, option) => (
    <li {...props}>
      <Box>
        <Typography sx={{ fontSize: '0.75rem' }}>{option.vendor_name}</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
          {option.gstin} • {option.vendor_code}
        </Typography>
      </Box>
    </li>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Template Selection */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Template Selection
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  SELECT TEMPLATE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={templates}
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  getOptionLabel={(option) => option.template_name || ''}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select template"
                      required
                      error={!!fieldErrors.template_id}
                      helperText={fieldErrors.template_id}
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
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.65rem',
                          marginLeft: 0,
                          marginTop: 0.25
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography sx={{ fontSize: '0.75rem' }}>{option.template_name}</Typography>
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.75rem',
                        py: 1,
                        px: 1.5
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Vendor Type Selection */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Vendor Details
              </Typography>
              
              <RadioGroup row value={vendorType} onChange={handleVendorTypeChange} sx={{ mb: 1.5 }}>
                <FormControlLabel 
                  value="Existing" 
                  control={<Radio size="small" />} 
                  label={<Typography sx={{ fontSize: '0.75rem' }}>Existing Vendor</Typography>} 
                />
                <FormControlLabel 
                  value="New" 
                  control={<Radio size="small" />} 
                  label={<Typography sx={{ fontSize: '0.75rem' }}>New Vendor</Typography>} 
                />
              </RadioGroup>

              {vendorType === 'Existing' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    SELECT VENDOR <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={vendors}
                    value={selectedVendor}
                    onChange={handleVendorChange}
                    getOptionLabel={(option) => option.vendor_name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select vendor"
                        required
                        error={!!fieldErrors['vendor.id']}
                        helperText={fieldErrors['vendor.id']}
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    )}
                    renderOption={renderVendorOption}
                    ListboxProps={{
                      sx: {
                        '& .MuiAutocomplete-option': {
                          fontSize: '0.75rem',
                          py: 1,
                          px: 1.5
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        VENDOR NAME <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="vendor_name"
                        value={newVendor.vendor_name}
                        onChange={handleNewVendorChange}
                        required
                        error={!!fieldErrors.vendor_name}
                        helperText={fieldErrors.vendor_name}
                        placeholder="Enter vendor name"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        VENDOR TYPE <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={vendorTypeOptions}
                        value={newVendor.vendor_type}
                        onChange={(event, newValue) => {
                          setNewVendor(prev => ({ ...prev, vendor_type: newValue || 'RM' }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select vendor type"
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
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Typography sx={{ fontSize: '0.75rem' }}>{option}</Typography>
                          </li>
                        )}
                        ListboxProps={{
                          sx: {
                            '& .MuiAutocomplete-option': {
                              fontSize: '0.75rem',
                              py: 1,
                              px: 1.5
                            }
                          }
                        }}
                      />
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
                        value={newVendor.gstin}
                        onChange={handleNewVendorChange}
                        required
                        error={!!fieldErrors.gstin}
                        helperText={fieldErrors.gstin}
                        placeholder="Enter GSTIN"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        PAN
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="pan"
                        value={newVendor.pan}
                        onChange={handleNewVendorChange}
                        placeholder="Enter PAN"
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
                        value={newVendor.state}
                        onChange={handleNewVendorChange}
                        required
                        error={!!fieldErrors.state}
                        helperText={fieldErrors.state}
                        placeholder="Enter state"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        STATE CODE
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="state_code"
                        value={newVendor.state_code}
                        onChange={handleNewVendorChange}
                        type="number"
                        placeholder="Enter state code"
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
                        value={newVendor.address}
                        onChange={handleNewVendorChange}
                        required
                        multiline
                        rows={2}
                        error={!!fieldErrors.address}
                        helperText={fieldErrors.address}
                        placeholder="Enter address"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        CITY
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="city"
                        value={newVendor.city}
                        onChange={handleNewVendorChange}
                        placeholder="Enter city"
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
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        PINCODE
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="pincode"
                        value={newVendor.pincode}
                        onChange={handleNewVendorChange}
                        placeholder="Enter pincode"
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
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        CONTACT PERSON <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="contact_person"
                        value={newVendor.contact_person}
                        onChange={handleNewVendorChange}
                        required
                        error={!!fieldErrors.contact_person}
                        helperText={fieldErrors.contact_person}
                        placeholder="Enter contact person"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
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
                        value={newVendor.phone}
                        onChange={handleNewVendorChange}
                        required
                        error={!!fieldErrors.phone}
                        helperText={fieldErrors.phone}
                        placeholder="Enter phone number"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        EMAIL <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="email"
                        value={newVendor.email}
                        onChange={handleNewVendorChange}
                        required
                        type="email"
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                        placeholder="Enter email"
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
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.65rem',
                            marginLeft: 0,
                            marginTop: 0.25
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>

            {/* Valid Till Date */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Quotation Validity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  VALID TILL <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="valid_till"
                  type="date"
                  value={formData.valid_till}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!fieldErrors.valid_till}
                  helperText={fieldErrors.valid_till}
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
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.65rem',
                      marginLeft: 0,
                      marginTop: 0.25
                    }
                  }}
                />
              </Box>
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            {/* Add Item Form */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Add New Item
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PART NO <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
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
                          size="small"
                          placeholder="Search or select part number"
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
                      renderOption={renderItemOption}
                      ListboxProps={{
                        sx: {
                          '& .MuiAutocomplete-option': {
                            fontSize: '0.75rem',
                            py: 1,
                            px: 1.5
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="quantity"
                      value={itemInput.quantity}
                      onChange={handleItemInputChange}
                      type="number"
                      inputProps={{ min: 1 }}
                      placeholder="Enter quantity"
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
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddItem}
                      startIcon={<AddCircleIcon sx={{ fontSize: '1rem' }} />}
                      disabled={!itemInput.part_no || !itemInput.quantity}
                      sx={{
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: COLORS.primary,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': { bgcolor: COLORS.primaryDark },
                        '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
                {itemInput.part_name && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Selected: {itemInput.part_name}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Items List */}
            {formData.items.length > 0 ? (
              formData.items.map((item, itemIndex) => (
                <Box key={itemIndex}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary }}>
                      Item {itemIndex + 1}: {item.part_no}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(itemIndex)} sx={{ color: '#EF4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          PART NAME
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.part_name || items.find(i => i.part_no === item.part_no)?.part_name || ''}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.light
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          QUANTITY
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.quantity}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: COLORS.background.light
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                          onClick={() => handleOpenProcessDialog(itemIndex)}
                          sx={{
                            height: 36,
                            borderRadius: 1.5,
                            borderColor: COLORS.primary,
                            color: COLORS.primary,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: COLORS.primaryDark,
                              bgcolor: COLORS.primaryLight
                            }
                          }}
                        >
                          Add Process
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Costing Parameters */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 1 }}>
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
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
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Processes */}
                  {item.processes.length > 0 && (
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 1 }}>
                        Processes
                      </Typography>
                      <Stack spacing={1}>
                        {item.processes.map((process, processIndex) => (
                          <Box key={processIndex} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                  {process.process_name || getProcessName(process.process_id)}
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                  Rate: ₹{process.rate_per_hour}/hr • Hours: {process.hours} • Total: ₹{(process.rate_per_hour * process.hours).toFixed(2)}
                                </Typography>
                              </Box>
                              <IconButton size="small" onClick={() => handleRemoveProcessFromItem(itemIndex, processIndex)} sx={{ color: '#EF4444' }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                  No items added yet. Add items using the form above.
                </Typography>
              </Box>
            )}

            {fieldErrors.items && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
                {fieldErrors.items}
              </Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            {/* Financials Section */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Financial Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GST PERCENTAGE (%)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="gst_percentage"
                      type="number"
                      value={formData.financials.gst_percentage}
                      onChange={handleFinancialsChange}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
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
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* ICC Section */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Investment & Cost of Capital (ICC)
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CREDIT ON INPUT DAYS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="credit_on_input_days"
                      type="number"
                      value={formData.icc.credit_on_input_days}
                      onChange={handleICCChange}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Negative for credit received
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      WIP/FG DAYS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="wip_fg_days"
                      type="number"
                      value={formData.icc.wip_fg_days}
                      onChange={handleICCChange}
                      inputProps={{ min: 0 }}
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
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CREDIT TO CUSTOMER DAYS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="credit_to_customer_days"
                      type="number"
                      value={formData.icc.credit_to_customer_days}
                      onChange={handleICCChange}
                      inputProps={{ min: 0 }}
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
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COST OF CAPITAL
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="cost_of_capital"
                      type="number"
                      value={formData.icc.cost_of_capital}
                      onChange={handleICCChange}
                      inputProps={{ min: 0, max: 1, step: 0.01 }}
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
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      e.g., 0.10 for 10%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Remarks */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Remarks
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      INTERNAL REMARKS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="remarks.internal"
                      value={formData.remarks.internal}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      placeholder="Internal notes or instructions..."
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
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER REMARKS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="remarks.customer"
                      value={formData.remarks.customer}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      placeholder="Message for the customer..."
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
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Review Summary */}
            <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Template</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    {selectedTemplate?.template_name || 'Not selected'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Vendor Type</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{vendorType}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Vendor</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    {vendorType === 'Existing' 
                      ? selectedVendor?.vendor_name || 'Not selected'
                      : newVendor.vendor_name || 'New vendor'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Valid Till</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    {formData.valid_till ? new Date(formData.valid_till).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1, borderColor: COLORS.border }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Total Items</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formData.items.length}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>GST %</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{formData.financials.gst_percentage}%</Typography>
                </Grid>
              </Grid>

              {formData.items.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block', mb: 1 }}>Items Summary</Typography>
                  {formData.items.map((item, idx) => (
                    <Box key={idx} sx={{ p: 1, mb: 1, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.part_no}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                        Qty: {item.quantity} • Processes: {item.processes.length}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem' }}>
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
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Create New Quotation
        </Typography>

        {/* 🔥 Modern Stepper with Gradient Connector */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              '& .MuiAlert-icon': {
                fontSize: '1.25rem',
                alignItems: 'center'
              },
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
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Button
          onClick={handleBack}
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
            },
            '&:disabled': {
              borderColor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon sx={{ fontSize: '1rem' }} />}
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
                },
                '&:disabled': {
                  bgcolor: COLORS.border,
                  color: COLORS.text.tertiary
                }
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
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
                },
                '&:disabled': {
                  bgcolor: COLORS.border,
                  color: COLORS.text.tertiary
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>

      {/* Process Selection Dialog */}
      <Dialog open={openProcessDialog} onClose={handleCloseProcessDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ py: 1.5, px: 2.5, bgcolor: COLORS.background.white }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Add Process to Item
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                SELECT PROCESS <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Autocomplete
                fullWidth
                options={processes}
                value={processes.find(p => p._id === currentProcessSelection.process_id) || null}
                onChange={handleProcessSelectionChange}
                getOptionLabel={(option) => option.process_name || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search or select process"
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
                renderOption={renderProcessOption}
                ListboxProps={{
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: '0.75rem',
                      py: 1,
                      px: 1.5
                    }
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                RATE PER HOUR (₹) <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="rate_per_hour"
                type="number"
                value={currentProcessSelection.rate_per_hour}
                onChange={handleProcessFieldChange}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mr: 0.5 }}>₹</Typography>
                }}
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
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                HOURS <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="hours"
                type="number"
                value={currentProcessSelection.hours}
                onChange={handleProcessFieldChange}
                inputProps={{ min: 0, step: 0.01 }}
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
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                OUTSOURCED VENDOR (Optional)
              </Typography>
              <Autocomplete
                fullWidth
                options={vendors}
                value={vendors.find(v => v._id === currentProcessSelection.outsourced_vendor_id) || null}
                onChange={handleOutsourcedVendorChange}
                getOptionLabel={(option) => option.vendor_name || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select outsourced vendor"
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
                renderOption={renderVendorOption}
                ListboxProps={{
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: '0.75rem',
                      py: 1,
                      px: 1.5
                    }
                  }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
          <Button 
            onClick={handleCloseProcessDialog} 
            size="small"
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
            onClick={handleAddProcessToItem} 
            variant="contained"
            disabled={!currentProcessSelection.process_id || !currentProcessSelection.rate_per_hour || !currentProcessSelection.hours}
            size="small"
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
            Add Process
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AddQuotation;