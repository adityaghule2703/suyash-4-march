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
//   InputAdornment,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Autocomplete,
//   Tooltip
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Assignment as PlanIcon,
//   Inventory as InventoryIcon,
//   Settings as SettingsIcon,
//   Description as DescriptionIcon,
//   QrCode as QrCodeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddItem from '../../master/itemmaster/AddItem';

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
// const PLAN_TYPE_OPTIONS = [
//   'Incoming', 'In-Process', 'Final', 'Pre-Dispatch', 'Customer-Specific', 'Combined'
// ];

// const CHARACTERISTIC_TYPE_OPTIONS = [
//   'Dimensional', 'Visual', 'Functional', 'Material', 'Surface', 'Mechanical', 'Electrical', 'Chemical'
// ];

// const FREQUENCY_OPTIONS = [
//   '100%', 'AQL', 'First Article Only', 'Per Lot', 'Per Shift', 'Per Batch'
// ];

// const steps = ['Plan Details', 'Checkpoints'];

// const AddInspectionPlan = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
  
//   // Data fetching states
//   const [items, setItems] = useState([]);
//   const [gauges, setGauges] = useState([]);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [loadingGauges, setLoadingGauges] = useState(false);
  
//   // Dialog state for Add Item
//   const [addItemOpen, setAddItemOpen] = useState(false);
//   const [currentItemIndex, setCurrentItemIndex] = useState(null);

//   // Form data
//   const [formData, setFormData] = useState({
//     plan_name: '',
//     plan_code: '',
//     plan_type: '',
//     item_id: '',
//     revision_no: 1,
//     revision_date: '',
//     aql_level: '',
//     sampling_plan: '',
//     instructions: '',
//     checkpoints: []
//   });

//   // Fetch Items (for item_id dropdown)
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

//   // Fetch Gauges (for gauge_id dropdown)
//   const fetchGauges = useCallback(async () => {
//     try {
//       setLoadingGauges(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/gauges?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setGauges(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching gauges:', err);
//     } finally {
//       setLoadingGauges(false);
//     }
//   }, []);

//   // Fetch data when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchItems();
//       fetchGauges();
//     }
//   }, [open, fetchItems, fetchGauges]);

//   // Handle edit mode - populate form with initial data
//   useEffect(() => {
//     if (isEditMode && initialData && open) {
//       setFormData({
//         plan_name: initialData.plan_name || '',
//         plan_code: initialData.plan_code || '',
//         plan_type: initialData.plan_type || '',
//         item_id: initialData.item_id?._id || initialData.item_id || '',
//         revision_no: initialData.revision_no || 1,
//         revision_date: initialData.revision_date ? initialData.revision_date.split('T')[0] : '',
//         aql_level: initialData.aql_level || '',
//         sampling_plan: initialData.sampling_plan || '',
//         instructions: initialData.instructions || '',
//         checkpoints: (initialData.checkpoints || []).map((cp, index) => ({
//           step_no: cp.sequence || cp.step_no || index + 1,
//           characteristic: cp.characteristic_name || cp.characteristic || '',
//           characteristic_type: cp.characteristic_type || '',
//           specification: cp.specification || '',
//           method: cp.method || '',
//           sample_size: cp.sample_size || '',
//           frequency: cp.frequency || '',
//           gauge_id: cp.gauge_id?._id || cp.gauge_id || '',
//           acceptance_criteria: cp.acceptance_criteria || '',
//           is_critical: cp.is_critical || false,
//           is_significant: cp.is_significant || false,
//           is_spc: cp.is_spc || false,
//           nominal_value: cp.nominal_value || '',
//           upper_tolerance: cp.upper_tolerance || '',
//           lower_tolerance: cp.lower_tolerance || '',
//           unit: cp.unit || '',
//           photo_required: cp.photo_required || false
//         }))
//       });
//     }
//   }, [isEditMode, initialData, open]);

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

//   const handleCheckpointChange = (index, field, value) => {
//     const updatedCheckpoints = [...formData.checkpoints];
//     updatedCheckpoints[index][field] = value;
//     setFormData(prev => ({ ...prev, checkpoints: updatedCheckpoints }));
//     setFieldErrors(prev => ({ ...prev, [`checkpoint_${index}_${field}`]: '' }));
//   };

//   const addCheckpoint = () => {
//     setFormData(prev => ({
//       ...prev,
//       checkpoints: [
//         ...prev.checkpoints,
//         {
//           step_no: prev.checkpoints.length + 1,
//           characteristic: '',
//           characteristic_type: '',
//           specification: '',
//           method: '',
//           sample_size: '',
//           frequency: '',
//           gauge_id: '',
//           acceptance_criteria: '',
//           is_critical: false,
//           is_significant: false,
//           is_spc: false,
//           nominal_value: '',
//           upper_tolerance: '',
//           lower_tolerance: '',
//           unit: '',
//           photo_required: false
//         }
//       ]
//     }));
//   };

//   const removeCheckpoint = (index) => {
//     if (formData.checkpoints.length > 1) {
//       const updatedCheckpoints = formData.checkpoints.filter((_, i) => i !== index);
//       // Re-sequence step numbers
//       updatedCheckpoints.forEach((cp, idx) => {
//         cp.step_no = idx + 1;
//       });
//       setFormData(prev => ({ ...prev, checkpoints: updatedCheckpoints }));
//     }
//   };

//   // Handle item added from AddItem dialog
//   const handleItemAdded = (newItem) => {
//     setItems(prev => [...prev, newItem]);
    
//     // If we were adding from the item selection, auto-select it
//     if (currentItemIndex !== null) {
//       setFormData(prev => ({ ...prev, item_id: newItem._id }));
//     }
//     setCurrentItemIndex(null);
//   };

