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
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Autocomplete,
//   Divider,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   styled,
//   CircularProgress,
//   Chip
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Inventory as InventoryIcon,
//   LocalShipping as LocalShippingIcon,
//   Business as BusinessIcon,
//   Description as DescriptionIcon,
//   LocationOn as LocationIcon
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
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
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

// // Vehicle Type Options (from backend enums)
// const VEHICLE_TYPE_OPTIONS = [
//   'Mini Truck',
//   'Tempo',
//   'Truck',
//   'Container',
//   'Courier',
//   'Hand Delivery'
// ];

// const TRANSPORTER_OPTIONS = [
//   'VRL Logistics',
//   'Gati Limited',
//   'Blue Dart Express',
//   'DTDC Express',
//   'Container Corporation of India',
//   'Allcargo Logistics',
//   'Mahindra Logistics',
//   'TCI Express',
//   'Safexpress',
//   'Other'
// ];

// const steps = ['Sales Order Info', 'Schedule Details', 'Items Details'];

// const AddDeliverySchedule = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
  
//   // Data fetching states
//   const [salesOrders, setSalesOrders] = useState([]);
//   const [selectedSO, setSelectedSO] = useState(null);
//   const [loadingSO, setLoadingSO] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [shippingAddress, setShippingAddress] = useState(null);

//   // Form data
//   const [formData, setFormData] = useState({
//     so_id: '',
//     so_number: '',
//     customer_id: '',
//     shipping_address_id: '',
//     dispatch_date: '',
//     transporter_preference: '',
//     vehicle_type: '',
//     special_instructions: '',
//     items: []
//   });

//   // Helper function to format shipping address for display
//   const formatShippingAddress = (address) => {
//     if (!address) return '';
//     const parts = [];
//     if (address.line1) parts.push(address.line1);
//     if (address.line2) parts.push(address.line2);
//     if (address.city) parts.push(address.city);
//     if (address.district) parts.push(address.district);
//     if (address.state) parts.push(address.state);
//     if (address.pincode) parts.push(address.pincode);
//     if (address.country) parts.push(address.country);
//     return parts.join(', ');
//   };

//   // Check if address has valid data
//   const isValidAddress = (address) => {
//     if (!address) return false;
//     return address.line1 || address.city || address.state || address.pincode;
//   };

//   // Fetch Sales Orders
//   const fetchSalesOrders = useCallback(async () => {
//     try {
//       setLoadingSO(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/sales-orders?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setSalesOrders(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching sales orders:', err);
//     } finally {
//       setLoadingSO(false);
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

//   // Fetch data when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchSalesOrders();
//       fetchCustomers();
//     }
//   }, [open, fetchSalesOrders, fetchCustomers]);

//   // Handle edit mode - populate form with initial data
//   useEffect(() => {
//     if (isEditMode && initialData && open) {
//       setFormData({
//         so_id: initialData.so_id || '',
//         so_number: initialData.so_number || '',
//         customer_id: initialData.customer_id || '',
//         shipping_address_id: initialData.shipping_address_id || '',
//         dispatch_date: initialData.dispatch_date ? initialData.dispatch_date.split('T')[0] : '',
//         transporter_preference: initialData.transporter_preference || '',
//         vehicle_type: initialData.vehicle_type || '',
//         special_instructions: initialData.special_instructions || '',
//         items: (initialData.items || []).map(item => ({
//           so_item_id: item.so_item_id || '',
//           part_no: item.part_no || '',
//           part_name: item.part_name || '',
//           scheduled_qty: item.scheduled_qty || '',
//           available_fg_qty: item.available_fg_qty || '',
//           remarks: item.remarks || ''
//         }))
//       });

//       // Find and set selected SO
//       const so = salesOrders.find(s => s._id === initialData.so_id);
//       if (so) {
//         setSelectedSO(so);
//         // Set shipping address from the sales order
//         if (so.shipping_address && isValidAddress(so.shipping_address)) {
//           setShippingAddress(so.shipping_address);
//         }
//       }

//       // Find and set selected customer
//       const customer = customers.find(c => c._id === initialData.customer_id);
//       if (customer) {
//         setSelectedCustomer(customer);
//       }
//     }
//   }, [isEditMode, initialData, open, salesOrders, customers]);

