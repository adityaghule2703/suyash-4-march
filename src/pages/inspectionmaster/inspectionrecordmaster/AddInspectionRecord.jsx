// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Divider,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   styled,
//   CircularProgress,
//   Chip,
//   Autocomplete,
//   Tooltip,
//   IconButton
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Assignment as RecordIcon,
//   Inventory as InventoryIcon,
//   People as PeopleIcon,
//   Business as BusinessIcon,
//   QrCode as QrCodeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC'
//   },
//   border: '#E3E8EF'
// };

// // Modern Stepper Connector
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundColor: COLORS.primary,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 2,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// // Enums
// const INSPECTION_TYPE_OPTIONS = [
//   'Incoming', 'First Article', 'In-Process', 'Final', 
//   'Pre-Dispatch', 'Customer Audit', 'Periodic', 'Concession Review'
// ];

// const steps = ['Basic Information', 'Inspection Details'];

// const AddInspectionRecord = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
  
//   // Data fetching states
//   const [inspectionPlans, setInspectionPlans] = useState([]);
//   const [items, setItems] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [grns, setGrns] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [workOrders, setWorkOrders] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [ncrs, setNcrs] = useState([]);
  
//   const [loadingPlans, setLoadingPlans] = useState(false);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   const [loadingGrns, setLoadingGrns] = useState(false);
//   const [loadingVendors, setLoadingVendors] = useState(false);
//   const [loadingWorkOrders, setLoadingWorkOrders] = useState(false);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [loadingNcrs, setLoadingNcrs] = useState(false);
  
//   // Selected values
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
//   const [availableSequences, setAvailableSequences] = useState([]);

//   // Form data
//   const [formData, setFormData] = useState({
//     inspection_type: '',
//     plan_id: '',
//     item_id: '',
//     part_no: '',
//     lot_size: '',
//     sample_size: '',
//     inspector_id: '',
//     grn_id: '',
//     vendor_id: '',
//     wo_id: '',
//     op_sequence: '',
//     customer_id: '',
//     ncr_id: ''
//   });

//   // Helper function to get required fields based on inspection type
//   const getRequiredFields = (inspectionType) => {
//     switch (inspectionType) {
//       case 'First Article':
//         return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id', 'op_sequence'];
//       case 'Incoming':
//         return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'grn_id', 'vendor_id'];
//       case 'In-Process':
//         return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id', 'op_sequence'];
//       case 'Final':
//         return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id'];
//       case 'Pre-Dispatch':
//         return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id', 'customer_id'];
//       case 'Customer Audit':
//         return ['item_id', 'part_no', 'inspector_id', 'customer_id'];
//       case 'Periodic':
//         return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id'];
//       case 'Concession Review':
//         return ['item_id', 'part_no', 'inspector_id', 'ncr_id'];
//       default:
//         return ['inspection_type', 'inspector_id'];
//     }
//   };

//   // Fetch Inspection Plans
//   const fetchInspectionPlans = useCallback(async () => {
//     try {
//       setLoadingPlans(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/inspection-plans?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setInspectionPlans(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching inspection plans:', err);
//     } finally {
//       setLoadingPlans(false);
//     }
//   }, []);

//   // Fetch Items
//   const fetchItems = useCallback(async () => {
//     try {
//       setLoadingItems(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/items?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setItems(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching items:', err);
//     } finally {
//       setLoadingItems(false);
//     }
//   }, []);

//   // Fetch Employees
//   const fetchEmployees = useCallback(async () => {
//     try {
//       setLoadingEmployees(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/employees?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setEmployees(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching employees:', err);
//     } finally {
//       setLoadingEmployees(false);
//     }
//   }, []);

//   // Fetch GRNs
//   const fetchGrns = useCallback(async () => {
//     try {
//       setLoadingGrns(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/grns?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setGrns(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching GRNs:', err);
//     } finally {
//       setLoadingGrns(false);
//     }
//   }, []);

//   // Fetch Vendors
//   const fetchVendors = useCallback(async () => {
//     try {
//       setLoadingVendors(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/vendors?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setVendors(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//     } finally {
//       setLoadingVendors(false);
//     }
//   }, []);

//   // Fetch Work Orders (only completed)
//   const fetchWorkOrders = useCallback(async () => {
//     try {
//       setLoadingWorkOrders(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/work-orders?limit=200`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         // Filter only completed work orders
//         const completedWOs = response.data.data.filter(wo => wo.status === 'Completed');
//         setWorkOrders(completedWOs);
//       }
//     } catch (err) {
//       console.error('Error fetching work orders:', err);
//     } finally {
//       setLoadingWorkOrders(false);
//     }
//   }, []);

//   // Fetch Customers
//   const fetchCustomers = useCallback(async () => {
//     try {
//       setLoadingCustomers(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/customers?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setCustomers(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching customers:', err);
//     } finally {
//       setLoadingCustomers(false);
//     }
//   }, []);

//   // Fetch NCRs
//   const fetchNcrs = useCallback(async () => {
//     try {
//       setLoadingNcrs(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/ncrs?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setNcrs(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching NCRs:', err);
//     } finally {
//       setLoadingNcrs(false);
//     }
//   }, []);

//   // Fetch data when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchInspectionPlans();
//       fetchItems();
//       fetchEmployees();
//       fetchGrns();
//       fetchVendors();
//       fetchWorkOrders();
//       fetchCustomers();
//       fetchNcrs();
//     }
//   }, [open, fetchInspectionPlans, fetchItems, fetchEmployees, fetchGrns, fetchVendors, fetchWorkOrders, fetchCustomers, fetchNcrs]);

//   // Handle edit mode - populate form with initial data
//   useEffect(() => {
//     if (isEditMode && initialData && open) {
//       setFormData({
//         inspection_type: initialData.inspection_type || '',
//         plan_id: initialData.plan_id?._id || initialData.plan_id || '',
//         item_id: initialData.item_id?._id || initialData.item_id || '',
//         part_no: initialData.part_no || initialData.item_id?.part_no || '',
//         lot_size: initialData.lot_size || '',
//         sample_size: initialData.sample_size || '',
//         inspector_id: initialData.inspector_id?._id || initialData.inspector_id || '',
//         grn_id: initialData.grn_id?._id || initialData.grn_id || '',
//         vendor_id: initialData.vendor_id?._id || initialData.vendor_id || '',
//         wo_id: initialData.wo_id?._id || initialData.wo_id || '',
//         op_sequence: initialData.op_sequence || '',
//         customer_id: initialData.customer_id?._id || initialData.customer_id || '',
//         ncr_id: initialData.ncr_id?._id || initialData.ncr_id || ''
//       });
      