//   const openAddItemDialog = () => {
//     setAddItemOpen(true);
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Plan Details
//         if (!formData.plan_name.trim()) {
//           errors.plan_name = 'Plan name is required';
//           isValid = false;
//         }
//         if (!formData.plan_code) {
//           errors.plan_code = 'Plan code is required';
//           isValid = false;
//         }
//         if (!formData.plan_type) {
//           errors.plan_type = 'Plan type is required';
//           isValid = false;
//         }
//         if (!formData.item_id) {
//           errors.item_id = 'Item is required';
//           isValid = false;
//         }
//         if (!formData.revision_date) {
//           errors.revision_date = 'Revision date is required';
//           isValid = false;
//         }
//         break;
      
//       case 1: // Checkpoints
//         for (let i = 0; i < formData.checkpoints.length; i++) {
//           const cp = formData.checkpoints[i];
//           if (!cp.characteristic) {
//             errors[`checkpoint_${i}_characteristic`] = `Checkpoint ${i + 1}: Characteristic is required`;
//             isValid = false;
//           }
//           if (!cp.characteristic_type) {
//             errors[`checkpoint_${i}_characteristic_type`] = `Checkpoint ${i + 1}: Characteristic type is required`;
//             isValid = false;
//           }
//           if (!cp.specification) {
//             errors[`checkpoint_${i}_specification`] = `Checkpoint ${i + 1}: Specification is required`;
//             isValid = false;
//           }
//           if (!cp.method) {
//             errors[`checkpoint_${i}_method`] = `Checkpoint ${i + 1}: Method is required`;
//             isValid = false;
//           }
//           if (!cp.sample_size) {
//             errors[`checkpoint_${i}_sample_size`] = `Checkpoint ${i + 1}: Sample size is required`;
//             isValid = false;
//           }
//           if (cp.sample_size && cp.sample_size <= 0) {
//             errors[`checkpoint_${i}_sample_size`] = `Checkpoint ${i + 1}: Sample size must be greater than 0`;
//             isValid = false;
//           }
//           if (!cp.frequency) {
//             errors[`checkpoint_${i}_frequency`] = `Checkpoint ${i + 1}: Frequency is required`;
//             isValid = false;
//           }
//           if (!cp.gauge_id) {
//             errors[`checkpoint_${i}_gauge_id`] = `Checkpoint ${i + 1}: Gauge is required`;
//             isValid = false;
//           }
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

//     if (!formData.plan_name.trim()) {
//       errors.plan_name = 'Plan name is required';
//       isValid = false;
//     }
//     if (!formData.plan_code) {
//       errors.plan_code = 'Plan code is required';
//       isValid = false;
//     }
//     if (!formData.plan_type) {
//       errors.plan_type = 'Plan type is required';
//       isValid = false;
//     }
//     if (!formData.item_id) {
//       errors.item_id = 'Item is required';
//       isValid = false;
//     }
//     if (!formData.revision_date) {
//       errors.revision_date = 'Revision date is required';
//       isValid = false;
//     }

//     for (let i = 0; i < formData.checkpoints.length; i++) {
//       const cp = formData.checkpoints[i];
//       if (!cp.characteristic) {
//         errors[`checkpoint_${i}_characteristic`] = `Checkpoint ${i + 1}: Characteristic is required`;
//         isValid = false;
//       }
//       if (!cp.characteristic_type) {
//         errors[`checkpoint_${i}_characteristic_type`] = `Checkpoint ${i + 1}: Characteristic type is required`;
//         isValid = false;
//       }
//       if (!cp.specification) {
//         errors[`checkpoint_${i}_specification`] = `Checkpoint ${i + 1}: Specification is required`;
//         isValid = false;
//       }
//       if (!cp.method) {
//         errors[`checkpoint_${i}_method`] = `Checkpoint ${i + 1}: Method is required`;
//         isValid = false;
//       }
//       if (!cp.sample_size) {
//         errors[`checkpoint_${i}_sample_size`] = `Checkpoint ${i + 1}: Sample size is required`;
//         isValid = false;
//       }
//       if (!cp.frequency) {
//         errors[`checkpoint_${i}_frequency`] = `Checkpoint ${i + 1}: Frequency is required`;
//         isValid = false;
//       }
//       if (!cp.gauge_id) {
//         errors[`checkpoint_${i}_gauge_id`] = `Checkpoint ${i + 1}: Gauge is required`;
//         isValid = false;
//       }
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
//         plan_name: formData.plan_name,
//         plan_code: formData.plan_code,
//         plan_type: formData.plan_type,
//         item_id: formData.item_id,
//         revision_no: Number(formData.revision_no),
//         revision_date: formData.revision_date,
//         aql_level: formData.aql_level || undefined,
//         sampling_plan: formData.sampling_plan || undefined,
//         instructions: formData.instructions || '',
//         checkpoints: formData.checkpoints.map(cp => ({
//           step_no: cp.step_no,
//           characteristic: cp.characteristic,
//           characteristic_type: cp.characteristic_type,
//           specification: cp.specification,
//           method: cp.method,
//           sample_size: Number(cp.sample_size),
//           frequency: cp.frequency,
//           gauge_id: cp.gauge_id,
//           acceptance_criteria: cp.acceptance_criteria || '',
//           is_critical: cp.is_critical || false,
//           is_significant: cp.is_significant || false,
//           is_spc: cp.is_spc || false,
//           nominal_value: cp.nominal_value ? Number(cp.nominal_value) : undefined,
//           upper_tolerance: cp.upper_tolerance ? Number(cp.upper_tolerance) : undefined,
//           lower_tolerance: cp.lower_tolerance ? Number(cp.lower_tolerance) : undefined,
//           unit: cp.unit || '',
//           photo_required: cp.photo_required || false
//         }))
//       };