//   // Handle SO selection
//   const handleSOChange = (event, newValue) => {
//     setSelectedSO(newValue);
//     if (newValue) {
//       // Set shipping address from the sales order
//       const shippingAddr = newValue.shipping_address;
      
//       // Check if address is valid
//       if (shippingAddr && isValidAddress(shippingAddr)) {
//         setShippingAddress(shippingAddr);
//       } else {
//         setShippingAddress(null);
//       }
      
//       // Find customer from the customers list
//       const customer = customers.find(c => c._id === newValue.customer_id);
//       if (customer) {
//         setSelectedCustomer(customer);
//       } else {
//         setSelectedCustomer(null);
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         so_id: newValue._id,
//         so_number: newValue.so_number,
//         customer_id: newValue.customer_id,
//         shipping_address_id: (shippingAddr && isValidAddress(shippingAddr)) ? JSON.stringify(shippingAddr) : '',
//         items: (newValue.items || []).map(item => ({
//           so_item_id: item._id,
//           part_no: item.part_no,
//           part_name: item.part_name,
//           scheduled_qty: '',
//           available_fg_qty: '',
//           remarks: ''
//         }))
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         so_id: '',
//         so_number: '',
//         customer_id: '',
//         shipping_address_id: '',
//         items: []
//       }));
//       setSelectedCustomer(null);
//       setShippingAddress(null);
//     }
//     setFieldErrors({});
//     setError('');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index][field] = value;
//     setFormData(prev => ({ ...prev, items: updatedItems }));
//     setFieldErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Sales Order Info
//         if (!formData.so_id && !isEditMode) {
//           errors.so_id = 'Sales Order is required';
//           isValid = false;
//         }
//         if (!formData.customer_id) {
//           errors.customer_id = 'Customer is required';
//           isValid = false;
//         }
//         // Check if shipping address has actual data
//         if (!formData.shipping_address_id) {
//           errors.shipping_address_id = 'Shipping address is required';
//           isValid = false;
//         } else {
//           try {
//             const address = JSON.parse(formData.shipping_address_id);
//             if (!isValidAddress(address)) {
//               errors.shipping_address_id = 'Valid shipping address is required. Please update the sales order first.';
//               isValid = false;
//             }
//           } catch (e) {
//             errors.shipping_address_id = 'Invalid shipping address';
//             isValid = false;
//           }
//         }
//         break;
      
//       case 1: // Schedule Details
//         if (!formData.dispatch_date) {
//           errors.dispatch_date = 'Dispatch date is required';
//           isValid = false;
//         }
//         if (!formData.transporter_preference) {
//           errors.transporter_preference = 'Transporter preference is required';
//           isValid = false;
//         }
//         if (!formData.vehicle_type) {
//           errors.vehicle_type = 'Vehicle type is required';
//           isValid = false;
//         }
//         break;
      
//       case 2: // Items Details
//         for (let i = 0; i < formData.items.length; i++) {
//           if (!formData.items[i].scheduled_qty) {
//             errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Scheduled quantity is required`;
//             isValid = false;
//           }
//           if (formData.items[i].scheduled_qty && Number(formData.items[i].scheduled_qty) <= 0) {
//             errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Quantity must be greater than 0`;
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

//     if (!formData.so_id && !isEditMode) {
//       errors.so_id = 'Sales Order is required';
//       isValid = false;
//     }
//     if (!formData.customer_id) {
//       errors.customer_id = 'Customer is required';
//       isValid = false;
//     }
//     if (!formData.shipping_address_id) {
//       errors.shipping_address_id = 'Shipping address is required';
//       isValid = false;
//     } else {
//       try {
//         const address = JSON.parse(formData.shipping_address_id);
//         if (!isValidAddress(address)) {
//           errors.shipping_address_id = 'Valid shipping address is required';
//           isValid = false;
//         }
//       } catch (e) {
//         errors.shipping_address_id = 'Invalid shipping address';
//         isValid = false;
//       }
//     }
//     if (!formData.dispatch_date) {
//       errors.dispatch_date = 'Dispatch date is required';
//       isValid = false;
//     }
//     if (!formData.transporter_preference) {
//       errors.transporter_preference = 'Transporter preference is required';
//       isValid = false;
//     }
//     if (!formData.vehicle_type) {
//       errors.vehicle_type = 'Vehicle type is required';
//       isValid = false;
//     }
    