//       // Set selected plan
//       const plan = inspectionPlans.find(p => p._id === (initialData.plan_id?._id || initialData.plan_id));
//       if (plan) setSelectedPlan(plan);
      
//       // Set selected item
//       const item = items.find(i => i._id === (initialData.item_id?._id || initialData.item_id));
//       if (item) setSelectedItem(item);
      
//       // Set selected work order and populate sequences
//       const wo = workOrders.find(w => w._id === (initialData.wo_id?._id || initialData.wo_id));
//       if (wo) {
//         setSelectedWorkOrder(wo);
//         if (wo.operations && wo.operations.length > 0) {
//           const sequences = wo.operations
//             .filter(op => op.op_sequence)
//             .map(op => ({
//               value: op.op_sequence,
//               label: `Operation ${op.op_sequence} - ${op.operation_name || 'Unnamed'}`
//             }));
//           setAvailableSequences(sequences);
//         }
//       }
//     }
//   }, [isEditMode, initialData, open, inspectionPlans, items, workOrders]);

//   // Reset form when dialog closes
//   useEffect(() => {
//     if (!open) {
//       resetForm();
//     }
//   }, [open]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handlePlanChange = (event, newValue) => {
//     setSelectedPlan(newValue);
//     setFormData(prev => ({ ...prev, plan_id: newValue?._id || '' }));
//     setFieldErrors(prev => ({ ...prev, plan_id: '' }));
//     // Removed auto-fill of inspection type - user selection is respected
//   };

//   const handleItemChange = (event, newValue) => {
//     setSelectedItem(newValue);
//     setFormData(prev => ({ 
//       ...prev, 
//       item_id: newValue?._id || '',
//       part_no: newValue?.part_no || ''
//     }));
//     setFieldErrors(prev => ({ ...prev, item_id: '' }));
//   };

//   const handleWorkOrderChange = (event, newValue) => {
//     setSelectedWorkOrder(newValue);
//     setFormData(prev => ({ 
//       ...prev, 
//       wo_id: newValue?._id || '',
//       op_sequence: '' // Reset operation sequence when work order changes
//     }));
//     setFieldErrors(prev => ({ ...prev, wo_id: '' }));
    
//     // Update available operation sequences
//     if (newValue && newValue.operations && newValue.operations.length > 0) {
//       const sequences = newValue.operations
//         .filter(op => op.op_sequence)
//         .map(op => ({
//           value: op.op_sequence,
//           label: `Operation ${op.op_sequence} - ${op.operation_name || 'Unnamed'}`
//         }));
//       setAvailableSequences(sequences);
//     } else {
//       setAvailableSequences([]);
//     }
//   };

//   const handleOperationSequenceChange = (event) => {
//     const value = event.target.value;
//     setFormData(prev => ({ ...prev, op_sequence: value }));
//     setFieldErrors(prev => ({ ...prev, op_sequence: '' }));
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Basic Information
//         if (!formData.inspection_type) {
//           errors.inspection_type = 'Inspection type is required';
//           isValid = false;
//         }
        
//         const requiredFields = getRequiredFields(formData.inspection_type);
        
//         if (requiredFields.includes('plan_id') && !formData.plan_id) {
//           errors.plan_id = 'Inspection plan is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('item_id') && !formData.item_id) {
//           errors.item_id = 'Item is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('part_no') && !formData.part_no) {
//           errors.part_no = 'Part number is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('lot_size')) {
//           if (!formData.lot_size) {
//             errors.lot_size = 'Lot size is required';
//             isValid = false;
//           } else if (parseFloat(formData.lot_size) <= 0) {
//             errors.lot_size = 'Lot size must be greater than 0';
//             isValid = false;
//           }
//         }
//         if (requiredFields.includes('sample_size')) {
//           if (!formData.sample_size) {
//             errors.sample_size = 'Sample size is required';
//             isValid = false;
//           } else if (parseFloat(formData.sample_size) <= 0) {
//             errors.sample_size = 'Sample size must be greater than 0';
//             isValid = false;
//           }
//         }
//         if (requiredFields.includes('wo_id') && !formData.wo_id) {
//           errors.wo_id = 'Work order is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('op_sequence') && !formData.op_sequence) {
//           errors.op_sequence = 'Operation sequence is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('grn_id') && !formData.grn_id) {
//           errors.grn_id = 'GRN is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('vendor_id') && !formData.vendor_id) {
//           errors.vendor_id = 'Vendor is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('customer_id') && !formData.customer_id) {
//           errors.customer_id = 'Customer is required';
//           isValid = false;
//         }
//         if (requiredFields.includes('ncr_id') && !formData.ncr_id) {
//           errors.ncr_id = 'NCR is required';
//           isValid = false;
//         }
//         break;
      
//       case 1: // Inspection Details
//         if (!formData.inspector_id) {
//           errors.inspector_id = 'Inspector is required';
//           isValid = false;
//         }
//         break;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix the errors in this section');
//     }
//     return isValid;
//   };

//   const validateForm = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.inspection_type) {
//       errors.inspection_type = 'Inspection type is required';
//       isValid = false;
//     }
    
//     const requiredFields = getRequiredFields(formData.inspection_type);
    
//     if (requiredFields.includes('plan_id') && !formData.plan_id) {
//       errors.plan_id = 'Inspection plan is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('item_id') && !formData.item_id) {
//       errors.item_id = 'Item is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('part_no') && !formData.part_no) {
//       errors.part_no = 'Part number is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('lot_size')) {
//       if (!formData.lot_size) {
//         errors.lot_size = 'Lot size is required';
//         isValid = false;
//       } else if (parseFloat(formData.lot_size) <= 0) {
//         errors.lot_size = 'Lot size must be greater than 0';
//         isValid = false;
//       }
//     }
//     if (requiredFields.includes('sample_size')) {
//       if (!formData.sample_size) {
//         errors.sample_size = 'Sample size is required';
//         isValid = false;
//       } else if (parseFloat(formData.sample_size) <= 0) {
//         errors.sample_size = 'Sample size must be greater than 0';
//         isValid = false;
//       }
//     }
//     if (!formData.inspector_id) {
//       errors.inspector_id = 'Inspector is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('wo_id') && !formData.wo_id) {
//       errors.wo_id = 'Work order is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('op_sequence') && !formData.op_sequence) {
//       errors.op_sequence = 'Operation sequence is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('grn_id') && !formData.grn_id) {
//       errors.grn_id = 'GRN is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('vendor_id') && !formData.vendor_id) {
//       errors.vendor_id = 'Vendor is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('customer_id') && !formData.customer_id) {
//       errors.customer_id = 'Customer is required';
//       isValid = false;
//     }
//     if (requiredFields.includes('ncr_id') && !formData.ncr_id) {
//       errors.ncr_id = 'NCR is required';
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix all validation errors');
//     }
//     return isValid;
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setError('');
//       setActiveStep((prevStep) => prevStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setError('');
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
      
