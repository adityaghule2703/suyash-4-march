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
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormHelperText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  AddCircle as AddCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  ExpandMore as ExpandMoreIcon
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

// Template types
const TEMPLATE_TYPES = {
  BUSBAR: 'busbar',
  LANDED_COST: 'landed_cost',
  LASER_FABRICATION: 'laser_fabrication'
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
  const [customerType, setCustomerType] = useState('Existing');
  const [selectedTemplateType, setSelectedTemplateType] = useState(null);
  const [formData, setFormData] = useState({
    customer: {
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
      cost_of_capital: 0.10,
      plating_cost_per_kg: 70
    },
    items: []
  });
  
  const [newCustomer, setNewCustomer] = useState({
    customer_name: '',
    customer_type: 'Regular',
    gstin: '',
    contact_person: '',
    email: '',
    billing_address: {
      line1: '',
      city: '',
      state: '',
      state_code: '',
      pincode: ''
    }
  });
  
  // Common item fields
  const [itemInput, setItemInput] = useState({
    PartNo: '',
    Quantity: '',
    part_name: ''
  });
  
  // Busbar specific fields
  const [busbarItemInput, setBusbarItemInput] = useState({
    PartNo: '',
    Quantity: '',
    processes: []
  });
  
  // Laser fabrication specific fields
  const [laserItemInput, setLaserItemInput] = useState({
    PartNo: '',
    Quantity: '',
    path_length_sq_mm: '',
    laser_rate_per_sq_mm: '',
    start_points: '',
    start_point_rate: '',
    flatning_cost: '',
    bending_cost: '',
    fabrication_cost: ''
  });
  
  const [processes, setProcesses] = useState([]);
  const [selectedItemForProcess, setSelectedItemForProcess] = useState(null);
  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [currentProcessSelection, setCurrentProcessSelection] = useState({
    process_id: '',
    rate_per_hour: '',
    hours: '',
    machine: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Steps definition
  const steps = ['Template & Customer', 'Items & Processes', 'Financials & Review'];

  // Customer type options
  const customerTypeOptions = ['Regular', 'Premium', 'Wholesale', 'Retail', 'OEM'];

  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchItems();
      fetchProcesses();
      fetchTemplates();
    }
  }, [open]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const mappedCustomers = (response.data.data || []).map(customer => ({
          _id: customer._id,
          customer_name: customer.customer_name,
          customer_code: customer.customer_code,
          customer_id: customer.customer_id,
          customer_type: customer.customer_type,
          gstin: customer.gstin,
          billing_address: customer.billing_address,
          contacts: customer.contacts,
          pan: customer.pan,
          credit_limit: customer.credit_limit,
          credit_days: customer.credit_days,
          priority: customer.priority,
          is_export: customer.is_export,
          is_active: customer.is_active
        }));
        
        setCustomers(mappedCustomers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
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

  const handleTemplateChange = (event, newValue) => {
    setSelectedTemplate(newValue);
    setFieldErrors(prev => ({ ...prev, template_id: '' }));
    setFormData(prev => ({
      ...prev,
      template_id: newValue?._id || ''
    }));
    
    // Detect template type from template name or metadata
    if (newValue) {
      const templateName = newValue.template_name?.toLowerCase() || '';
      if (templateName.includes('busbar')) {
        setSelectedTemplateType(TEMPLATE_TYPES.BUSBAR);
      } else if (templateName.includes('landed') || templateName.includes('cost')) {
        setSelectedTemplateType(TEMPLATE_TYPES.LANDED_COST);
      } else if (templateName.includes('laser') || templateName.includes('fabrication')) {
        setSelectedTemplateType(TEMPLATE_TYPES.LASER_FABRICATION);
      } else {
        setSelectedTemplateType(null);
      }
      
      // Reset items when template changes
      setFormData(prev => ({ ...prev, items: [] }));
    }
  };

  const handleCustomerTypeChange = (event) => {
    const type = event.target.value;
    setCustomerType(type);
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, type }
    }));
  };

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setFieldErrors(prev => ({ ...prev, 'customer.id': '' }));
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, id: newValue?._id || '' }
    }));
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('billing_address.')) {
      const field = name.split('.')[1];
      setNewCustomer(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [field]: value
        }
      }));
    } else {
      setNewCustomer(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handlePartNoChange = (event, value) => {
    if (value) {
      const selectedItem = items.find(item => item.part_no === value);
      setItemInput(prev => ({
        ...prev,
        PartNo: value,
        part_name: selectedItem ? selectedItem.part_name : ''
      }));
      
      if (selectedTemplateType === TEMPLATE_TYPES.BUSBAR) {
        setBusbarItemInput(prev => ({
          ...prev,
          PartNo: value,
          part_name: selectedItem ? selectedItem.part_name : ''
        }));
      } else if (selectedTemplateType === TEMPLATE_TYPES.LASER_FABRICATION) {
        setLaserItemInput(prev => ({
          ...prev,
          PartNo: value,
          part_name: selectedItem ? selectedItem.part_name : ''
        }));
      }
    } else {
      setItemInput(prev => ({
        ...prev,
        PartNo: '',
        part_name: ''
      }));
    }
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBusbarItemChange = (e) => {
    const { name, value } = e.target;
    setBusbarItemInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLaserItemChange = (e) => {
    const { name, value } = e.target;
    setLaserItemInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBusbarItem = () => {
    if (!busbarItemInput.PartNo || !busbarItemInput.Quantity || parseInt(busbarItemInput.Quantity) <= 0) {
      setError('Please enter valid Part No and Quantity');
      return;
    }

    const selectedItem = items.find(item => item.part_no === busbarItemInput.PartNo);
    if (!selectedItem) {
      setError('Selected Part No not found in items list');
      return;
    }

    const newItem = {
      PartNo: busbarItemInput.PartNo,
      Quantity: parseInt(busbarItemInput.Quantity),
      processes: busbarItemInput.processes || [],
      costing_parameters: {
        margin_percent: 15
      }
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setBusbarItemInput({ PartNo: '', Quantity: '', processes: [], part_name: '' });
    setError('');
  };

  const handleAddLaserItem = () => {
    if (!laserItemInput.PartNo || !laserItemInput.Quantity || parseInt(laserItemInput.Quantity) <= 0) {
      setError('Please enter valid Part No and Quantity');
      return;
    }

    const selectedItem = items.find(item => item.part_no === laserItemInput.PartNo);
    if (!selectedItem) {
      setError('Selected Part No not found in items list');
      return;
    }

    const newItem = {
      PartNo: laserItemInput.PartNo,
      Quantity: parseInt(laserItemInput.Quantity),
      path_length_sq_mm: parseFloat(laserItemInput.path_length_sq_mm) || 0,
      laser_rate_per_sq_mm: parseFloat(laserItemInput.laser_rate_per_sq_mm) || 0,
      start_points: parseInt(laserItemInput.start_points) || 0,
      start_point_rate: parseFloat(laserItemInput.start_point_rate) || 0,
      flatning_cost: parseFloat(laserItemInput.flatning_cost) || 0,
      bending_cost: parseFloat(laserItemInput.bending_cost) || 0,
      fabrication_cost: parseFloat(laserItemInput.fabrication_cost) || 0,
      costing_parameters: {
        margin_percent: 15
      }
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setLaserItemInput({
      PartNo: '',
      Quantity: '',
      path_length_sq_mm: '',
      laser_rate_per_sq_mm: '',
      start_points: '',
      start_point_rate: '',
      flatning_cost: '',
      bending_cost: '',
      fabrication_cost: '',
      part_name: ''
    });
    setError('');
  };

  const handleAddItem = () => {
    if (!itemInput.PartNo || !itemInput.Quantity || parseInt(itemInput.Quantity) <= 0) {
      setError('Please enter valid Part No and Quantity');
      return;
    }

    const selectedItem = items.find(item => item.part_no === itemInput.PartNo);
    if (!selectedItem) {
      setError('Selected Part No not found in items list');
      return;
    }

    const newItem = {
      PartNo: itemInput.PartNo,
      Quantity: parseInt(itemInput.Quantity),
      processes: [],
      costing_parameters: {
        margin_percent: 15,
        ohp_percent_on_material: 10
      }
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setItemInput({ PartNo: '', Quantity: '', part_name: '' });
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
    if (!updatedItems[itemIndex].costing_parameters) {
      updatedItems[itemIndex].costing_parameters = {};
    }
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
      machine: ''
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
      machine: ''
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

    const itemProcesses = formData.items[selectedItemForProcess].processes || [];
    if (itemProcesses.some(p => p.process_id === currentProcessSelection.process_id)) {
      setError('This process has already been added to the item');
      return;
    }

    const updatedItems = [...formData.items];
    const processToAdd = {
      process_id: currentProcessSelection.process_id,
      rate_per_hour: parseFloat(currentProcessSelection.rate_per_hour),
      hours: parseFloat(currentProcessSelection.hours)
    };
    
    if (currentProcessSelection.machine) {
      processToAdd.machine = currentProcessSelection.machine;
    }
    
    if (!updatedItems[selectedItemForProcess].processes) {
      updatedItems[selectedItemForProcess].processes = [];
    }
    updatedItems[selectedItemForProcess].processes.push(processToAdd);

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
      if (customerType === 'Existing' && !formData.customer.id) {
        errors['customer.id'] = 'Please select a customer';
      }
      if (customerType === 'New') {
        if (!newCustomer.customer_name?.trim()) errors.customer_name = 'Customer name is required';
        if (!newCustomer.gstin?.trim()) errors.gstin = 'GSTIN is required';
        if (!newCustomer.contact_person?.trim()) errors.contact_person = 'Contact person is required';
        if (!newCustomer.email?.trim()) errors.email = 'Email is required';
        if (!newCustomer.billing_address?.line1?.trim()) errors['billing_address.line1'] = 'Address is required';
        if (!newCustomer.billing_address?.city?.trim()) errors['billing_address.city'] = 'City is required';
        if (!newCustomer.billing_address?.state?.trim()) errors['billing_address.state'] = 'State is required';
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

  const buildPayload = () => {
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
      items: formData.items.map(item => {
        const baseItem = {
          PartNo: item.PartNo,
          Quantity: parseInt(item.Quantity) || 0,
          costing_parameters: {
            margin_percent: parseFloat(item.costing_parameters?.margin_percent) || 15
          }
        };

        // Add template-specific fields
        if (selectedTemplateType === TEMPLATE_TYPES.BUSBAR) {
          if (item.processes && item.processes.length > 0) {
            baseItem.processes = item.processes.map(process => ({
              process_id: process.process_id,
              rate_per_hour: parseFloat(process.rate_per_hour) || 0,
              hours: parseFloat(process.hours) || 0,
              machine: process.machine || ''
            }));
          }
          if (item.costing_parameters?.ohp_percent_on_material) {
            baseItem.costing_parameters.ohp_percent_on_material = parseFloat(item.costing_parameters.ohp_percent_on_material);
          }
        } else if (selectedTemplateType === TEMPLATE_TYPES.LANDED_COST) {
          if (item.processes && item.processes.length > 0) {
            baseItem.processes = item.processes.map(process => ({
              process_id: process.process_id,
              rate_per_hour: parseFloat(process.rate_per_hour) || 0,
              hours: parseFloat(process.hours) || 0
            }));
          }
          if (item.costing_parameters?.ohp_percent_on_material) {
            baseItem.costing_parameters.ohp_percent_on_material = parseFloat(item.costing_parameters.ohp_percent_on_material);
          }
        } else if (selectedTemplateType === TEMPLATE_TYPES.LASER_FABRICATION) {
          baseItem.path_length_sq_mm = parseFloat(item.path_length_sq_mm) || 0;
          baseItem.laser_rate_per_sq_mm = parseFloat(item.laser_rate_per_sq_mm) || 0;
          baseItem.start_points = parseInt(item.start_points) || 0;
          baseItem.start_point_rate = parseFloat(item.start_point_rate) || 0;
          baseItem.flatning_cost = parseFloat(item.flatning_cost) || 0;
          baseItem.bending_cost = parseFloat(item.bending_cost) || 0;
          baseItem.fabrication_cost = parseFloat(item.fabrication_cost) || 0;
        }

        return baseItem;
      })
    };

    // Add ICC for landed cost template
    if (selectedTemplateType === TEMPLATE_TYPES.LANDED_COST) {
      payload.icc = {
        credit_on_input_days: parseInt(formData.icc.credit_on_input_days) || -30,
        wip_fg_days: parseInt(formData.icc.wip_fg_days) || 30,
        credit_to_customer_days: parseInt(formData.icc.credit_to_customer_days) || 45,
        cost_of_capital: parseFloat(formData.icc.cost_of_capital) || 0.10,
        plating_cost_per_kg: parseFloat(formData.icc.plating_cost_per_kg) || 70
      };
    }

    // Set customer based on type
    if (customerType === 'Existing') {
      payload.customer = {
        type: 'Existing',
        id: formData.customer.id
      };
    } else {
      payload.customer = {
        type: 'New',
        new: {
          customer_name: newCustomer.customer_name,
          customer_type: newCustomer.customer_type || 'Regular',
          gstin: newCustomer.gstin,
          contact_person: newCustomer.contact_person,
          email: newCustomer.email,
          billing_address: {
            line1: newCustomer.billing_address.line1,
            city: newCustomer.billing_address.city,
            state: newCustomer.billing_address.state,
            state_code: newCustomer.billing_address.state_code ? parseInt(newCustomer.billing_address.state_code) : null,
            pincode: newCustomer.billing_address.pincode || ''
          }
        }
      };
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    const payload = buildPayload();

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
    setCustomerType('Existing');
    setSelectedTemplateType(null);
    setFormData({
      customer: {
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
        cost_of_capital: 0.10,
        plating_cost_per_kg: 70
      },
      items: []
    });
    setNewCustomer({
      customer_name: '',
      customer_type: 'Regular',
      gstin: '',
      contact_person: '',
      email: '',
      billing_address: {
        line1: '',
        city: '',
        state: '',
        state_code: '',
        pincode: ''
      }
    });
    setSelectedTemplate(null);
    setSelectedCustomer(null);
    setItemInput({ PartNo: '', Quantity: '', part_name: '' });
    setBusbarItemInput({ PartNo: '', Quantity: '', processes: [], part_name: '' });
    setLaserItemInput({
      PartNo: '',
      Quantity: '',
      path_length_sq_mm: '',
      laser_rate_per_sq_mm: '',
      start_points: '',
      start_point_rate: '',
      flatning_cost: '',
      bending_cost: '',
      fabrication_cost: '',
      part_name: ''
    });
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

  const renderCustomerOption = (props, option) => (
    <li {...props}>
      <Box>
        <Typography sx={{ fontSize: '0.75rem' }}>{option.customer_name}</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
          {option.gstin} • {option.customer_code}
        </Typography>
      </Box>
    </li>
  );

  const renderItemForm = () => {
    if (!selectedTemplateType) {
      return (
        <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            Please select a template first to configure items
          </Typography>
        </Box>
      );
    }

    if (selectedTemplateType === TEMPLATE_TYPES.BUSBAR) {
      return (
        <Stack spacing={2.5}>
          {/* Add Item Form for Busbar */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Add Busbar Item
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    PART NO <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    options={partNoOptions}
                    value={busbarItemInput.PartNo}
                    onChange={handlePartNoChange}
                    onInputChange={(event, newInputValue) => {
                      setBusbarItemInput(prev => ({ ...prev, PartNo: newInputValue }));
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
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="Quantity"
                    value={busbarItemInput.Quantity}
                    onChange={handleBusbarItemChange}
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
                    onClick={handleAddBusbarItem}
                    startIcon={<AddCircleIcon sx={{ fontSize: '1rem' }} />}
                    disabled={!busbarItemInput.PartNo || !busbarItemInput.Quantity}
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
                    Add Item
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Items List */}
          {renderItemsList()}
        </Stack>
      );
    }

    if (selectedTemplateType === TEMPLATE_TYPES.LASER_FABRICATION) {
      return (
        <Stack spacing={2.5}>
          {/* Add Item Form for Laser Fabrication */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Add Laser Fabrication Item
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    PART NO <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    options={partNoOptions}
                    value={laserItemInput.PartNo}
                    onChange={handlePartNoChange}
                    onInputChange={(event, newInputValue) => {
                      setLaserItemInput(prev => ({ ...prev, PartNo: newInputValue }));
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
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="Quantity"
                    value={laserItemInput.Quantity}
                    onChange={handleLaserItemChange}
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
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddLaserItem}
                    startIcon={<AddCircleIcon sx={{ fontSize: '1rem' }} />}
                    disabled={!laserItemInput.PartNo || !laserItemInput.Quantity}
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
                    Add Item
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={1.5} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Path Length (sq mm)"
                  name="path_length_sq_mm"
                  value={laserItemInput.path_length_sq_mm}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Laser Rate (per sq mm)"
                  name="laser_rate_per_sq_mm"
                  value={laserItemInput.laser_rate_per_sq_mm}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Points"
                  name="start_points"
                  value={laserItemInput.start_points}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Point Rate"
                  name="start_point_rate"
                  value={laserItemInput.start_point_rate}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Flattening Cost"
                  name="flatning_cost"
                  value={laserItemInput.flatning_cost}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bending Cost"
                  name="bending_cost"
                  value={laserItemInput.bending_cost}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fabrication Cost"
                  name="fabrication_cost"
                  value={laserItemInput.fabrication_cost}
                  onChange={handleLaserItemChange}
                  type="number"
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
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Items List */}
          {renderItemsList()}
        </Stack>
      );
    }

    // Default item form for landed cost
    return (
      <Stack spacing={2.5}>
        {/* Add Item Form */}
        <Box>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
            Add Item
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
                  value={itemInput.PartNo}
                  onChange={handlePartNoChange}
                  onInputChange={(event, newInputValue) => {
                    setItemInput(prev => ({ ...prev, PartNo: newInputValue }));
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
                  name="Quantity"
                  value={itemInput.Quantity}
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
                  disabled={!itemInput.PartNo || !itemInput.Quantity}
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
                  Add Item
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Items List */}
        {renderItemsList()}
      </Stack>
    );
  };

  const renderItemsList = () => {
    if (formData.items.length === 0) {
      return (
        <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            No items added yet. Add items using the form above.
          </Typography>
        </Box>
      );
    }

    return formData.items.map((item, itemIndex) => (
      <Box key={itemIndex}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary }}>
            Item {itemIndex + 1}: {item.PartNo}
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
                value={item.part_name || items.find(i => i.part_no === item.PartNo)?.part_name || ''}
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
                value={item.Quantity}
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
          
          {/* Show Add Process button only for busbar and landed cost templates */}
          {(selectedTemplateType === TEMPLATE_TYPES.BUSBAR || selectedTemplateType === TEMPLATE_TYPES.LANDED_COST) && (
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
          )}
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
                label="Margin %"
                type="number"
                value={item.costing_parameters?.margin_percent || 15}
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
            
            {/* Show additional costing parameters for landed cost template */}
            {(selectedTemplateType === TEMPLATE_TYPES.LANDED_COST || selectedTemplateType === TEMPLATE_TYPES.BUSBAR) && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="OHP % on Material"
                  type="number"
                  value={item.costing_parameters?.ohp_percent_on_material || 10}
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
            )}
            
            {/* Show laser specific fields */}
            {selectedTemplateType === TEMPLATE_TYPES.LASER_FABRICATION && (
              <>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Path Length (sq mm)"
                    value={item.path_length_sq_mm || 0}
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
                        fontSize: '0.75rem'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Laser Rate"
                    value={item.laser_rate_per_sq_mm || 0}
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
                        fontSize: '0.75rem'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Start Points"
                    value={item.start_points || 0}
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
                        fontSize: '0.75rem'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Fabrication Cost"
                    value={item.fabrication_cost || 0}
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
                        fontSize: '0.75rem'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {/* Processes */}
        {item.processes && item.processes.length > 0 && (
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
                        {process.machine && ` • Machine: ${process.machine}`}
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
    ));
  };

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

            {/* Customer Type Selection */}
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Customer Details
              </Typography>
              
              <RadioGroup row value={customerType} onChange={handleCustomerTypeChange} sx={{ mb: 1.5 }}>
                <FormControlLabel 
                  value="Existing" 
                  control={<Radio size="small" />} 
                  label={<Typography sx={{ fontSize: '0.75rem' }}>Existing Customer</Typography>} 
                />
                <FormControlLabel 
                  value="New" 
                  control={<Radio size="small" />} 
                  label={<Typography sx={{ fontSize: '0.75rem' }}>New Customer</Typography>} 
                />
              </RadioGroup>

              {customerType === 'Existing' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    SELECT CUSTOMER <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={customers}
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                    getOptionLabel={(option) => option.customer_name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select customer"
                        required
                        error={!!fieldErrors['customer.id']}
                        helperText={fieldErrors['customer.id']}
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
                    renderOption={renderCustomerOption}
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
                        CUSTOMER NAME <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="customer_name"
                        value={newCustomer.customer_name}
                        onChange={handleNewCustomerChange}
                        required
                        error={!!fieldErrors.customer_name}
                        helperText={fieldErrors.customer_name}
                        placeholder="Enter customer name"
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
                        CUSTOMER TYPE
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={customerTypeOptions}
                        value={newCustomer.customer_type}
                        onChange={(event, newValue) => {
                          setNewCustomer(prev => ({ ...prev, customer_type: newValue || 'Regular' }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select customer type"
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
                        value={newCustomer.gstin}
                        onChange={handleNewCustomerChange}
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
                        CONTACT PERSON <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="contact_person"
                        value={newCustomer.contact_person}
                        onChange={handleNewCustomerChange}
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
                        EMAIL <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="email"
                        value={newCustomer.email}
                        onChange={handleNewCustomerChange}
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
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        ADDRESS <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="billing_address.line1"
                        value={newCustomer.billing_address.line1}
                        onChange={handleNewCustomerChange}
                        required
                        multiline
                        rows={2}
                        error={!!fieldErrors['billing_address.line1']}
                        helperText={fieldErrors['billing_address.line1']}
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
                        CITY <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="billing_address.city"
                        value={newCustomer.billing_address.city}
                        onChange={handleNewCustomerChange}
                        required
                        error={!!fieldErrors['billing_address.city']}
                        helperText={fieldErrors['billing_address.city']}
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
                        STATE <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="billing_address.state"
                        value={newCustomer.billing_address.state}
                        onChange={handleNewCustomerChange}
                        required
                        error={!!fieldErrors['billing_address.state']}
                        helperText={fieldErrors['billing_address.state']}
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
                        name="billing_address.state_code"
                        value={newCustomer.billing_address.state_code}
                        onChange={handleNewCustomerChange}
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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        PINCODE
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="billing_address.pincode"
                        value={newCustomer.billing_address.pincode}
                        onChange={handleNewCustomerChange}
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
        return renderItemForm();

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

            {/* ICC Section - Only for Landed Cost template */}
            {selectedTemplateType === TEMPLATE_TYPES.LANDED_COST && (
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
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        PLATING COST (per kg)
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="plating_cost_per_kg"
                        type="number"
                        value={formData.icc.plating_cost_per_kg}
                        onChange={handleICCChange}
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
                  </Grid>
                </Grid>
              </Box>
            )}

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
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Customer Type</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{customerType}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, display: 'block' }}>Customer</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    {customerType === 'Existing' 
                      ? selectedCustomer?.customer_name || 'Not selected'
                      : newCustomer.customer_name || 'New customer'}
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
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.PartNo}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                        Qty: {item.Quantity} • Processes: {item.processes?.length || 0}
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
                MACHINE (Optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="machine"
                value={currentProcessSelection.machine}
                onChange={handleProcessFieldChange}
                placeholder="Enter machine name"
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