//     for (let i = 0; i < formData.items.length; i++) {
//       if (!formData.items[i].scheduled_qty) {
//         errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Scheduled quantity is required`;
//         isValid = false;
//       }
//       if (formData.items[i].scheduled_qty && Number(formData.items[i].scheduled_qty) <= 0) {
//         errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Quantity must be greater than 0`;
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
//         dispatch_date: formData.dispatch_date,
//         so_id: formData.so_id,
//         so_number: formData.so_number,
//         customer_id: formData.customer_id,
//         shipping_address_id: formData.shipping_address_id,
//         items: formData.items.map(item => ({
//           so_item_id: item.so_item_id,
//           part_no: item.part_no,
//           part_name: item.part_name,
//           scheduled_qty: Number(item.scheduled_qty),
//           available_fg_qty: item.available_fg_qty ? Number(item.available_fg_qty) : 0,
//           remarks: item.remarks || ''
//         })),
//         transporter_preference: formData.transporter_preference,
//         vehicle_type: formData.vehicle_type,
//         special_instructions: formData.special_instructions || ''
//       };

//       let response;
//       if (isEditMode) {
//         response = await axios.put(`${BASE_URL}/api/delivery-schedules/${initialData._id}`, requestData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         response = await axios.post(`${BASE_URL}/api/delivery-schedules`, requestData, {
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
//         setError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} delivery schedule`);
//       }
//     } catch (err) {
//       console.error('Error saving delivery schedule:', err);
//       setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} delivery schedule. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setSelectedSO(null);
//     setSelectedCustomer(null);
//     setShippingAddress(null);
//     setFormData({
//       so_id: '',
//       so_number: '',
//       customer_id: '',
//       shipping_address_id: '',
//       dispatch_date: '',
//       transporter_preference: '',
//       vehicle_type: '',
//       special_instructions: '',
//       items: []
//     });
//     setFieldErrors({});
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Get customer name helper
//   const getCustomerName = (so) => {
//     if (!so) return '';
//     const customer = customers.find(c => c._id === so.customer_id);
//     return customer?.customer_name || 'Unknown Customer';
//   };