//       const requestData = {
//         inspection_type: formData.inspection_type,
//         inspector_id: formData.inspector_id
//       };

//       // Add fields conditionally based on inspection_type
//       const requiredFields = getRequiredFields(formData.inspection_type);
      
//       if (requiredFields.includes('plan_id')) requestData.plan_id = formData.plan_id;
//       if (requiredFields.includes('item_id')) requestData.item_id = formData.item_id;
//       if (requiredFields.includes('part_no')) requestData.part_no = formData.part_no;
//       if (requiredFields.includes('lot_size')) requestData.lot_size = Number(formData.lot_size);
//       if (requiredFields.includes('sample_size')) requestData.sample_size = Number(formData.sample_size);
//       if (requiredFields.includes('wo_id')) requestData.wo_id = formData.wo_id;
//       if (requiredFields.includes('op_sequence')) requestData.op_sequence = Number(formData.op_sequence);
//       if (requiredFields.includes('grn_id')) requestData.grn_id = formData.grn_id;
//       if (requiredFields.includes('vendor_id')) requestData.vendor_id = formData.vendor_id;
//       if (requiredFields.includes('customer_id')) requestData.customer_id = formData.customer_id;
//       if (requiredFields.includes('ncr_id')) requestData.ncr_id = formData.ncr_id;

//       let response;
//       if (isEditMode) {
//         response = await axios.put(`${BASE_URL}/api/inspection-records/${initialData._id}`, requestData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         response = await axios.post(`${BASE_URL}/api/inspection-records`, requestData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }

//       if (response.data.success) {
//         onSuccess();
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection record`);
//       }
//     } catch (err) {
//       console.error('Error saving inspection record:', err);
//       setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection record. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setSelectedPlan(null);
//     setSelectedItem(null);
//     setSelectedWorkOrder(null);
//     setAvailableSequences([]);
//     setFormData({
//       inspection_type: '',
//       plan_id: '',
//       item_id: '',
//       part_no: '',
//       lot_size: '',
//       sample_size: '',
//       inspector_id: '',
//       grn_id: '',
//       vendor_id: '',
//       wo_id: '',
//       op_sequence: '',
//       customer_id: '',
//       ncr_id: ''
//     });
//     setFieldErrors({});
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Render conditional fields based on inspection type
//   const renderConditionalFields = () => {
//     const inspectionType = formData.inspection_type;
    
//     if (!inspectionType) return null;

//     switch (inspectionType) {
//       case 'First Article':
//       case 'In-Process':
//         return (
//           <>
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                   Work Order <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={workOrders}
//                   getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no}`}
//                   value={selectedWorkOrder}
//                   onChange={handleWorkOrderChange}
//                   loading={loadingWorkOrders}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Search and select completed work order"
//                       error={!!fieldErrors.wo_id}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   )}
//                 />
//                 {fieldErrors.wo_id && (
//                   <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                     {fieldErrors.wo_id}
//                   </Typography>
//                 )}
//               </Box>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                   Operation Sequence <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <FormControl fullWidth size="small" error={!!fieldErrors.op_sequence}>
//                   <Select
//                     value={formData.op_sequence}
//                     onChange={handleOperationSequenceChange}
//                     displayEmpty
//                     disabled={!selectedWorkOrder || availableSequences.length === 0}
//                     sx={{
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '& .MuiSelect-select': { py: 1, px: 1.5 }
//                     }}
//                   >
//                     <MenuItem value="" disabled>Select operation sequence</MenuItem>
//                     {availableSequences.map(seq => (
//                       <MenuItem key={seq.value} value={seq.value} sx={{ fontSize: '0.75rem' }}>
//                         {seq.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 {selectedWorkOrder && availableSequences.length === 0 && (
//                   <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                     No operations found for this work order
//                   </Typography>
//                 )}
//                 {fieldErrors.op_sequence && (
//                   <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                     {fieldErrors.op_sequence}
//                   </Typography>
//                 )}
//               </Box>
//             </Grid>
//           </>
//         );

//       case 'Final':
//         return (
//           <Grid size={{ xs: 12 }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                 Work Order <span style={{ color: '#EF4444' }}>*</span>
//               </Typography>
//               <Autocomplete
//                 fullWidth
//                 options={workOrders}
//                 getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no}`}
//                 value={selectedWorkOrder}
//                 onChange={handleWorkOrderChange}
//                 loading={loadingWorkOrders}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
//                     placeholder="Search and select completed work order"
//                     error={!!fieldErrors.wo_id}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                       },
//                       '& .MuiInputBase-input': {
//                         py: 1,
//                         px: 1.5,
//                         fontSize: '0.75rem'
//                       }
//                     }}
//                   />
//                 )}
//               />
//               {fieldErrors.wo_id && (
//                 <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                   {fieldErrors.wo_id}
//                 </Typography>
//               )}
//             </Box>
//           </Grid>
//         );

//       case 'Pre-Dispatch':
//         return (
//           <>
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                   Work Order <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={workOrders}
//                   getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no}`}
//                   value={selectedWorkOrder}
//                   onChange={handleWorkOrderChange}
//                   loading={loadingWorkOrders}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Search and select completed work order"
//                       error={!!fieldErrors.wo_id}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   )}
//                 />
//                 {fieldErrors.wo_id && (
//                   <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                     {fieldErrors.wo_id}
//                   </Typography>
//                 )}
//               </Box>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                   Customer <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={customers}
//                   getOptionLabel={(option) => `${option.customer_code} - ${option.customer_name}`}
//                   value={customers.find(c => c._id === formData.customer_id) || null}
//                   onChange={(event, newValue) => {
//                     setFormData(prev => ({ ...prev, customer_id: newValue?._id || '' }));
//                     setFieldErrors(prev => ({ ...prev, customer_id: '' }));
//                   }}
//                   loading={loadingCustomers}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Search and select customer"
//                       error={!!fieldErrors.customer_id}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                   )}
//                 />
//                 {fieldErrors.customer_id && (
//                   <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                     {fieldErrors.customer_id}
//                   </Typography>
//                 )}
//               </Box>
//             </Grid>
//           </>
//         );