//       let response;
//       if (isEditMode) {
//         response = await axios.put(`${BASE_URL}/api/inspection-plans/${initialData._id}`, requestData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         response = await axios.post(`${BASE_URL}/api/inspection-plans`, requestData, {
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
//         setError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection plan`);
//       }
//     } catch (err) {
//       console.error('Error saving inspection plan:', err);
//       setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection plan. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setFormData({
//       plan_name: '',
//       plan_code: '',
//       plan_type: '',
//       item_id: '',
//       revision_no: 1,
//       revision_date: '',
//       aql_level: '',
//       sampling_plan: '',
//       instructions: '',
//       checkpoints: []
//     });
//     setFieldErrors({});
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Get gauge display name
//   const getGaugeDisplay = (gauge) => {
//     if (!gauge) return '';
//     return `${gauge.gauge_code || gauge.gauge_id} - ${gauge.gauge_name}`;
//   };

//   // Render Step Content
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <PlanIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Plan Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Plan Name <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="plan_name"
//                       value={formData.plan_name}
//                       onChange={handleChange}
//                       placeholder="e.g., Incoming QC Plan for Steel Rods"
//                       error={!!fieldErrors.plan_name}
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
//                     {fieldErrors.plan_name && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.plan_name}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Plan Code <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="plan_code"
//                       value={formData.plan_code}
//                       onChange={handleChange}
//                       placeholder="e.g., IP-2026-001"
//                       error={!!fieldErrors.plan_code}
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
//                     {fieldErrors.plan_code && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.plan_code}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Plan Type <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.plan_type}>
//                       <Select
//                         name="plan_type"
//                         value={formData.plan_type}
//                         onChange={handleChange}
//                         displayEmpty
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         <MenuItem value="" disabled>Select plan type</MenuItem>
//                         {PLAN_TYPE_OPTIONS.map(option => (
//                           <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.plan_type && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.plan_type}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                         Item / Part <span style={{ color: '#EF4444' }}>*</span>
//                       </Typography>
//                       <Tooltip title="Add New Item">
//                         <IconButton
//                           size="small"
//                           onClick={openAddItemDialog}
//                           sx={{
//                             color: COLORS.primary,
//                             p: 0.25,
//                             '&:hover': { bgcolor: COLORS.primaryLight }
//                           }}
//                         >
//                           <AddIcon sx={{ fontSize: '0.8rem' }} />
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                     <Autocomplete
//                       fullWidth
//                       options={items}
//                       getOptionLabel={(option) => `${option.part_no} - ${option.part_description || ''}`}
//                       value={items.find(i => i._id === formData.item_id) || null}
//                       onChange={(event, newValue) => {
//                         setFormData(prev => ({ ...prev, item_id: newValue?._id || '' }));
//                         setFieldErrors(prev => ({ ...prev, item_id: '' }));
//                       }}
//                       loading={loadingItems}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           error={!!fieldErrors.item_id}
//                           helperText={fieldErrors.item_id}
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
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Revision No
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       type="number"
//                       size="small"
//                       name="revision_no"
//                       value={formData.revision_no}
//                       onChange={handleChange}
//                       placeholder="1"
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
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Revision Date <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       type="date"
//                       size="small"
//                       name="revision_date"
//                       value={formData.revision_date}
//                       onChange={handleChange}
//                       error={!!fieldErrors.revision_date}
//                       InputLabelProps={{ shrink: true }}
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
//                     {fieldErrors.revision_date && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.revision_date}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       AQL Level
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="aql_level"
//                       value={formData.aql_level}
//                       onChange={handleChange}
//                       placeholder="e.g., S-4, I, II"
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
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Sampling Plan
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="sampling_plan"
//                       value={formData.sampling_plan}
//                       onChange={handleChange}
//                       placeholder="e.g., Normal, Tightened, Reduced"
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
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Instructions
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       size="small"
//                       name="instructions"
//                       value={formData.instructions}
//                       onChange={handleChange}
//                       placeholder="Follow standard operating procedure QP-007..."
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
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <QrCodeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Inspection Checkpoints
//               </Typography>

//               {formData.checkpoints.length === 0 ? (
//                 <Box sx={{ textAlign: 'center', py: 4 }}>
//                   <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
//                     No checkpoints added yet. Click "Add Checkpoint" to create one.
//                   </Typography>
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                     onClick={addCheckpoint}
//                     sx={{
//                       height: 32,
//                       px: 2,
//                       borderRadius: 1.5,
//                       borderColor: COLORS.primary,
//                       color: COLORS.primary,
//                       fontSize: '0.7rem',
//                       fontWeight: 500,
//                       textTransform: 'none'
//                     }}
//                   >
//                     Add Checkpoint
//                   </Button>
//                 </Box>
//               ) : (
//                 <>
//                   {formData.checkpoints.map((checkpoint, index) => (
//                     <Paper
//                       key={index}
//                       sx={{
//                         p: 1.5,
//                         mb: 2,
//                         bgcolor: COLORS.background.light,
//                         borderRadius: 1.5,
//                         border: `1px solid ${COLORS.border}`
//                       }}
//                     >
//                       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
//                           Checkpoint {checkpoint.step_no || index + 1}
//                         </Typography>
//                         {formData.checkpoints.length > 1 && (
//                           <IconButton
//                             size="small"
//                             onClick={() => removeCheckpoint(index)}
//                             sx={{ color: '#EF4444' }}
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         )}
//                       </Stack>