//   // Render Step Content
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Sales Order & Customer Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 {!isEditMode && (
//                   <Grid size={{ xs: 12 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                         Select Sales Order <span style={{ color: '#EF4444' }}>*</span>
//                       </Typography>
//                       <Autocomplete
//                         fullWidth
//                         options={salesOrders}
//                         getOptionLabel={(option) => {
//                           const customerName = getCustomerName(option);
//                           return `${option.so_number} - ${customerName}`;
//                         }}
//                         loading={loadingSO}
//                         value={selectedSO}
//                         onChange={handleSOChange}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             size="small"
//                             placeholder="Search and select sales order"
//                             error={!!fieldErrors.so_id}
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
//                             InputProps={{
//                               ...params.InputProps,
//                               endAdornment: (
//                                 <>
//                                   {loadingSO && <CircularProgress size={16} />}
//                                   {params.InputProps.endAdornment}
//                                 </>
//                               ),
//                             }}
//                           />
//                         )}
//                       />
//                       {fieldErrors.so_id && (
//                         <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                           {fieldErrors.so_id}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Grid>
//                 )}

//                 {isEditMode && (
//                   <Grid size={{ xs: 12 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                         Sales Order Number
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={formData.so_number}
//                         InputProps={{ readOnly: true }}
//                         sx={{
//                           '& .MuiOutlinedInput-root': {
//                             borderRadius: 1.5,
//                             fontSize: '0.75rem',
//                             bgcolor: '#F5F5F5'
//                           }
//                         }}
//                       />
//                     </Box>
//                   </Grid>
//                 )}

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Customer <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={selectedCustomer ? selectedCustomer.customer_name : (selectedSO ? getCustomerName(selectedSO) : '')}
//                       InputProps={{ readOnly: true }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           bgcolor: '#F5F5F5'
//                         }
//                       }}
//                     />
//                     {fieldErrors.customer_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.customer_id}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Shipping Address <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     {shippingAddress && isValidAddress(shippingAddress) ? (
//                       <Paper
//                         variant="outlined"
//                         sx={{
//                           p: 1.5,
//                           borderRadius: 1.5,
//                           border: fieldErrors.shipping_address_id ? '1px solid #EF4444' : `1px solid ${COLORS.border}`,
//                           bgcolor: COLORS.background.light
//                         }}
//                       >
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.5 }}>
//                           {shippingAddress.line1 && <span>{shippingAddress.line1}<br /></span>}
//                           {shippingAddress.line2 && <span>{shippingAddress.line2}<br /></span>}
//                           {shippingAddress.city && shippingAddress.district && 
//                             <span>{shippingAddress.city}, {shippingAddress.district}<br /></span>
//                           }
//                           {shippingAddress.city && !shippingAddress.district && 
//                             <span>{shippingAddress.city}<br /></span>
//                           }
//                           {shippingAddress.state && shippingAddress.pincode && 
//                             <span>{shippingAddress.state} - {shippingAddress.pincode}<br /></span>
//                           }
//                           {shippingAddress.country && <span>{shippingAddress.country}</span>}
//                         </Typography>
//                       </Paper>
//                     ) : (
//                       <Paper
//                         variant="outlined"
//                         sx={{
//                           p: 1.5,
//                           borderRadius: 1.5,
//                           border: fieldErrors.shipping_address_id ? '1px solid #EF4444' : `1px solid ${COLORS.border}`,
//                           bgcolor: COLORS.background.light
//                         }}
//                       >
//                         <Typography sx={{ fontSize: '0.75rem', color: '#EF4444' }}>
//                           {selectedSO ? (
//                             '⚠️ No valid shipping address found for this sales order. Please update the sales order with shipping address first.'
//                           ) : (
//                             'Please select a sales order to view shipping address'
//                           )}
//                         </Typography>
//                       </Paper>
//                     )}
//                     {fieldErrors.shipping_address_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.shipping_address_id}
//                       </Typography>
//                     )}
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
//                 <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Schedule Details
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Dispatch Date <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       type="date"
//                       size="small"
//                       name="dispatch_date"
//                       value={formData.dispatch_date}
//                       onChange={handleChange}
//                       error={!!fieldErrors.dispatch_date}
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
//                     {fieldErrors.dispatch_date && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.dispatch_date}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Transporter Preference <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       fullWidth
//                       options={TRANSPORTER_OPTIONS}
//                       freeSolo
//                       value={formData.transporter_preference}
//                       onInputChange={(event, newValue) => {
//                         setFormData(prev => ({ ...prev, transporter_preference: newValue || '' }));
//                       }}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           placeholder="Select or enter transporter name"
//                           error={!!fieldErrors.transporter_preference}
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
//                     {fieldErrors.transporter_preference && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.transporter_preference}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Vehicle Type <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.vehicle_type}>
//                       <Select
//                         value={formData.vehicle_type}
//                         onChange={handleChange}
//                         name="vehicle_type"
//                         displayEmpty
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
//                           Select vehicle type
//                         </MenuItem>
//                         {VEHICLE_TYPE_OPTIONS.map(option => (
//                           <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.vehicle_type && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.vehicle_type}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Special Instructions
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       size="small"
//                       name="special_instructions"
//                       value={formData.special_instructions}
//                       onChange={handleChange}
//                       placeholder="e.g., Handle with care, Fragile items, etc."
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

//       case 2:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Items to Schedule <span style={{ color: '#EF4444' }}>*</span>
//               </Typography>
              
//               {formData.items.length === 0 ? (
//                 <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//                   Please select a Sales Order to load items
//                 </Alert>
//               ) : (
//                 formData.items.map((item, index) => (
//                   <Paper
//                     key={index}
//                     sx={{
//                       p: 1.5,
//                       mb: 2,
//                       bgcolor: COLORS.background.light,
//                       borderRadius: 1.5,
//                       border: `1px solid ${COLORS.border}`
//                     }}
//                   >
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                       Item {index + 1}: {item.part_no} - {item.part_name}
//                     </Typography>
                    