//       case 'Customer Audit':
//         return (
//           <Grid size={{ xs: 12 }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                 Customer <span style={{ color: '#EF4444' }}>*</span>
//               </Typography>
//               <Autocomplete
//                 fullWidth
//                 options={customers}
//                 getOptionLabel={(option) => `${option.customer_code} - ${option.customer_name}`}
//                 value={customers.find(c => c._id === formData.customer_id) || null}
//                 onChange={(event, newValue) => {
//                   setFormData(prev => ({ ...prev, customer_id: newValue?._id || '' }));
//                   setFieldErrors(prev => ({ ...prev, customer_id: '' }));
//                 }}
//                 loading={loadingCustomers}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
//                     placeholder="Search and select customer"
//                     error={!!fieldErrors.customer_id}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                       },
//                       '& .MuiInputBase-input': {
//                         py: 1,
//                         px: 1.5,
//                         fontSize: '0.75rem'
//                       }
//                     }}
//                   />
//                 )}
//               />
//               {fieldErrors.customer_id && (
//                 <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                   {fieldErrors.customer_id}
//                 </Typography>
//               )}
//             </Box>
//           </Grid>
//         );

//       case 'Concession Review':
//         return (
//           <Grid size={{ xs: 12 }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                 NCR Number <span style={{ color: '#EF4444' }}>*</span>
//               </Typography>
//               <Autocomplete
//                 fullWidth
//                 options={ncrs}
//                 getOptionLabel={(option) => `${option.ncr_number} - ${option.description || ''}`}
//                 value={ncrs.find(n => n._id === formData.ncr_id) || null}
//                 onChange={(event, newValue) => {
//                   setFormData(prev => ({ ...prev, ncr_id: newValue?._id || '' }));
//                   setFieldErrors(prev => ({ ...prev, ncr_id: '' }));
//                 }}
//                 loading={loadingNcrs}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
//                     placeholder="Search and select NCR"
//                     error={!!fieldErrors.ncr_id}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                       },
//                       '& .MuiInputBase-input': {
//                         py: 1,
//                         px: 1.5,
//                         fontSize: '0.75rem'
//                       }
//                     }}
//                   />
//                 )}
//               />
//               {fieldErrors.ncr_id && (
//                 <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                   {fieldErrors.ncr_id}
//                 </Typography>
//               )}
//             </Box>
//           </Grid>
//         );

//       default:
//         return null;
//     }
//   };

//   // Render Step Content
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <RecordIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Basic Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Inspection Type <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.inspection_type}>
//                       <Select
//                         name="inspection_type"
//                         value={formData.inspection_type}
//                         onChange={handleChange}
//                         displayEmpty
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         <MenuItem value="" disabled>Select inspection type</MenuItem>
//                         {INSPECTION_TYPE_OPTIONS.map(option => (
//                           <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.inspection_type && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.inspection_type}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 {formData.inspection_type !== 'Customer Audit' && formData.inspection_type !== 'Concession Review' && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                         Inspection Plan {(formData.inspection_type !== 'Customer Audit' && formData.inspection_type !== 'Concession Review') && <span style={{ color: '#EF4444' }}>*</span>}
//                       </Typography>
//                       <Autocomplete
//                         fullWidth
//                         options={inspectionPlans}
//                         getOptionLabel={(option) => `${option.plan_id} - ${option.plan_name}`}
//                         value={selectedPlan}
//                         onChange={handlePlanChange}
//                         loading={loadingPlans}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             size="small"
//                             placeholder="Search and select inspection plan"
//                             error={!!fieldErrors.plan_id}
//                             sx={{
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 1.5,
//                                 fontSize: '0.75rem',
//                                 '&:hover fieldset': { borderColor: COLORS.primary },
//                                 '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                               },
//                               '& .MuiInputBase-input': {
//                                 py: 1,
//                                 px: 1.5,
//                                 fontSize: '0.75rem'
//                               }
//                             }}
//                           />
//                         )}
//                       />
//                       {fieldErrors.plan_id && (
//                         <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                           {fieldErrors.plan_id}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Grid>
//                 )}

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Item <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       fullWidth
//                       options={items}
//                       getOptionLabel={(option) => `${option.part_no} - ${option.part_name || option.part_description || ''}`}
//                       value={selectedItem}
//                       onChange={handleItemChange}
//                       loading={loadingItems}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           placeholder="Search and select item"
//                           error={!!fieldErrors.item_id}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': {
//                               py: 1,
//                               px: 1.5,
//                               fontSize: '0.75rem'
//                             }
//                           }}
//                         />
//                       )}
//                     />
//                     {fieldErrors.item_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.item_id}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Part No <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="part_no"
//                       value={formData.part_no}
//                       onChange={handleChange}
//                       placeholder="Auto-filled from item"
//                       error={!!fieldErrors.part_no}
//                       InputProps={{ readOnly: !!selectedItem }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           bgcolor: selectedItem ? '#F5F5F5' : 'transparent',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem'
//                         }
//                       }}
//                     />
//                     {fieldErrors.part_no && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.part_no}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 {formData.inspection_type !== 'Customer Audit' && formData.inspection_type !== 'Concession Review' && (
//                   <>
//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           Lot Size <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           size="small"
//                           name="lot_size"
//                           value={formData.lot_size}
//                           onChange={handleChange}
//                           placeholder="1000"
//                           error={!!fieldErrors.lot_size}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': {
//                               py: 1,
//                               px: 1.5,
//                               fontSize: '0.75rem'
//                             }
//                           }}
//                         />
//                         {fieldErrors.lot_size && (
//                           <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                             {fieldErrors.lot_size}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           Sample Size <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           size="small"
//                           name="sample_size"
//                           value={formData.sample_size}
//                           onChange={handleChange}
//                           placeholder="125"
//                           error={!!fieldErrors.sample_size}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': {
//                               py: 1,
//                               px: 1.5,
//                               fontSize: '0.75rem'
//                             }
//                           }}
//                         />
//                         {fieldErrors.sample_size && (
//                           <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                             {fieldErrors.sample_size}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Grid>
//                   </>
//                 )}