//                       <Grid container spacing={1.5}>
//                         <Grid size={{ xs: 12, sm: 6 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Characteristic <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <TextField
//                               fullWidth
//                               size="small"
//                               value={checkpoint.characteristic}
//                               onChange={(e) => handleCheckpointChange(index, 'characteristic', e.target.value)}
//                               placeholder="e.g., Length, Diameter, Hardness"
//                               error={!!fieldErrors[`checkpoint_${index}_characteristic`]}
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
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12, sm: 6 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Characteristic Type <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <FormControl fullWidth size="small" error={!!fieldErrors[`checkpoint_${index}_characteristic_type`]}>
//                               <Select
//                                 value={checkpoint.characteristic_type}
//                                 onChange={(e) => handleCheckpointChange(index, 'characteristic_type', e.target.value)}
//                                 displayEmpty
//                                 sx={{
//                                   borderRadius: 1.5,
//                                   fontSize: '0.75rem',
//                                   '& .MuiSelect-select': { py: 1, px: 1.5 }
//                                 }}
//                               >
//                                 <MenuItem value="" disabled>Select type</MenuItem>
//                                 {CHARACTERISTIC_TYPE_OPTIONS.map(option => (
//                                   <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                                     {option}
//                                   </MenuItem>
//                                 ))}
//                               </Select>
//                             </FormControl>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12, sm: 6 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Specification <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <TextField
//                               fullWidth
//                               size="small"
//                               value={checkpoint.specification}
//                               onChange={(e) => handleCheckpointChange(index, 'specification', e.target.value)}
//                               placeholder="e.g., 100mm ± 0.5mm"
//                               error={!!fieldErrors[`checkpoint_${index}_specification`]}
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
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12, sm: 6 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Method <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <TextField
//                               fullWidth
//                               size="small"
//                               value={checkpoint.method}
//                               onChange={(e) => handleCheckpointChange(index, 'method', e.target.value)}
//                               placeholder="e.g., Vernier Caliper, Micrometer"
//                               error={!!fieldErrors[`checkpoint_${index}_method`]}
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
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12, sm: 4 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Sample Size <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <TextField
//                               fullWidth
//                               type="number"
//                               size="small"
//                               value={checkpoint.sample_size}
//                               onChange={(e) => handleCheckpointChange(index, 'sample_size', e.target.value)}
//                               placeholder="5"
//                               error={!!fieldErrors[`checkpoint_${index}_sample_size`]}
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
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12, sm: 4 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Frequency <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <FormControl fullWidth size="small" error={!!fieldErrors[`checkpoint_${index}_frequency`]}>
//                               <Select
//                                 value={checkpoint.frequency}
//                                 onChange={(e) => handleCheckpointChange(index, 'frequency', e.target.value)}
//                                 displayEmpty
//                                 sx={{
//                                   borderRadius: 1.5,
//                                   fontSize: '0.75rem',
//                                   '& .MuiSelect-select': { py: 1, px: 1.5 }
//                                 }}
//                               >
//                                 <MenuItem value="" disabled>Select frequency</MenuItem>
//                                 {FREQUENCY_OPTIONS.map(option => (
//                                   <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                                     {option}
//                                   </MenuItem>
//                                 ))}
//                               </Select>
//                             </FormControl>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12, sm: 4 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Gauge <span style={{ color: '#EF4444' }}>*</span>
//                             </Typography>
//                             <FormControl fullWidth size="small" error={!!fieldErrors[`checkpoint_${index}_gauge_id`]}>
//                               <Select
//                                 value={checkpoint.gauge_id}
//                                 onChange={(e) => handleCheckpointChange(index, 'gauge_id', e.target.value)}
//                                 displayEmpty
//                                 disabled={loadingGauges}
//                                 sx={{
//                                   borderRadius: 1.5,
//                                   fontSize: '0.75rem',
//                                   '& .MuiSelect-select': { py: 1, px: 1.5 }
//                                 }}
//                               >
//                                 <MenuItem value="" disabled>Select gauge</MenuItem>
//                                 {gauges.map(gauge => (
//                                   <MenuItem key={gauge._id} value={gauge._id} sx={{ fontSize: '0.75rem' }}>
//                                     {getGaugeDisplay(gauge)}
//                                   </MenuItem>
//                                 ))}
//                               </Select>
//                             </FormControl>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 12 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                               Acceptance Criteria
//                             </Typography>
//                             <TextField
//                               fullWidth
//                               multiline
//                               rows={2}
//                               size="small"
//                               value={checkpoint.acceptance_criteria}
//                               onChange={(e) => handleCheckpointChange(index, 'acceptance_criteria', e.target.value)}
//                               placeholder="e.g., All samples within tolerance"
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
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </Paper>
//                   ))}

//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                     onClick={addCheckpoint}
//                     sx={{
//                       height: 32,
//                       px: 2,
//                       borderRadius: 1.5,
//                       border: `1px solid ${COLORS.border}`,
//                       color: COLORS.text.secondary,
//                       fontSize: '0.7rem',
//                       fontWeight: 500,
//                       textTransform: 'none',
//                       '&:hover': {
//                         borderColor: COLORS.primary,
//                         bgcolor: `${COLORS.primary}10`
//                       }
//                     }}
//                   >
//                     Add Checkpoint
//                   </Button>
//                 </>
//               )}
//             </Paper>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 5,
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//             border: `1px solid ${COLORS.border}`,
//             overflow: 'hidden'
//           }
//         }}
//       >
//         <DialogTitle sx={{
//           borderBottom: `1px solid ${COLORS.border}`,
//           py: 1.5,
//           px: 2.5,
//           bgcolor: COLORS.background.white,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             {isEditMode ? 'Edit Inspection Plan' : 'Add Inspection Plan'}
//           </Typography>
          