//                     <Grid container spacing={1.5}>
//                       <Grid size={{ xs: 12, sm: 4 }}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                           <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                             Scheduled Qty <span style={{ color: '#EF4444' }}>*</span>
//                           </Typography>
//                           <TextField
//                             fullWidth
//                             type="number"
//                             size="small"
//                             value={item.scheduled_qty}
//                             onChange={(e) => handleItemChange(index, 'scheduled_qty', e.target.value)}
//                             placeholder="0"
//                             error={!!fieldErrors[`item_${index}_scheduled_qty`]}
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
//                           {fieldErrors[`item_${index}_scheduled_qty`] && (
//                             <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                               {fieldErrors[`item_${index}_scheduled_qty`]}
//                             </Typography>
//                           )}
//                         </Box>
//                       </Grid>
                      
//                       <Grid size={{ xs: 12, sm: 4 }}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                           <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                             Available FG Qty
//                           </Typography>
//                           <TextField
//                             fullWidth
//                             type="number"
//                             size="small"
//                             value={item.available_fg_qty}
//                             onChange={(e) => handleItemChange(index, 'available_fg_qty', e.target.value)}
//                             placeholder="0"
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
//                         </Box>
//                       </Grid>
                      
//                       <Grid size={{ xs: 12, sm: 4 }}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                           <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                             Remarks
//                           </Typography>
//                           <TextField
//                             fullWidth
//                             size="small"
//                             value={item.remarks}
//                             onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
//                             placeholder="Any remarks..."
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
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </Paper>
//                 ))
//               )}
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
//           {isEditMode ? 'Edit Delivery Schedule' : 'Create Delivery Schedule'}
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
//               disabled={loading || (!isEditMode && !selectedSO)}
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
//               {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Schedule' : 'Create Schedule')}
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

// export default AddDeliverySchedule;




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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Chip,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  Error as ErrorIcon
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
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
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

// Vehicle Type Options (from backend enums)
const VEHICLE_TYPE_OPTIONS = [
  'Mini Truck',
  'Tempo',
  'Truck',
  'Container',
  'Courier',
  'Hand Delivery'
];

const TRANSPORTER_OPTIONS = [
  'VRL Logistics',
  'Gati Limited',
  'Blue Dart Express',
  'DTDC Express',
  'Container Corporation of India',
  'Allcargo Logistics',
  'Mahindra Logistics',
  'TCI Express',
  'Safexpress',
  'Other'
];

const steps = ['Sales Order Info', 'Schedule Details', 'Items Details'];