//                 {/* Conditional fields for Incoming type */}
//                 {formData.inspection_type === 'Incoming' && (
//                   <>
//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           GRN Number <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <Autocomplete
//                           fullWidth
//                           options={grns}
//                           getOptionLabel={(option) => `${option.grn_number} - ${option.vendor_name || ''}`}
//                           value={grns.find(g => g._id === formData.grn_id) || null}
//                           onChange={(event, newValue) => {
//                             setFormData(prev => ({ ...prev, grn_id: newValue?._id || '' }));
//                             setFieldErrors(prev => ({ ...prev, grn_id: '' }));
//                           }}
//                           loading={loadingGrns}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               size="small"
//                               placeholder="Search and select GRN"
//                               error={!!fieldErrors.grn_id}
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   fontSize: '0.75rem',
//                                   '&:hover fieldset': { borderColor: COLORS.primary },
//                                   '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                                 },
//                                 '& .MuiInputBase-input': {
//                                   py: 1,
//                                   px: 1.5,
//                                   fontSize: '0.75rem'
//                                 }
//                               }}
//                             />
//                           )}
//                         />
//                         {fieldErrors.grn_id && (
//                           <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                             {fieldErrors.grn_id}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           Vendor <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <Autocomplete
//                           fullWidth
//                           options={vendors}
//                           getOptionLabel={(option) => `${option.vendor_code} - ${option.vendor_name}`}
//                           value={vendors.find(v => v._id === formData.vendor_id) || null}
//                           onChange={(event, newValue) => {
//                             setFormData(prev => ({ ...prev, vendor_id: newValue?._id || '' }));
//                             setFieldErrors(prev => ({ ...prev, vendor_id: '' }));
//                           }}
//                           loading={loadingVendors}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               size="small"
//                               placeholder="Search and select vendor"
//                               error={!!fieldErrors.vendor_id}
//                               sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 1.5,
//                                   fontSize: '0.75rem',
//                                   '&:hover fieldset': { borderColor: COLORS.primary },
//                                   '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                                 },
//                                 '& .MuiInputBase-input': {
//                                   py: 1,
//                                   px: 1.5,
//                                   fontSize: '0.75rem'
//                                 }
//                               }}
//                             />
//                           )}
//                         />
//                         {fieldErrors.vendor_id && (
//                           <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                             {fieldErrors.vendor_id}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Grid>
//                   </>
//                 )}

//                 {/* Render other conditional fields based on inspection type */}
//                 {renderConditionalFields()}
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <PeopleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Inspection Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Inspector <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       fullWidth
//                       options={employees}
//                       getOptionLabel={(option) => `${option.FirstName || ''} ${option.LastName || ''} (${option.EmployeeID || ''})`}
//                       value={employees.find(e => e._id === formData.inspector_id) || null}
//                       onChange={(event, newValue) => {
//                         setFormData(prev => ({ ...prev, inspector_id: newValue?._id || '' }));
//                         setFieldErrors(prev => ({ ...prev, inspector_id: '' }));
//                       }}
//                       loading={loadingEmployees}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           placeholder="Search and select inspector"
//                           error={!!fieldErrors.inspector_id}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': {
//                               py: 1,
//                               px: 1.5,
//                               fontSize: '0.75rem'
//                             }
//                           }}
//                         />
//                       )}
//                     />
//                     {fieldErrors.inspector_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.inspector_id}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white
//       }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           {isEditMode ? 'Edit Inspection Record' : 'Add Inspection Record'}
//         </Typography>
//       </DialogTitle>

//       {/* Stepper */}
//       <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
//         <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         {renderStepContent(activeStep)}
        
//         {error && (
//           <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
//             {error}
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Back
//         </Button>
//         <Box>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             sx={{
//               height: 32,
//               px: 2,
//               mr: 1,
//               borderRadius: 1.5,
//               border: `1px solid ${COLORS.border}`,
//               color: COLORS.text.secondary,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               '&:hover': {
//                 borderColor: COLORS.primary,
//                 bgcolor: `${COLORS.primary}10`
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }}
//             >
//               {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Record' : 'Create Record')}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
//               endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': {
//                   bgcolor: COLORS.primaryDark,
//                 }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddInspectionRecord;



import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Chip,
  Autocomplete,
  Tooltip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assignment as RecordIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  QrCode as QrCodeIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
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
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

// Floating Error Alert Component
const FloatingErrorAlert = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <Collapse in={!!error}>
      <Alert
        severity="error"
        variant="filled"
        onClose={onClose}
        icon={<ErrorIcon sx={{ fontSize: '1rem' }} />}
        sx={{
          mb: 2,
          borderRadius: 1.5,
          fontSize: '0.75rem',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '& .MuiAlert-icon': {
            fontSize: '1rem',
            alignItems: 'center'
          },
          '& .MuiAlert-message': {
            py: 0.5,
            fontSize: '0.75rem'
          },
          '& .MuiAlert-action': {
            py: 0,
            alignItems: 'center'
          }
        }}
      >
        {error}
      </Alert>
    </Collapse>
  );
};

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

// Enums
const INSPECTION_TYPE_OPTIONS = [
  'Incoming', 'First Article', 'In-Process', 'Final', 
  'Pre-Dispatch', 'Customer Audit', 'Periodic', 'Concession Review'
];

const steps = ['Basic Information', 'Inspection Details'];