//         </DialogTitle>

//         {/* Stepper */}
//         <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
//           <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                     {label}
//                   </Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>

//         <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//           {renderStepContent(activeStep)}
          
//           {error && (
//             <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
//               {error}
//             </Alert>
//           )}
//         </DialogContent>

//         <DialogActions sx={{
//           px: 2.5,
//           py: 1.5,
//           borderTop: `1px solid ${COLORS.border}`,
//           bgcolor: COLORS.background.white,
//           justifyContent: 'space-between'
//         }}>
//           <Button
//             onClick={handleBack}
//             disabled={activeStep === 0 || loading}
//             startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
//             sx={{
//               height: 32,
//               px: 2,
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
//             Back
//           </Button>
//           <Box>
//             <Button
//               onClick={handleClose}
//               disabled={loading}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 mr: 1,
//                 borderRadius: 1.5,
//                 border: `1px solid ${COLORS.border}`,
//                 color: COLORS.text.secondary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 '&:hover': {
//                   borderColor: COLORS.primary,
//                   bgcolor: `${COLORS.primary}10`
//                 }
//               }}
//             >
//               Cancel
//             </Button>
//             {activeStep === steps.length - 1 ? (
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                 sx={{
//                   height: 32,
//                   px: 2,
//                   borderRadius: 1.5,
//                   bgcolor: COLORS.primary,
//                   fontSize: '0.7rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': {
//                     bgcolor: COLORS.primaryDark,
//                   }
//                 }}
//               >
//                 {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Plan' : 'Create Plan')}
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 disabled={loading}
//                 endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
//                 sx={{
//                   height: 32,
//                   px: 2,
//                   borderRadius: 1.5,
//                   bgcolor: COLORS.primary,
//                   fontSize: '0.7rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': {
//                     bgcolor: COLORS.primaryDark,
//                   }
//                 }}
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         </DialogActions>
//       </Dialog>

//       {/* Add Item Dialog */}
//       <AddItem
//         open={addItemOpen}
//         onClose={() => {
//           setAddItemOpen(false);
//           setCurrentItemIndex(null);
//         }}
//         onAdd={handleItemAdded}
//       />
//     </>
//   );
// };

// export default AddInspectionPlan;




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
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assignment as PlanIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  QrCode as QrCodeIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddItem from '../../master/itemmaster/AddItem';

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
const PLAN_TYPE_OPTIONS = [
  'Incoming', 'In-Process', 'Final', 'Pre-Dispatch', 'Customer-Specific', 'Combined'
];

const CHARACTERISTIC_TYPE_OPTIONS = [
  'Dimensional', 'Visual', 'Functional', 'Material', 'Surface', 'Mechanical', 'Electrical', 'Chemical'
];

const FREQUENCY_OPTIONS = [
  '100%', 'AQL', 'First Article Only', 'Per Lot', 'Per Shift', 'Per Batch'
];

const steps = ['Plan Details', 'Checkpoints'];

const AddInspectionPlan = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [items, setItems] = useState([]);
  const [gauges, setGauges] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingGauges, setLoadingGauges] = useState(false);
  
  // Dialog state for Add Item
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_code: '',
    plan_type: '',
    item_id: '',
    revision_no: 1,
    revision_date: '',
    aql_level: '',
    sampling_plan: '',
    instructions: '',
    checkpoints: []
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Fetch Items (for item_id dropdown)
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

  // Fetch Gauges (for gauge_id dropdown)
  const fetchGauges = useCallback(async () => {
    try {
      setLoadingGauges(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/gauges?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const filteredGauges = (response.data.data || []).filter(g => g.status === 'Calibrated');
        setGauges(filteredGauges);
      }
    } catch (err) {
      console.error('Error fetching gauges:', err);
    } finally {
      setLoadingGauges(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchItems();
      fetchGauges();
    }
  }, [open, fetchItems, fetchGauges]);

  // Handle edit mode - populate form with initial data
  useEffect(() => {
    if (isEditMode && initialData && open) {
      // Get the item ID from the populated item object or direct string
      const itemId = initialData.item_id?._id || initialData.item_id || '';
      
      setFormData({
        plan_name: initialData.plan_name || '',
        plan_code: initialData.plan_id || initialData.plan_code || '', // Use plan_id as plan_code if available
        plan_type: initialData.plan_type || '',
        item_id: itemId,
        revision_no: initialData.revision_no || 1,
        revision_date: initialData.revision_date ? initialData.revision_date.split('T')[0] : new Date().toISOString().split('T')[0],
        aql_level: initialData.aql_level || '',
        sampling_plan: initialData.sampling_plan || '',
        instructions: initialData.instructions || '',
        checkpoints: (initialData.checkpoints || []).map((cp, index) => ({
          step_no: cp.step_no || index + 1,
          characteristic: cp.characteristic || '',
          characteristic_type: cp.characteristic_type || '',
          specification: cp.specification || '',
          method: cp.method || '',
          sample_size: cp.sample_size || '',
          frequency: cp.frequency || '',
          gauge_id: cp.gauge_id?._id || cp.gauge_id || '',
          acceptance_criteria: cp.acceptance_criteria || '',
          is_critical: cp.is_critical || false,
          is_significant: cp.is_significant || false,
          is_spc: cp.is_spc || false,
          nominal_value: cp.nominal_value || '',
          upper_tolerance: cp.upper_tolerance || '',
          lower_tolerance: cp.lower_tolerance || '',
          unit: cp.unit || '',
          photo_required: cp.photo_required || false
        }))
      });
    }
  }, [isEditMode, initialData, open]);

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

  const handleCheckpointChange = (index, field, value) => {
    const updatedCheckpoints = [...formData.checkpoints];
    updatedCheckpoints[index][field] = value;
    setFormData(prev => ({ ...prev, checkpoints: updatedCheckpoints }));
    setFieldErrors(prev => ({ ...prev, [`checkpoint_${index}_${field}`]: '' }));
  };

  const addCheckpoint = () => {
    setFormData(prev => ({
      ...prev,
      checkpoints: [
        ...prev.checkpoints,
        {
          step_no: prev.checkpoints.length + 1,
          characteristic: '',
          characteristic_type: '',
          specification: '',
          method: '',
          sample_size: '',
          frequency: '',
          gauge_id: '',
          acceptance_criteria: '',
          is_critical: false,
          is_significant: false,
          is_spc: false,
          nominal_value: '',
          upper_tolerance: '',
          lower_tolerance: '',
          unit: '',
          photo_required: false
        }
      ]
    }));
  };

  const removeCheckpoint = (index) => {
    if (formData.checkpoints.length > 1) {
      const updatedCheckpoints = formData.checkpoints.filter((_, i) => i !== index);
      updatedCheckpoints.forEach((cp, idx) => {
        cp.step_no = idx + 1;
      });
      setFormData(prev => ({ ...prev, checkpoints: updatedCheckpoints }));
    }
  };

  // Handle item added from AddItem dialog
  const handleItemAdded = (newItem) => {
    setItems(prev => [...prev, newItem]);
    
    if (currentItemIndex !== null) {
      setFormData(prev => ({ ...prev, item_id: newItem._id }));
    }
    setCurrentItemIndex(null);
  };

  const openAddItemDialog = () => {
    setAddItemOpen(true);
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    switch (step) {
      case 0: // Plan Details
        if (!formData.plan_name.trim()) {
          errors.plan_name = 'Plan name is required';
          errorMessages.push('Plan name is required');
          isValid = false;
        }
        if (!formData.plan_code) {
          errors.plan_code = 'Plan code is required';
          errorMessages.push('Plan code is required');
          isValid = false;
        }
        if (!formData.plan_type) {
          errors.plan_type = 'Plan type is required';
          errorMessages.push('Plan type is required');
          isValid = false;
        }
        if (!formData.item_id) {
          errors.item_id = 'Item is required';
          errorMessages.push('Item is required');
          isValid = false;
        }
        if (!formData.revision_date) {
          errors.revision_date = 'Revision date is required';
          errorMessages.push('Revision date is required');
          isValid = false;
        }
        break;
      
      case 1: // Checkpoints
        for (let i = 0; i < formData.checkpoints.length; i++) {
          const cp = formData.checkpoints[i];
          if (!cp.characteristic) {
            errors[`checkpoint_${i}_characteristic`] = `Checkpoint ${i + 1}: Characteristic is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Characteristic is required`);
            isValid = false;
          }
          if (!cp.characteristic_type) {
            errors[`checkpoint_${i}_characteristic_type`] = `Checkpoint ${i + 1}: Characteristic type is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Characteristic type is required`);
            isValid = false;
          }
          if (!cp.specification) {
            errors[`checkpoint_${i}_specification`] = `Checkpoint ${i + 1}: Specification is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Specification is required`);
            isValid = false;
          }
          if (!cp.method) {
            errors[`checkpoint_${i}_method`] = `Checkpoint ${i + 1}: Method is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Method is required`);
            isValid = false;
          }
          if (!cp.sample_size) {
            errors[`checkpoint_${i}_sample_size`] = `Checkpoint ${i + 1}: Sample size is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Sample size is required`);
            isValid = false;
          }
          if (cp.sample_size && cp.sample_size <= 0) {
            errors[`checkpoint_${i}_sample_size`] = `Checkpoint ${i + 1}: Sample size must be greater than 0`;
            errorMessages.push(`Checkpoint ${i + 1}: Sample size must be greater than 0`);
            isValid = false;
          }
          if (!cp.frequency) {
            errors[`checkpoint_${i}_frequency`] = `Checkpoint ${i + 1}: Frequency is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Frequency is required`);
            isValid = false;
          }
          if (!cp.gauge_id) {
            errors[`checkpoint_${i}_gauge_id`] = `Checkpoint ${i + 1}: Gauge is required`;
            errorMessages.push(`Checkpoint ${i + 1}: Gauge is required`);
            isValid = false;
          }
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

    if (!formData.plan_name.trim()) {
      errors.plan_name = 'Plan name is required';
      errorMessages.push('Plan name is required');
      isValid = false;
    }
    if (!formData.plan_code) {
      errors.plan_code = 'Plan code is required';
      errorMessages.push('Plan code is required');
      isValid = false;
    }
    if (!formData.plan_type) {
      errors.plan_type = 'Plan type is required';
      errorMessages.push('Plan type is required');
      isValid = false;
    }
    if (!formData.item_id) {
      errors.item_id = 'Item is required';
      errorMessages.push('Item is required');
      isValid = false;
    }
    if (!formData.revision_date) {
      errors.revision_date = 'Revision date is required';
      errorMessages.push('Revision date is required');
      isValid = false;
    }

    for (let i = 0; i < formData.checkpoints.length; i++) {
      const cp = formData.checkpoints[i];
      if (!cp.characteristic) {
        errors[`checkpoint_${i}_characteristic`] = `Checkpoint ${i + 1}: Characteristic is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Characteristic is required`);
        isValid = false;
      }
      if (!cp.characteristic_type) {
        errors[`checkpoint_${i}_characteristic_type`] = `Checkpoint ${i + 1}: Characteristic type is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Characteristic type is required`);
        isValid = false;
      }
      if (!cp.specification) {
        errors[`checkpoint_${i}_specification`] = `Checkpoint ${i + 1}: Specification is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Specification is required`);
        isValid = false;
      }
      if (!cp.method) {
        errors[`checkpoint_${i}_method`] = `Checkpoint ${i + 1}: Method is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Method is required`);
        isValid = false;
      }
      if (!cp.sample_size) {
        errors[`checkpoint_${i}_sample_size`] = `Checkpoint ${i + 1}: Sample size is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Sample size is required`);
        isValid = false;
      }
      if (!cp.frequency) {
        errors[`checkpoint_${i}_frequency`] = `Checkpoint ${i + 1}: Frequency is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Frequency is required`);
        isValid = false;
      }
      if (!cp.gauge_id) {
        errors[`checkpoint_${i}_gauge_id`] = `Checkpoint ${i + 1}: Gauge is required`;
        errorMessages.push(`Checkpoint ${i + 1}: Gauge is required`);
        isValid = false;
      }
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
        plan_name: formData.plan_name,
        plan_code: formData.plan_code,
        plan_type: formData.plan_type,
        item_id: formData.item_id,
        revision_no: Number(formData.revision_no),
        revision_date: formData.revision_date,
        aql_level: formData.aql_level || undefined,
        sampling_plan: formData.sampling_plan || undefined,
        instructions: formData.instructions || '',
        checkpoints: formData.checkpoints.map(cp => ({
          step_no: cp.step_no,
          characteristic: cp.characteristic,
          characteristic_type: cp.characteristic_type,
          specification: cp.specification,
          method: cp.method,
          sample_size: Number(cp.sample_size),
          frequency: cp.frequency,
          gauge_id: cp.gauge_id,
          acceptance_criteria: cp.acceptance_criteria || '',
          is_critical: cp.is_critical || false,
          is_significant: cp.is_significant || false,
          is_spc: cp.is_spc || false,
          nominal_value: cp.nominal_value ? Number(cp.nominal_value) : undefined,
          upper_tolerance: cp.upper_tolerance ? Number(cp.upper_tolerance) : undefined,
          lower_tolerance: cp.lower_tolerance ? Number(cp.lower_tolerance) : undefined,
          unit: cp.unit || '',
          photo_required: cp.photo_required || false
        }))
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/api/inspection-plans/${initialData._id}`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/inspection-plans`, requestData, {
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
        showError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection plan`);
      }
    } catch (err) {
      console.error('Error saving inspection plan:', err);
      showError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} inspection plan. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      plan_name: '',
      plan_code: '',
      plan_type: '',
      item_id: '',
      revision_no: 1,
      revision_date: new Date().toISOString().split('T')[0],
      aql_level: '',
      sampling_plan: '',
      instructions: '',
      checkpoints: []
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get gauge display name
  const getGaugeDisplay = (gauge) => {
    if (!gauge) return '';
    return `${gauge.gauge_code || gauge.gauge_id} - ${gauge.gauge_name}`;
  };

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <PlanIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Plan Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Plan Name <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="plan_name"
                      value={formData.plan_name}
                      onChange={handleChange}
                      placeholder="e.g., Incoming QC Plan for Steel Rods"
                      error={!!fieldErrors.plan_name}
                      helperText={fieldErrors.plan_name}
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
                      Plan Code <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="plan_code"
                      value={formData.plan_code}
                      onChange={handleChange}
                      placeholder="e.g., IP-2026-001"
                      error={!!fieldErrors.plan_code}
                      helperText={fieldErrors.plan_code}
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
                      Plan Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.plan_type}>
                      <Select
                        name="plan_type"
                        value={formData.plan_type}
                        onChange={handleChange}
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 },
                          '&.Mui-error': { borderColor: '#EF4444' }
                        }}
                      >
                        <MenuItem value="" disabled>Select plan type</MenuItem>
                        {PLAN_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.plan_type && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.plan_type}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Item / Part <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Tooltip title="Add New Item">
                        <IconButton
                          size="small"
                          onClick={openAddItemDialog}
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
                      options={items}
                      getOptionLabel={(option) => `${option.part_no} - ${option.part_description || ''}`}
                      value={items.find(i => i._id === formData.item_id) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, item_id: newValue?._id || '' }));
                        setFieldErrors(prev => ({ ...prev, item_id: '' }));
                      }}
                      loading={loadingItems}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
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
                      Revision No
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="revision_no"
                      value={formData.revision_no}
                      onChange={handleChange}
                      placeholder="1"
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
                      Revision Date <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="revision_date"
                      value={formData.revision_date}
                      onChange={handleChange}
                      error={!!fieldErrors.revision_date}
                      helperText={fieldErrors.revision_date}
                      InputLabelProps={{ shrink: true }}
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
                      AQL Level
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="aql_level"
                      value={formData.aql_level}
                      onChange={handleChange}
                      placeholder="e.g., S-4, I, II"
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
                      Sampling Plan
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="sampling_plan"
                      value={formData.sampling_plan}
                      onChange={handleChange}
                      placeholder="e.g., Normal, Tightened, Reduced"
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

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Instructions
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      placeholder="Follow standard operating procedure QP-007..."
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
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <QrCodeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Inspection Checkpoints
              </Typography>

              {formData.checkpoints.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
                    No checkpoints added yet. Click "Add Checkpoint" to create one.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                    onClick={addCheckpoint}
                    sx={{
                      height: 32,
                      px: 2,
                      borderRadius: 1.5,
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      textTransform: 'none'
                    }}
                  >
                    Add Checkpoint
                  </Button>
                </Box>
              ) : (
                <>
                  {formData.checkpoints.map((checkpoint, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 1.5,
                        mb: 2,
                        bgcolor: COLORS.background.light,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          Checkpoint {checkpoint.step_no || index + 1}
                        </Typography>
                        {formData.checkpoints.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={() => removeCheckpoint(index)}
                            sx={{ color: '#EF4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>

                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Characteristic <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              value={checkpoint.characteristic}
                              onChange={(e) => handleCheckpointChange(index, 'characteristic', e.target.value)}
                              placeholder="e.g., Length, Diameter, Hardness"
                              error={!!fieldErrors[`checkpoint_${index}_characteristic`]}
                              helperText={fieldErrors[`checkpoint_${index}_characteristic`]}
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
                              Characteristic Type <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <FormControl fullWidth size="small" error={!!fieldErrors[`checkpoint_${index}_characteristic_type`]}>
                              <Select
                                value={checkpoint.characteristic_type}
                                onChange={(e) => handleCheckpointChange(index, 'characteristic_type', e.target.value)}
                                displayEmpty
                                sx={{
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  '& .MuiSelect-select': { py: 1, px: 1.5 },
                                  '&.Mui-error': { borderColor: '#EF4444' }
                                }}
                              >
                                <MenuItem value="" disabled>Select type</MenuItem>
                                {CHARACTERISTIC_TYPE_OPTIONS.map(option => (
                                  <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                              {fieldErrors[`checkpoint_${index}_characteristic_type`] && (
                                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                                  {fieldErrors[`checkpoint_${index}_characteristic_type`]}
                                </Typography>
                              )}
                            </FormControl>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Specification <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              value={checkpoint.specification}
                              onChange={(e) => handleCheckpointChange(index, 'specification', e.target.value)}
                              placeholder="e.g., 100mm ± 0.5mm"
                              error={!!fieldErrors[`checkpoint_${index}_specification`]}
                              helperText={fieldErrors[`checkpoint_${index}_specification`]}
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
                              Method <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              value={checkpoint.method}
                              onChange={(e) => handleCheckpointChange(index, 'method', e.target.value)}
                              placeholder="e.g., Vernier Caliper, Micrometer"
                              error={!!fieldErrors[`checkpoint_${index}_method`]}
                              helperText={fieldErrors[`checkpoint_${index}_method`]}
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

                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Sample Size <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              type="number"
                              size="small"
                              value={checkpoint.sample_size}
                              onChange={(e) => handleCheckpointChange(index, 'sample_size', e.target.value)}
                              placeholder="5"
                              error={!!fieldErrors[`checkpoint_${index}_sample_size`]}
                              helperText={fieldErrors[`checkpoint_${index}_sample_size`]}
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

                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Frequency <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <FormControl fullWidth size="small" error={!!fieldErrors[`checkpoint_${index}_frequency`]}>
                              <Select
                                value={checkpoint.frequency}
                                onChange={(e) => handleCheckpointChange(index, 'frequency', e.target.value)}
                                displayEmpty
                                sx={{
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  '& .MuiSelect-select': { py: 1, px: 1.5 },
                                  '&.Mui-error': { borderColor: '#EF4444' }
                                }}
                              >
                                <MenuItem value="" disabled>Select frequency</MenuItem>
                                {FREQUENCY_OPTIONS.map(option => (
                                  <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                              {fieldErrors[`checkpoint_${index}_frequency`] && (
                                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                                  {fieldErrors[`checkpoint_${index}_frequency`]}
                                </Typography>
                              )}
                            </FormControl>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Gauge <span style={{ color: '#EF4444' }}>*</span>
                            </Typography>
                            <FormControl fullWidth size="small" error={!!fieldErrors[`checkpoint_${index}_gauge_id`]}>
                              <Select
                                value={checkpoint.gauge_id}
                                onChange={(e) => handleCheckpointChange(index, 'gauge_id', e.target.value)}
                                displayEmpty
                                disabled={loadingGauges}
                                sx={{
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  '& .MuiSelect-select': { py: 1, px: 1.5 },
                                  '&.Mui-error': { borderColor: '#EF4444' }
                                }}
                              >
                                <MenuItem value="" disabled>Select gauge</MenuItem>
                                {gauges.map(gauge => (
                                  <MenuItem key={gauge._id} value={gauge._id} sx={{ fontSize: '0.75rem' }}>
                                    {getGaugeDisplay(gauge)}
                                  </MenuItem>
                                ))}
                              </Select>
                              {fieldErrors[`checkpoint_${index}_gauge_id`] && (
                                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                                  {fieldErrors[`checkpoint_${index}_gauge_id`]}
                                </Typography>
                              )}
                            </FormControl>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                              Acceptance Criteria
                            </Typography>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              size="small"
                              value={checkpoint.acceptance_criteria}
                              onChange={(e) => handleCheckpointChange(index, 'acceptance_criteria', e.target.value)}
                              placeholder="e.g., All samples within tolerance"
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
                    onClick={addCheckpoint}
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
                    Add Checkpoint
                  </Button>
                </>
              )}
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
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
            {isEditMode ? 'Edit Inspection Plan' : 'Add Inspection Plan'}
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
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Plan' : 'Create Plan')}
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

      {/* Add Item Dialog */}
      <AddItem
        open={addItemOpen}
        onClose={() => {
          setAddItemOpen(false);
          setCurrentItemIndex(null);
        }}
        onAdd={handleItemAdded}
      />
    </>
  );
};

export default AddInspectionPlan;