const AddDeliverySchedule = ({ open, onClose, onSuccess, initialData, isEditMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedSO, setSelectedSO] = useState(null);
  const [loadingSO, setLoadingSO] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    so_id: '',
    so_number: '',
    customer_id: '',
    shipping_address_id: '',
    dispatch_date: '',
    transporter_preference: '',
    vehicle_type: '',
    special_instructions: '',
    items: []
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Helper function to format shipping address for display
  const formatShippingAddress = (address) => {
    if (!address) return '';
    const parts = [];
    if (address.line1) parts.push(address.line1);
    if (address.line2) parts.push(address.line2);
    if (address.city) parts.push(address.city);
    if (address.district) parts.push(address.district);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
    if (address.country) parts.push(address.country);
    return parts.join(', ');
  };

  // Check if address has valid data
  const isValidAddress = (address) => {
    if (!address) return false;
    return address.line1 || address.city || address.state || address.pincode;
  };

  // Fetch Sales Orders
  const fetchSalesOrders = useCallback(async () => {
    try {
      setLoadingSO(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/sales-orders?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSalesOrders(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sales orders:', err);
    } finally {
      setLoadingSO(false);
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

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchSalesOrders();
      fetchCustomers();
    }
  }, [open, fetchSalesOrders, fetchCustomers]);

  // Handle edit mode - populate form with initial data
  useEffect(() => {
    if (isEditMode && initialData && open) {
      setFormData({
        so_id: initialData.so_id || '',
        so_number: initialData.so_number || '',
        customer_id: initialData.customer_id || '',
        shipping_address_id: initialData.shipping_address_id || '',
        dispatch_date: initialData.dispatch_date ? initialData.dispatch_date.split('T')[0] : '',
        transporter_preference: initialData.transporter_preference || '',
        vehicle_type: initialData.vehicle_type || '',
        special_instructions: initialData.special_instructions || '',
        items: (initialData.items || []).map(item => ({
          so_item_id: item.so_item_id || '',
          part_no: item.part_no || '',
          part_name: item.part_name || '',
          scheduled_qty: item.scheduled_qty || '',
          available_fg_qty: item.available_fg_qty || '',
          remarks: item.remarks || ''
        }))
      });

      // Find and set selected SO
      const so = salesOrders.find(s => s._id === initialData.so_id);
      if (so) {
        setSelectedSO(so);
        // Set shipping address from the sales order
        if (so.shipping_address && isValidAddress(so.shipping_address)) {
          setShippingAddress(so.shipping_address);
        }
      }

      // Find and set selected customer
      const customer = customers.find(c => c._id === initialData.customer_id);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [isEditMode, initialData, open, salesOrders, customers]);

  // Handle SO selection
  const handleSOChange = (event, newValue) => {
    setSelectedSO(newValue);
    if (newValue) {
      // Set shipping address from the sales order
      const shippingAddr = newValue.shipping_address;
      
      // Check if address is valid
      if (shippingAddr && isValidAddress(shippingAddr)) {
        setShippingAddress(shippingAddr);
      } else {
        setShippingAddress(null);
      }
      
      // Find customer from the customers list
      const customer = customers.find(c => c._id === newValue.customer_id);
      if (customer) {
        setSelectedCustomer(customer);
      } else {
        setSelectedCustomer(null);
      }
      
      setFormData(prev => ({
        ...prev,
        so_id: newValue._id,
        so_number: newValue.so_number,
        customer_id: newValue.customer_id,
        shipping_address_id: (shippingAddr && isValidAddress(shippingAddr)) ? JSON.stringify(shippingAddr) : '',
        items: (newValue.items || []).map(item => ({
          so_item_id: item._id,
          part_no: item.part_no,
          part_name: item.part_name,
          scheduled_qty: '',
          available_fg_qty: '',
          remarks: ''
        }))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        so_id: '',
        so_number: '',
        customer_id: '',
        shipping_address_id: '',
        items: []
      }));
      setSelectedCustomer(null);
      setShippingAddress(null);
    }
    setFieldErrors({});
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: updatedItems }));
    setFieldErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    switch (step) {
      case 0: // Sales Order Info
        if (!formData.so_id && !isEditMode) {
          errors.so_id = 'Sales Order is required';
          errorMessages.push('Sales Order is required');
          isValid = false;
        }
        if (!formData.customer_id) {
          errors.customer_id = 'Customer is required';
          errorMessages.push('Customer is required');
          isValid = false;
        }
        // Check if shipping address has actual data
        if (!formData.shipping_address_id) {
          errors.shipping_address_id = 'Shipping address is required';
          errorMessages.push('Shipping address is required');
          isValid = false;
        } else {
          try {
            const address = JSON.parse(formData.shipping_address_id);
            if (!isValidAddress(address)) {
              errors.shipping_address_id = 'Valid shipping address is required. Please update the sales order first.';
              errorMessages.push('Valid shipping address is required. Please update the sales order first.');
              isValid = false;
            }
          } catch (e) {
            errors.shipping_address_id = 'Invalid shipping address';
            errorMessages.push('Invalid shipping address');
            isValid = false;
          }
        }
        break;
      
      case 1: // Schedule Details
        if (!formData.dispatch_date) {
          errors.dispatch_date = 'Dispatch date is required';
          errorMessages.push('Dispatch date is required');
          isValid = false;
        }
        if (!formData.transporter_preference) {
          errors.transporter_preference = 'Transporter preference is required';
          errorMessages.push('Transporter preference is required');
          isValid = false;
        }
        if (!formData.vehicle_type) {
          errors.vehicle_type = 'Vehicle type is required';
          errorMessages.push('Vehicle type is required');
          isValid = false;
        }
        break;
      
      case 2: // Items Details
        for (let i = 0; i < formData.items.length; i++) {
          if (!formData.items[i].scheduled_qty) {
            errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Scheduled quantity is required`;
            errorMessages.push(`Item ${i + 1}: Scheduled quantity is required`);
            isValid = false;
          }
          if (formData.items[i].scheduled_qty && Number(formData.items[i].scheduled_qty) <= 0) {
            errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Quantity must be greater than 0`;
            errorMessages.push(`Item ${i + 1}: Quantity must be greater than 0`);
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

    if (!formData.so_id && !isEditMode) {
      errors.so_id = 'Sales Order is required';
      errorMessages.push('Sales Order is required');
      isValid = false;
    }
    if (!formData.customer_id) {
      errors.customer_id = 'Customer is required';
      errorMessages.push('Customer is required');
      isValid = false;
    }
    if (!formData.shipping_address_id) {
      errors.shipping_address_id = 'Shipping address is required';
      errorMessages.push('Shipping address is required');
      isValid = false;
    } else {
      try {
        const address = JSON.parse(formData.shipping_address_id);
        if (!isValidAddress(address)) {
          errors.shipping_address_id = 'Valid shipping address is required';
          errorMessages.push('Valid shipping address is required');
          isValid = false;
        }
      } catch (e) {
        errors.shipping_address_id = 'Invalid shipping address';
        errorMessages.push('Invalid shipping address');
        isValid = false;
      }
    }
    if (!formData.dispatch_date) {
      errors.dispatch_date = 'Dispatch date is required';
      errorMessages.push('Dispatch date is required');
      isValid = false;
    }
    if (!formData.transporter_preference) {
      errors.transporter_preference = 'Transporter preference is required';
      errorMessages.push('Transporter preference is required');
      isValid = false;
    }
    if (!formData.vehicle_type) {
      errors.vehicle_type = 'Vehicle type is required';
      errorMessages.push('Vehicle type is required');
      isValid = false;
    }
    
    for (let i = 0; i < formData.items.length; i++) {
      if (!formData.items[i].scheduled_qty) {
        errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Scheduled quantity is required`;
        errorMessages.push(`Item ${i + 1}: Scheduled quantity is required`);
        isValid = false;
      }
      if (formData.items[i].scheduled_qty && Number(formData.items[i].scheduled_qty) <= 0) {
        errors[`item_${i}_scheduled_qty`] = `Item ${i + 1}: Quantity must be greater than 0`;
        errorMessages.push(`Item ${i + 1}: Quantity must be greater than 0`);
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
        dispatch_date: formData.dispatch_date,
        so_id: formData.so_id,
        so_number: formData.so_number,
        customer_id: formData.customer_id,
        shipping_address_id: formData.shipping_address_id,
        items: formData.items.map(item => ({
          so_item_id: item.so_item_id,
          part_no: item.part_no,
          part_name: item.part_name,
          scheduled_qty: Number(item.scheduled_qty),
          available_fg_qty: item.available_fg_qty ? Number(item.available_fg_qty) : 0,
          remarks: item.remarks || ''
        })),
        transporter_preference: formData.transporter_preference,
        vehicle_type: formData.vehicle_type,
        special_instructions: formData.special_instructions || ''
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/api/delivery-schedules/${initialData._id}`, requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/delivery-schedules`, requestData, {
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
        showError(response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} delivery schedule`);
      }
    } catch (err) {
      console.error('Error saving delivery schedule:', err);
      showError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} delivery schedule. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedSO(null);
    setSelectedCustomer(null);
    setShippingAddress(null);
    setFormData({
      so_id: '',
      so_number: '',
      customer_id: '',
      shipping_address_id: '',
      dispatch_date: '',
      transporter_preference: '',
      vehicle_type: '',
      special_instructions: '',
      items: []
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get customer name helper
  const getCustomerName = (so) => {
    if (!so) return '';
    const customer = customers.find(c => c._id === so.customer_id);
    return customer?.customer_name || 'Unknown Customer';
  };

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Sales Order & Customer Information
              </Typography>
              
              <Grid container spacing={1.5}>
                {!isEditMode && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Select Sales Order <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={salesOrders}
                        getOptionLabel={(option) => {
                          const customerName = getCustomerName(option);
                          return `${option.so_number} - ${customerName}`;
                        }}
                        loading={loadingSO}
                        value={selectedSO}
                        onChange={handleSOChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Search and select sales order"
                            error={!!fieldErrors.so_id}
                            helperText={fieldErrors.so_id}
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
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loadingSO && <CircularProgress size={16} />}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                )}

                {isEditMode && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                        Sales Order Number
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.so_number}
                        InputProps={{ readOnly: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.75rem',
                            bgcolor: '#F5F5F5'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={selectedCustomer ? selectedCustomer.customer_name : (selectedSO ? getCustomerName(selectedSO) : '')}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          bgcolor: '#F5F5F5'
                        }
                      }}
                    />
                    {fieldErrors.customer_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.customer_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Shipping Address <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    {shippingAddress && isValidAddress(shippingAddress) ? (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          border: fieldErrors.shipping_address_id ? '1px solid #EF4444' : `1px solid ${COLORS.border}`,
                          bgcolor: COLORS.background.light
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.5 }}>
                          {shippingAddress.line1 && <span>{shippingAddress.line1}<br /></span>}
                          {shippingAddress.line2 && <span>{shippingAddress.line2}<br /></span>}
                          {shippingAddress.city && shippingAddress.district && 
                            <span>{shippingAddress.city}, {shippingAddress.district}<br /></span>
                          }
                          {shippingAddress.city && !shippingAddress.district && 
                            <span>{shippingAddress.city}<br /></span>
                          }
                          {shippingAddress.state && shippingAddress.pincode && 
                            <span>{shippingAddress.state} - {shippingAddress.pincode}<br /></span>
                          }
                          {shippingAddress.country && <span>{shippingAddress.country}</span>}
                        </Typography>
                      </Paper>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          border: fieldErrors.shipping_address_id ? '1px solid #EF4444' : `1px solid ${COLORS.border}`,
                          bgcolor: COLORS.background.light
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: '#EF4444' }}>
                          {selectedSO ? (
                            '⚠️ No valid shipping address found for this sales order. Please update the sales order with shipping address first.'
                          ) : (
                            'Please select a sales order to view shipping address'
                          )}
                        </Typography>
                      </Paper>
                    )}
                    {fieldErrors.shipping_address_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.shipping_address_id}
                      </Typography>
                    )}
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
                <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Dispatch Date <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="dispatch_date"
                      value={formData.dispatch_date}
                      onChange={handleChange}
                      error={!!fieldErrors.dispatch_date}
                      helperText={fieldErrors.dispatch_date}
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

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Transporter Preference <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={TRANSPORTER_OPTIONS}
                      freeSolo
                      value={formData.transporter_preference}
                      onInputChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, transporter_preference: newValue || '' }));
                        setFieldErrors(prev => ({ ...prev, transporter_preference: '' }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select or enter transporter name"
                          error={!!fieldErrors.transporter_preference}
                          helperText={fieldErrors.transporter_preference}
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

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Vehicle Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.vehicle_type}>
                      <Select
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        name="vehicle_type"
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 },
                          '&.Mui-error': { borderColor: '#EF4444' }
                        }}
                      >
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                          Select vehicle type
                        </MenuItem>
                        {VEHICLE_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.vehicle_type && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.vehicle_type}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Special Instructions
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      name="special_instructions"
                      value={formData.special_instructions}
                      onChange={handleChange}
                      placeholder="e.g., Handle with care, Fragile items, etc."
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

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Items to Schedule <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {formData.items.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  Please select a Sales Order to load items
                </Alert>
              ) : (
                formData.items.map((item, index) => (
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      Item {index + 1}: {item.part_no} - {item.part_name}
                    </Typography>
                    
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Scheduled Qty <span style={{ color: '#EF4444' }}>*</span>
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            size="small"
                            value={item.scheduled_qty}
                            onChange={(e) => handleItemChange(index, 'scheduled_qty', e.target.value)}
                            placeholder="0"
                            error={!!fieldErrors[`item_${index}_scheduled_qty`]}
                            helperText={fieldErrors[`item_${index}_scheduled_qty`]}
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
                            Available FG Qty
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            size="small"
                            value={item.available_fg_qty}
                            onChange={(e) => handleItemChange(index, 'available_fg_qty', e.target.value)}
                            placeholder="0"
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
                      
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Remarks
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.remarks}
                            onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                            placeholder="Any remarks..."
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
                ))
              )}
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
          {isEditMode ? 'Edit Delivery Schedule' : 'Create Delivery Schedule'}
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
              disabled={loading || (!isEditMode && !selectedSO)}
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
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Schedule' : 'Create Schedule')}
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

export default AddDeliverySchedule;