const AddInspectionRecord = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [inspectionPlans, setInspectionPlans] = useState([]);
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [grns, setGrns] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [ncrs, setNcrs] = useState([]);
  
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingGrns, setLoadingGrns] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingWorkOrders, setLoadingWorkOrders] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingNcrs, setLoadingNcrs] = useState(false);
  
  // Selected values
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [availableSequences, setAvailableSequences] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    inspection_type: '',
    plan_id: '',
    item_id: '',
    part_no: '',
    lot_size: '',
    sample_size: '',
    inspector_id: '',
    grn_id: '',
    vendor_id: '',
    wo_id: '',
    op_sequence: '',
    customer_id: '',
    ncr_id: ''
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Helper function to get required fields based on inspection type
  const getRequiredFields = (inspectionType) => {
    switch (inspectionType) {
      case 'First Article':
        return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id', 'op_sequence'];
      case 'Incoming':
        return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'grn_id', 'vendor_id'];
      case 'In-Process':
        return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id', 'op_sequence'];
      case 'Final':
        return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id'];
      case 'Pre-Dispatch':
        return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id', 'wo_id', 'customer_id'];
      case 'Customer Audit':
        return ['item_id', 'part_no', 'inspector_id', 'customer_id'];
      case 'Periodic':
        return ['plan_id', 'item_id', 'part_no', 'lot_size', 'sample_size', 'inspector_id'];
      case 'Concession Review':
        return ['item_id', 'part_no', 'inspector_id', 'ncr_id'];
      default:
        return ['inspection_type', 'inspector_id'];
    }
  };

  // Fetch Inspection Plans
  const fetchInspectionPlans = useCallback(async () => {
    try {
      setLoadingPlans(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/inspection-plans?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setInspectionPlans(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching inspection plans:', err);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  // Fetch Items
  const fetchItems = useCallback(async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?limit=100`, {
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

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  // Fetch GRNs
  const fetchGrns = useCallback(async () => {
    try {
      setLoadingGrns(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/grns?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setGrns(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching GRNs:', err);
    } finally {
      setLoadingGrns(false);
    }
  }, []);

  // Fetch Vendors
  const fetchVendors = useCallback(async () => {
    try {
      setLoadingVendors(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  }, []);

  // Fetch Work Orders (only completed)
  const fetchWorkOrders = useCallback(async () => {
    try {
      setLoadingWorkOrders(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/work-orders?limit=200`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const completedWOs = response.data.data.filter(wo => wo.status === 'Completed');
        setWorkOrders(completedWOs);
      }
    } catch (err) {
      console.error('Error fetching work orders:', err);
    } finally {
      setLoadingWorkOrders(false);
    }
  }, []);

  // Fetch Customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingCustomers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  // Fetch NCRs
  const fetchNcrs = useCallback(async () => {
    try {
      setLoadingNcrs(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setNcrs(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching NCRs:', err);
    } finally {
      setLoadingNcrs(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchInspectionPlans();
      fetchItems();
      fetchEmployees();
      fetchGrns();
      fetchVendors();
      fetchWorkOrders();
      fetchCustomers();
      fetchNcrs();
    }
  }, [open, fetchInspectionPlans, fetchItems, fetchEmployees, fetchGrns, fetchVendors, fetchWorkOrders, fetchCustomers, fetchNcrs]);

  // Handle edit mode - populate form with initial data
  useEffect(() => {
    if (isEditMode && initialData && open) {
      setFormData({
        inspection_type: initialData.inspection_type || '',
        plan_id: initialData.plan_id?._id || initialData.plan_id || '',
        item_id: initialData.item_id?._id || initialData.item_id || '',
        part_no: initialData.part_no || initialData.item_id?.part_no || '',
        lot_size: initialData.lot_size || '',
        sample_size: initialData.sample_size || '',
        inspector_id: initialData.inspector_id?._id || initialData.inspector_id || '',
        grn_id: initialData.grn_id?._id || initialData.grn_id || '',
        vendor_id: initialData.vendor_id?._id || initialData.vendor_id || '',
        wo_id: initialData.wo_id?._id || initialData.wo_id || '',
        op_sequence: initialData.op_sequence || '',
        customer_id: initialData.customer_id?._id || initialData.customer_id || '',
        ncr_id: initialData.ncr_id?._id || initialData.ncr_id || ''
      });
      
      const plan = inspectionPlans.find(p => p._id === (initialData.plan_id?._id || initialData.plan_id));
      if (plan) setSelectedPlan(plan);
      
      const item = items.find(i => i._id === (initialData.item_id?._id || initialData.item_id));
      if (item) setSelectedItem(item);
      
      const wo = workOrders.find(w => w._id === (initialData.wo_id?._id || initialData.wo_id));
      if (wo) {
        setSelectedWorkOrder(wo);
        if (wo.operations && wo.operations.length > 0) {
          const sequences = wo.operations
            .filter(op => op.op_sequence)
            .map(op => ({
              value: op.op_sequence,
              label: `Operation ${op.op_sequence} - ${op.operation_name || 'Unnamed'}`
            }));
          setAvailableSequences(sequences);
        }
      }
    }
  }, [isEditMode, initialData, open, inspectionPlans, items, workOrders]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePlanChange = (event, newValue) => {
    setSelectedPlan(newValue);
    setFormData(prev => ({ ...prev, plan_id: newValue?._id || '' }));
    setFieldErrors(prev => ({ ...prev, plan_id: '' }));
  };

  const handleItemChange = (event, newValue) => {
    setSelectedItem(newValue);
    setFormData(prev => ({ 
      ...prev, 
      item_id: newValue?._id || '',
      part_no: newValue?.part_no || ''
    }));
    setFieldErrors(prev => ({ ...prev, item_id: '' }));
  };

  const handleWorkOrderChange = (event, newValue) => {
    setSelectedWorkOrder(newValue);
    setFormData(prev => ({ 
      ...prev, 
      wo_id: newValue?._id || '',
      op_sequence: ''
    }));
    setFieldErrors(prev => ({ ...prev, wo_id: '' }));
    
    if (newValue && newValue.operations && newValue.operations.length > 0) {
      const sequences = newValue.operations
        .filter(op => op.op_sequence)
        .map(op => ({
          value: op.op_sequence,
          label: `Operation ${op.op_sequence} - ${op.operation_name || 'Unnamed'}`
        }));
      setAvailableSequences(sequences);
    } else {
      setAvailableSequences([]);
    }
  };

  const handleOperationSequenceChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, op_sequence: value }));
    setFieldErrors(prev => ({ ...prev, op_sequence: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    switch (step) {
      case 0: // Basic Information
        if (!formData.inspection_type) {
          errors.inspection_type = 'Inspection type is required';
          errorMessages.push('Inspection type is required');
          isValid = false;
        }
        
        const requiredFields = getRequiredFields(formData.inspection_type);
        
        if (requiredFields.includes('plan_id') && !formData.plan_id) {
          errors.plan_id = 'Inspection plan is required';
          errorMessages.push('Inspection plan is required');
          isValid = false;
        }
        if (requiredFields.includes('item_id') && !formData.item_id) {
          errors.item_id = 'Item is required';
          errorMessages.push('Item is required');
          isValid = false;
        }
        if (requiredFields.includes('part_no') && !formData.part_no) {
          errors.part_no = 'Part number is required';
          errorMessages.push('Part number is required');
          isValid = false;
        }
        if (requiredFields.includes('lot_size')) {
          if (!formData.lot_size) {
            errors.lot_size = 'Lot size is required';
            errorMessages.push('Lot size is required');
            isValid = false;
          } else if (parseFloat(formData.lot_size) <= 0) {
            errors.lot_size = 'Lot size must be greater than 0';
            errorMessages.push('Lot size must be greater than 0');
            isValid = false;
          }
        }
        if (requiredFields.includes('sample_size')) {
          if (!formData.sample_size) {
            errors.sample_size = 'Sample size is required';
            errorMessages.push('Sample size is required');
            isValid = false;
          } else if (parseFloat(formData.sample_size) <= 0) {
            errors.sample_size = 'Sample size must be greater than 0';
            errorMessages.push('Sample size must be greater than 0');
            isValid = false;
          }
        }
        if (requiredFields.includes('wo_id') && !formData.wo_id) {
          errors.wo_id = 'Work order is required';
          errorMessages.push('Work order is required');
          isValid = false;
        }
        if (requiredFields.includes('op_sequence') && !formData.op_sequence) {
          errors.op_sequence = 'Operation sequence is required';
          errorMessages.push('Operation sequence is required');
          isValid = false;
        }
        if (requiredFields.includes('grn_id') && !formData.grn_id) {
          errors.grn_id = 'GRN is required';
          errorMessages.push('GRN is required');
          isValid = false;
        }
        if (requiredFields.includes('vendor_id') && !formData.vendor_id) {
          errors.vendor_id = 'Vendor is required';
          errorMessages.push('Vendor is required');
          isValid = false;
        }
        if (requiredFields.includes('customer_id') && !formData.customer_id) {
          errors.customer_id = 'Customer is required';
          errorMessages.push('Customer is required');
          isValid = false;
        }
        if (requiredFields.includes('ncr_id') && !formData.ncr_id) {
          errors.ncr_id = 'NCR is required';
          errorMessages.push('NCR is required');
          isValid = false;
        }
        break;
      
      case 1: // Inspection Details
        if (!formData.inspector_id) {
          errors.inspector_id = 'Inspector is required';
          errorMessages.push('Inspector is required');
          isValid = false;
        }
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      showError(errorMessages[0]);
    }
    return isValid;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    if (!formData.inspection_type) {
      errors.inspection_type = 'Inspection type is required';
      errorMessages.push('Inspection type is required');
      isValid = false;
    }
    
    const requiredFields = getRequiredFields(formData.inspection_type);
    
    if (requiredFields.includes('plan_id') && !formData.plan_id) {
      errors.plan_id = 'Inspection plan is required';
      errorMessages.push('Inspection plan is required');
      isValid = false;
    }
    if (requiredFields.includes('item_id') && !formData.item_id) {
      errors.item_id = 'Item is required';
      errorMessages.push('Item is required');
      isValid = false;
    }
    if (requiredFields.includes('part_no') && !formData.part_no) {
      errors.part_no = 'Part number is required';
      errorMessages.push('Part number is required');
      isValid = false;
    }
    if (requiredFields.includes('lot_size')) {
      if (!formData.lot_size) {
        errors.lot_size = 'Lot size is required';
        errorMessages.push('Lot size is required');
        isValid = false;
      } else if (parseFloat(formData.lot_size) <= 0) {
        errors.lot_size = 'Lot size must be greater than 0';
        errorMessages.push('Lot size must be greater than 0');
        isValid = false;
      }
    }
    if (requiredFields.includes('sample_size')) {
      if (!formData.sample_size) {
        errors.sample_size = 'Sample size is required';
        errorMessages.push('Sample size is required');
        isValid = false;
      } else if (parseFloat(formData.sample_size) <= 0) {
        errors.sample_size = 'Sample size must be greater than 0';
        errorMessages.push('Sample size must be greater than 0');
        isValid = false;
      }
    }
    if (!formData.inspector_id) {
      errors.inspector_id = 'Inspector is required';
      errorMessages.push('Inspector is required');
      isValid = false;
    }
    if (requiredFields.includes('wo_id') && !formData.wo_id) {
      errors.wo_id = 'Work order is required';
      errorMessages.push('Work order is required');
      isValid = false;
    }
    if (requiredFields.includes('op_sequence') && !formData.op_sequence) {
      errors.op_sequence = 'Operation sequence is required';
      errorMessages.push('Operation sequence is required');
      isValid = false;
    }
    if (requiredFields.includes('grn_id') && !formData.grn_id) {
      errors.grn_id = 'GRN is required';
      errorMessages.push('GRN is required');
      isValid = false;
    }
    if (requiredFields.includes('vendor_id') && !formData.vendor_id) {
      errors.vendor_id = 'Vendor is required';
      errorMessages.push('Vendor is required');
      isValid = false;
    }
    if (requiredFields.includes('customer_id') && !formData.customer_id) {
      errors.customer_id = 'Customer is required';
      errorMessages.push('Customer is required');
      isValid = false;
    }
    if (requiredFields.includes('ncr_id') && !formData.ncr_id) {
      errors.ncr_id = 'NCR is required';
      errorMessages.push('NCR is required');
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      showError(errorMessages[0]);
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        inspection_type: formData.inspection_type,
        inspector_id: formData.inspector_id
      };

      const requiredFields = getRequiredFields(formData.inspection_type);
      
      if (requiredFields.includes('plan_id')) requestData.plan_id = formData.plan_id;
      if (requiredFields.includes('item_id')) requestData.item_id = formData.item_id;
      if (requiredFields.includes('part_no')) requestData.part_no = formData.part_no;
      if (requiredFields.includes('lot_size')) requestData.lot_size = Number(formData.lot_size);
      if (requiredFields.includes('sample_size')) requestData.sample_size = Number(formData.sample_size);
      if (requiredFields.includes('wo_id')) requestData.wo_id = formData.wo_id;
      if (requiredFields.includes('op_sequence')) requestData.op_sequence = Number(formData.op_sequence);
      if (requiredFields.includes('grn_id')) requestData.grn_id = formData.grn_id;
      if (requiredFields.includes('vendor_id')) requestData.vendor_id = formData.vendor_id;
      if (requiredFields.includes('customer_id')) requestData.customer_id = formData.customer_id;
      if (requiredFields.includes('ncr_id')) requestData.ncr_id = formData.ncr_id;

      let response;
      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/api/inspection-records/${initialData._id}`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/inspection-records`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data.success) {
        onSuccess();
        resetForm();
        onClose();
      } else {
        showError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection record`);
      }
    } catch (err) {
      console.error('Error saving inspection record:', err);
      showError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection record. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedPlan(null);
    setSelectedItem(null);
    setSelectedWorkOrder(null);
    setAvailableSequences([]);
    setFormData({
      inspection_type: '',
      plan_id: '',
      item_id: '',
      part_no: '',
      lot_size: '',
      sample_size: '',
      inspector_id: '',
      grn_id: '',
      vendor_id: '',
      wo_id: '',
      op_sequence: '',
      customer_id: '',
      ncr_id: ''
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Render conditional fields based on inspection type
  const renderConditionalFields = () => {
    const inspectionType = formData.inspection_type;
    
    if (!inspectionType) return null;

    switch (inspectionType) {
      case 'First Article':
      case 'In-Process':
        return (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Work Order <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={workOrders}
                  getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no}`}
                  value={selectedWorkOrder}
                  onChange={handleWorkOrderChange}
                  loading={loadingWorkOrders}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search and select completed work order"
                      error={!!fieldErrors.wo_id}
                      helperText={fieldErrors.wo_id}
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
                  Operation Sequence <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <FormControl fullWidth size="small" error={!!fieldErrors.op_sequence}>
                  <Select
                    value={formData.op_sequence}
                    onChange={handleOperationSequenceChange}
                    displayEmpty
                    disabled={!selectedWorkOrder || availableSequences.length === 0}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 },
                      '&.Mui-error': { borderColor: '#EF4444' }
                    }}
                  >
                    <MenuItem value="" disabled>Select operation sequence</MenuItem>
                    {availableSequences.map(seq => (
                      <MenuItem key={seq.value} value={seq.value} sx={{ fontSize: '0.75rem' }}>
                        {seq.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.op_sequence && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.op_sequence}
                    </Typography>
                  )}
                </FormControl>
                {selectedWorkOrder && availableSequences.length === 0 && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    No operations found for this work order
                  </Typography>
                )}
              </Box>
            </Grid>
          </>
        );

      case 'Final':
        return (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Work Order <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Autocomplete
                fullWidth
                options={workOrders}
                getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no}`}
                value={selectedWorkOrder}
                onChange={handleWorkOrderChange}
                loading={loadingWorkOrders}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search and select completed work order"
                    error={!!fieldErrors.wo_id}
                    helperText={fieldErrors.wo_id}
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        );

      case 'Pre-Dispatch':
        return (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Work Order <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={workOrders}
                  getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no}`}
                  value={selectedWorkOrder}
                  onChange={handleWorkOrderChange}
                  loading={loadingWorkOrders}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search and select completed work order"
                      error={!!fieldErrors.wo_id}
                      helperText={fieldErrors.wo_id}
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
                  Customer <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={customers}
                  getOptionLabel={(option) => `${option.customer_code} - ${option.customer_name}`}
                  value={customers.find(c => c._id === formData.customer_id) || null}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({ ...prev, customer_id: newValue?._id || '' }));
                    setFieldErrors(prev => ({ ...prev, customer_id: '' }));
                  }}
                  loading={loadingCustomers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search and select customer"
                      error={!!fieldErrors.customer_id}
                      helperText={fieldErrors.customer_id}
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
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>
          </>
        );

      case 'Customer Audit':
        return (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Customer <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Autocomplete
                fullWidth
                options={customers}
                getOptionLabel={(option) => `${option.customer_code} - ${option.customer_name}`}
                value={customers.find(c => c._id === formData.customer_id) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, customer_id: newValue?._id || '' }));
                  setFieldErrors(prev => ({ ...prev, customer_id: '' }));
                }}
                loading={loadingCustomers}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search and select customer"
                    error={!!fieldErrors.customer_id}
                    helperText={fieldErrors.customer_id}
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        );

      case 'Concession Review':
        return (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                NCR Number <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Autocomplete
                fullWidth
                options={ncrs}
                getOptionLabel={(option) => `${option.ncr_number} - ${option.description || ''}`}
                value={ncrs.find(n => n._id === formData.ncr_id) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, ncr_id: newValue?._id || '' }));
                  setFieldErrors(prev => ({ ...prev, ncr_id: '' }));
                }}
                loading={loadingNcrs}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search and select NCR"
                    error={!!fieldErrors.ncr_id}
                    helperText={fieldErrors.ncr_id}
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        );

      default:
        return null;
    }
  };

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <RecordIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Inspection Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.inspection_type}>
                      <Select
                        name="inspection_type"
                        value={formData.inspection_type}
                        onChange={handleChange}
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 },
                          '&.Mui-error': { borderColor: '#EF4444' }
                        }}
                      >
                        <MenuItem value="" disabled>Select inspection type</MenuItem>
                        {INSPECTION_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.inspection_type && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.inspection_type}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                {formData.inspection_type !== 'Customer Audit' && formData.inspection_type !== 'Concession Review' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Inspection Plan {formData.inspection_type !== 'Customer Audit' && formData.inspection_type !== 'Concession Review' && <span style={{ color: '#EF4444' }}>*</span>}
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={inspectionPlans}
                        getOptionLabel={(option) => `${option.plan_id} - ${option.plan_name}`}
                        value={selectedPlan}
                        onChange={handlePlanChange}
                        loading={loadingPlans}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Search and select inspection plan"
                            error={!!fieldErrors.plan_id}
                            helperText={fieldErrors.plan_id}
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
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Item <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={items}
                      getOptionLabel={(option) => `${option.part_no} - ${option.part_name || option.part_description || ''}`}
                      value={selectedItem}
                      onChange={handleItemChange}
                      loading={loadingItems}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select item"
                          error={!!fieldErrors.item_id}
                          helperText={fieldErrors.item_id}
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
                      Part No <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="part_no"
                      value={formData.part_no}
                      onChange={handleChange}
                      placeholder="Auto-filled from item"
                      error={!!fieldErrors.part_no}
                      helperText={fieldErrors.part_no}
                      InputProps={{ readOnly: !!selectedItem }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          bgcolor: selectedItem ? '#F5F5F5' : 'transparent',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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

                {formData.inspection_type !== 'Customer Audit' && formData.inspection_type !== 'Concession Review' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Lot Size <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          name="lot_size"
                          value={formData.lot_size}
                          onChange={handleChange}
                          placeholder="1000"
                          error={!!fieldErrors.lot_size}
                          helperText={fieldErrors.lot_size}
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
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Sample Size <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          name="sample_size"
                          value={formData.sample_size}
                          onChange={handleChange}
                          placeholder="125"
                          error={!!fieldErrors.sample_size}
                          helperText={fieldErrors.sample_size}
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
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  </>
                )}

                {formData.inspection_type === 'Incoming' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          GRN Number <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={grns}
                          getOptionLabel={(option) => `${option.grn_number} - ${option.vendor_name || ''}`}
                          value={grns.find(g => g._id === formData.grn_id) || null}
                          onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, grn_id: newValue?._id || '' }));
                            setFieldErrors(prev => ({ ...prev, grn_id: '' }));
                          }}
                          loading={loadingGrns}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Search and select GRN"
                              error={!!fieldErrors.grn_id}
                              helperText={fieldErrors.grn_id}
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
                          Vendor <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={vendors}
                          getOptionLabel={(option) => `${option.vendor_code} - ${option.vendor_name}`}
                          value={vendors.find(v => v._id === formData.vendor_id) || null}
                          onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, vendor_id: newValue?._id || '' }));
                            setFieldErrors(prev => ({ ...prev, vendor_id: '' }));
                          }}
                          loading={loadingVendors}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Search and select vendor"
                              error={!!fieldErrors.vendor_id}
                              helperText={fieldErrors.vendor_id}
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
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  </>
                )}

                {renderConditionalFields()}
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <PeopleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Inspection Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Inspector <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={employees}
                      getOptionLabel={(option) => `${option.FirstName || ''} ${option.LastName || ''} (${option.EmployeeID || ''})`}
                      value={employees.find(e => e._id === formData.inspector_id) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, inspector_id: newValue?._id || '' }));
                        setFieldErrors(prev => ({ ...prev, inspector_id: '' }));
                      }}
                      loading={loadingEmployees}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select inspector"
                          error={!!fieldErrors.inspector_id}
                          helperText={fieldErrors.inspector_id}
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
                              fontSize: '0.75rem'
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          {isEditMode ? 'Edit Inspection Record' : 'Add Inspection Record'}
        </Typography>
      </DialogTitle>

      {/* Floating Error Alert */}
      <Box sx={{ px: 2.5, pt: 1 }}>
        <FloatingErrorAlert error={error} onClose={() => setError('')} />
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: error ? 1 : 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
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

      <DialogContent sx={{ p: 2.5, pt: error ? 1 : 2, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
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
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Record' : 'Create Record')}
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

export default AddInspectionRecord;