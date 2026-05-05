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
//   Autocomplete
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   AssignmentReturn as ReturnIcon,
//   Delete as DeleteIcon,
//   Business as BusinessIcon,
//   Description as DescriptionIcon
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
// const RETURN_TYPES = ['Rejected at Delivery', 'Return After Delivery', 'Partial Return'];
// const RETURN_REASONS = ['Quality Rejection', 'Wrong Part', 'Short Quantity', 'Damage in Transit', 'Over Delivery', 'Customer Order Change', 'Other'];
// const CONDITIONS = ['Good', 'Damaged', 'Defective'];

// const steps = ['Return Information', 'Return Items', 'Review & Submit'];

// const AddCustomerReturn = ({ open, onClose, onSuccess }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
  
//   // Data fetching states
//   const [deliveryChallans, setDeliveryChallans] = useState([]);
//   const [loadingDCs, setLoadingDCs] = useState(false);
//   const [selectedDC, setSelectedDC] = useState(null);
//   const [returnItems, setReturnItems] = useState([]);

//   // Form data
//   const [formData, setFormData] = useState({
//     return_type: 'Return After Delivery',
//     original_dc_id: '',
//     return_reason: '',
//     rejection_details: ''
//   });

//   // Fetch delivery challans with status 'Delivered'
//   const fetchDeliveryChallans = useCallback(async () => {
//     try {
//       setLoadingDCs(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/delivery-challans?limit=100`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         // Filter only those with status 'Delivered'
//         const deliveredDCs = response.data.data.filter(dc => dc.status === 'Delivered');
//         setDeliveryChallans(deliveredDCs);
//       }
//     } catch (err) {
//       console.error('Error fetching delivery challans:', err);
//       setError('Failed to load delivery challans');
//     } finally {
//       setLoadingDCs(false);
//     }
//   }, []);

//   // Fetch data when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchDeliveryChallans();
//       resetForm();
//     }
//   }, [open, fetchDeliveryChallans]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setError('');
//   };

//   const handleDCChange = (event, value) => {
//     setSelectedDC(value);
//     setFormData(prev => ({
//       ...prev,
//       original_dc_id: value?._id || ''
//     }));
//     setReturnItems([]);
//     setFieldErrors(prev => ({ ...prev, original_dc_id: '' }));
//     setError('');
//   };

//   const handleAddItem = () => {
//     if (!selectedDC) {
//       setError('Please select a delivery challan first');
//       return;
//     }

//     const newItem = {
//       id: Date.now(),
//       so_item_id: '',
//       part_no: '',
//       part_name: '',
//       return_qty: '',
//       unit_price: '',
//       max_qty: 0,
//       condition: 'Defective'
//     };
//     setReturnItems([...returnItems, newItem]);
//   };

//   const handleItemChange = (itemId, field, value) => {
//     const updatedItems = returnItems.map(item => {
//       if (item.id === itemId) {
//         const updatedItem = { ...item, [field]: value };
        
//         // If part_no is selected, update so_item_id, part_name, unit_price, and max_qty
//         if (field === 'part_no' && value && selectedDC) {
//           const selectedPart = selectedDC.items.find(item => item.part_no === value);
//           if (selectedPart) {
//             updatedItem.so_item_id = selectedPart.so_item_id;
//             updatedItem.part_name = selectedPart.part_name;
//             updatedItem.unit_price = selectedPart.unit_price;
//             updatedItem.max_qty = selectedPart.dispatch_qty;
//           }
//         }
        
//         return updatedItem;
//       }
//       return item;
//     });
    
//     setReturnItems(updatedItems);
//     setFieldErrors(prev => ({ ...prev, [`items_${itemId}_${field}`]: '' }));
//     setError('');
//   };

//   const handleRemoveItem = (itemId) => {
//     const updatedItems = returnItems.filter(item => item.id !== itemId);
//     setReturnItems(updatedItems);
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Return Information
//         if (!formData.original_dc_id) {
//           errors.original_dc_id = 'Please select a delivery challan';
//           isValid = false;
//         }
//         if (!formData.return_reason) {
//           errors.return_reason = 'Return reason is required';
//           isValid = false;
//         }
//         break;
      
//       case 1: // Return Items
//         if (returnItems.length === 0) {
//           errors.items = 'Please add at least one return item';
//           isValid = false;
//         }
        
//         returnItems.forEach((item) => {
//           if (!item.part_no) {
//             errors[`items_${item.id}_part_no`] = 'Please select a part';
//             isValid = false;
//           }
//           if (!item.return_qty || item.return_qty <= 0) {
//             errors[`items_${item.id}_return_qty`] = 'Please enter valid return quantity';
//             isValid = false;
//           }
//           if (item.return_qty > item.max_qty) {
//             errors[`items_${item.id}_return_qty`] = `Cannot exceed ${item.max_qty}`;
//             isValid = false;
//           }
//         });
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

//     if (!formData.original_dc_id) {
//       errors.original_dc_id = 'Please select a delivery challan';
//       isValid = false;
//     }
//     if (!formData.return_reason) {
//       errors.return_reason = 'Return reason is required';
//       isValid = false;
//     }
//     if (returnItems.length === 0) {
//       errors.items = 'Please add at least one return item';
//       isValid = false;
//     }

//     returnItems.forEach((item) => {
//       if (!item.part_no) {
//         errors[`items_${item.id}_part_no`] = 'Please select a part';
//         isValid = false;
//       }
//       if (!item.return_qty || item.return_qty <= 0) {
//         errors[`items_${item.id}_return_qty`] = 'Please enter valid return quantity';
//         isValid = false;
//       }
//       if (item.return_qty > item.max_qty) {
//         errors[`items_${item.id}_return_qty`] = `Cannot exceed ${item.max_qty}`;
//         isValid = false;
//       }
//     });

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

//   const calculateTotalValue = () => {
//     return returnItems.reduce((total, item) => {
//       return total + (item.return_qty * item.unit_price);
//     }, 0);
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
      
//       const payload = {
//         return_type: formData.return_type,
//         original_dc_id: formData.original_dc_id,
//         return_reason: formData.return_reason,
//         rejection_details: formData.rejection_details,
//         items: returnItems.map(item => ({
//           so_item_id: item.so_item_id,
//           part_no: item.part_no,
//           return_qty: parseFloat(item.return_qty),
//           unit_price: parseFloat(item.unit_price),
//           condition: item.condition
//         }))
//       };
      
//       const response = await axios.post(`${BASE_URL}/api/customer-returns`, payload, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onSuccess();
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to create customer return');
//       }
//     } catch (err) {
//       console.error('Error creating customer return:', err);
//       setError(err.response?.data?.message || 'Failed to create customer return. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setFormData({
//       return_type: 'Return After Delivery',
//       original_dc_id: '',
//       return_reason: '',
//       rejection_details: ''
//     });
//     setReturnItems([]);
//     setSelectedDC(null);
//     setFieldErrors({});
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const availableParts = selectedDC?.items.map(item => item.part_no) || [];

//   // Render Step Content
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <ReturnIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Return Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Return Type <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small">
//                       <Select
//                         name="return_type"
//                         value={formData.return_type}
//                         onChange={handleChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         {RETURN_TYPES.map(type => (
//                           <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Original Delivery Challan <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       options={deliveryChallans}
//                       getOptionLabel={(option) => `${option.dc_number} - ${option.customer_name}`}
//                       loading={loadingDCs}
//                       onChange={handleDCChange}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           placeholder="Select delivery challan"
//                           error={!!fieldErrors.original_dc_id}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '& input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                             }
//                           }}
//                         />
//                       )}
//                     />
//                     {fieldErrors.original_dc_id && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.original_dc_id}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Return Reason <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.return_reason}>
//                       <Select
//                         name="return_reason"
//                         value={formData.return_reason}
//                         onChange={handleChange}
//                         displayEmpty
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5 }
//                         }}
//                       >
//                         <MenuItem value="" disabled>Select reason</MenuItem>
//                         {RETURN_REASONS.map(reason => (
//                           <MenuItem key={reason} value={reason} sx={{ fontSize: '0.75rem' }}>{reason}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {fieldErrors.return_reason && (
//                       <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                         {fieldErrors.return_reason}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       Rejection Details
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="rejection_details"
//                       multiline
//                       rows={2}
//                       value={formData.rejection_details}
//                       onChange={handleChange}
//                       placeholder="Provide detailed reason for return..."
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

//             {selectedDC && (
//               <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                   Selected Delivery Challan Details
//                 </Typography>
//                 <Grid container spacing={1}>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>DC Number</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {selectedDC.dc_number}
//                     </Typography>
//                   </Grid>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Customer</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {selectedDC.customer_name}
//                     </Typography>
//                   </Grid>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>DC Date</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {new Date(selectedDC.dc_date).toLocaleDateString('en-IN')}
//                     </Typography>
//                   </Grid>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Total Items</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {selectedDC.items?.length || 0}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             )}
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
//                 <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
//                   <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                   Return Items <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 {selectedDC && (
//                   <Button
//                     size="small"
//                     startIcon={<AddIcon sx={{ fontSize: '0.8rem' }} />}
//                     onClick={handleAddItem}
//                     sx={{
//                       textTransform: 'none',
//                       fontSize: '0.7rem',
//                       color: COLORS.primary,
//                       minWidth: 'auto',
//                       height: 28,
//                       '&:hover': { bgcolor: `${COLORS.primary}10` }
//                     }}
//                   >
//                     Add Item
//                   </Button>
//                 )}
//               </Stack>

//               {!selectedDC ? (
//                 <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//                   Please select a delivery challan first to add return items
//                 </Alert>
//               ) : returnItems.length === 0 ? (
//                 <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//                   Click "Add Item" to add products being returned
//                 </Alert>
//               ) : (
//                 <>
//                   <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
//                           <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Part No</TableCell>
//                           <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Part Name</TableCell>
//                           <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Return Qty</TableCell>
//                           <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Unit Price</TableCell>
//                           <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Condition</TableCell>
//                           <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1, width: 40 }}>Action</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {returnItems.map((item) => (
//                           <TableRow key={item.id} hover>
//                             <TableCell sx={{ py: 1 }}>
//                               <FormControl fullWidth size="small" error={!!fieldErrors[`items_${item.id}_part_no`]}>
//                                 <Select
//                                   value={item.part_no}
//                                   onChange={(e) => handleItemChange(item.id, 'part_no', e.target.value)}
//                                   displayEmpty
//                                   sx={{
//                                     borderRadius: 1.5,
//                                     fontSize: '0.7rem',
//                                     '& .MuiSelect-select': { py: 0.75, px: 1 }
//                                   }}
//                                 >
//                                   <MenuItem value="" disabled>Select</MenuItem>
//                                   {availableParts.map(part => (
//                                     <MenuItem key={part} value={part} sx={{ fontSize: '0.7rem' }}>{part}</MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </TableCell>
//                             <TableCell sx={{ py: 1 }}>
//                               <Typography sx={{ fontSize: '0.7rem' }}>
//                                 {item.part_name}
//                               </Typography>
//                             </TableCell>
//                             <TableCell sx={{ py: 1 }}>
//                               <TextField
//                                 fullWidth
//                                 type="number"
//                                 size="small"
//                                 value={item.return_qty}
//                                 onChange={(e) => handleItemChange(item.id, 'return_qty', e.target.value)}
//                                 error={!!fieldErrors[`items_${item.id}_return_qty`]}
//                                 placeholder={`Max: ${item.max_qty}`}
//                                 sx={{
//                                   '& .MuiOutlinedInput-root': {
//                                     borderRadius: 1.5,
//                                     fontSize: '0.7rem',
//                                     '& input': { py: 0.75, px: 1, fontSize: '0.7rem', width: 80 }
//                                   }
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell sx={{ py: 1 }}>
//                               <Typography sx={{ fontSize: '0.7rem' }}>
//                                 ₹{item.unit_price?.toLocaleString() || 0}
//                               </Typography>
//                             </TableCell>
//                             <TableCell sx={{ py: 1 }}>
//                               <FormControl fullWidth size="small">
//                                 <Select
//                                   value={item.condition}
//                                   onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)}
//                                   sx={{
//                                     borderRadius: 1.5,
//                                     fontSize: '0.7rem',
//                                     '& .MuiSelect-select': { py: 0.75, px: 1 }
//                                   }}
//                                 >
//                                   {CONDITIONS.map(condition => (
//                                     <MenuItem key={condition} value={condition} sx={{ fontSize: '0.7rem' }}>{condition}</MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </TableCell>
//                             <TableCell sx={{ py: 1 }}>
//                               <IconButton
//                                 size="small"
//                                 onClick={() => handleRemoveItem(item.id)}
//                                 sx={{ color: '#EF4444', p: 0.5 }}
//                               >
//                                 <DeleteIcon fontSize="small" />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   {fieldErrors.items && (
//                     <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
//                       {fieldErrors.items}
//                     </Typography>
//                   )}
//                 </>
//               )}
//             </Paper>

//             {returnItems.length > 0 && (
//               <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//                 <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                   Summary
//                 </Typography>
//                 <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
//                   Total Return Value: ₹{calculateTotalValue().toLocaleString()}
//                 </Typography>
//                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                   Total Items: {returnItems.length} | Total Quantity: {returnItems.reduce((sum, item) => sum + (parseFloat(item.return_qty) || 0), 0)} units
//                 </Typography>
//               </Paper>
//             )}
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
//                 <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
//                 Review & Submit
//               </Typography>

//               {/* Return Details */}
//               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                 Return Details
//               </Typography>
//               <Grid container spacing={1.5} sx={{ mb: 2 }}>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Return Type</Typography>
//                   <Chip label={formData.return_type} size="small" sx={{ fontSize: '0.65rem', mt: 0.5, height: 22 }} />
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Return Reason</Typography>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mt: 0.5 }}>
//                     {formData.return_reason || '-'}
//                   </Typography>
//                 </Grid>
//                 {formData.rejection_details && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Rejection Details</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
//                       {formData.rejection_details}
//                     </Typography>
//                   </Grid>
//                 )}
//               </Grid>

//               <Divider sx={{ my: 1.5 }} />

//               {/* Delivery Challan Details */}
//               {selectedDC && (
//                 <>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                     Original Delivery Challan
//                   </Typography>
//                   <Grid container spacing={1.5} sx={{ mb: 2 }}>
//                     <Grid size={{ xs: 6 }}>
//                       <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>DC Number</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{selectedDC.dc_number}</Typography>
//                     </Grid>
//                     <Grid size={{ xs: 6 }}>
//                       <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Customer</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{selectedDC.customer_name}</Typography>
//                     </Grid>
//                   </Grid>

//                   <Divider sx={{ my: 1.5 }} />
//                 </>
//               )}

//               {/* Return Items Summary */}
//               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                 Return Items
//               </Typography>
//               <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden', mb: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
//                       <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Part No</TableCell>
//                       <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Return Qty</TableCell>
//                       <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Unit Price</TableCell>
//                       <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Total</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {returnItems.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell sx={{ fontSize: '0.7rem', py: 0.75 }}>{item.part_no}</TableCell>
//                         <TableCell sx={{ fontSize: '0.7rem', py: 0.75 }}>{item.return_qty}</TableCell>
//                         <TableCell sx={{ fontSize: '0.7rem', py: 0.75 }}>₹{item.unit_price?.toLocaleString()}</TableCell>
//                         <TableCell sx={{ fontSize: '0.7rem', py: 0.75, fontWeight: 500 }}>₹{(item.return_qty * item.unit_price).toLocaleString()}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center">
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                     Total Return Value
//                   </Typography>
//                   <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
//                     ₹{calculateTotalValue().toLocaleString()}
//                   </Typography>
//                 </Stack>
//               </Paper>
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
//           Create Customer Return
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
//               {loading ? 'Creating...' : 'Create Return'}
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

// export default AddCustomerReturn;



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
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  AssignmentReturn as ReturnIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
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
const RETURN_TYPES = ['Rejected at Delivery', 'Return After Delivery', 'Partial Return'];
const RETURN_REASONS = ['Quality Rejection', 'Wrong Part', 'Short Quantity', 'Damage in Transit', 'Over Delivery', 'Customer Order Change', 'Other'];
const CONDITIONS = ['Good', 'Damaged', 'Defective'];

const steps = ['Return Information', 'Return Items', 'Review & Submit'];

const AddCustomerReturn = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [loadingDCs, setLoadingDCs] = useState(false);
  const [selectedDC, setSelectedDC] = useState(null);
  const [returnItems, setReturnItems] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    return_type: 'Return After Delivery',
    original_dc_id: '',
    return_reason: '',
    rejection_details: ''
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Fetch delivery challans with status 'Delivered'
  const fetchDeliveryChallans = useCallback(async () => {
    try {
      setLoadingDCs(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/delivery-challans?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Filter only those with status 'Delivered' or 'Shipped'
        const deliveredDCs = response.data.data.filter(dc => 
          dc.status === 'Delivered' || dc.status === 'Shipped'
        );
        setDeliveryChallans(deliveredDCs);
      }
    } catch (err) {
      console.error('Error fetching delivery challans:', err);
      showError('Failed to load delivery challans');
    } finally {
      setLoadingDCs(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchDeliveryChallans();
      resetForm();
    }
  }, [open, fetchDeliveryChallans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDCChange = (event, value) => {
    setSelectedDC(value);
    setFormData(prev => ({
      ...prev,
      original_dc_id: value?._id || ''
    }));
    setReturnItems([]);
    setFieldErrors(prev => ({ ...prev, original_dc_id: '' }));
  };

  const handleAddItem = () => {
    if (!selectedDC) {
      showError('Please select a delivery challan first');
      return;
    }

    const newItem = {
      id: Date.now(),
      so_item_id: '',
      part_no: '',
      part_name: '',
      return_qty: '',
      unit_price: '',
      max_qty: 0,
      condition: 'Defective'
    };
    setReturnItems([...returnItems, newItem]);
  };

  const handleItemChange = (itemId, field, value) => {
    const updatedItems = returnItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // If part_no is selected, update so_item_id, part_name, unit_price, and max_qty
        if (field === 'part_no' && value && selectedDC) {
          const selectedPart = selectedDC.items.find(item => item.part_no === value);
          if (selectedPart) {
            updatedItem.so_item_id = selectedPart.so_item_id;
            updatedItem.part_name = selectedPart.part_name;
            updatedItem.unit_price = selectedPart.unit_price;
            updatedItem.max_qty = selectedPart.dispatch_qty;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setReturnItems(updatedItems);
    setFieldErrors(prev => ({ ...prev, [`items_${itemId}_${field}`]: '' }));
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = returnItems.filter(item => item.id !== itemId);
    setReturnItems(updatedItems);
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    switch (step) {
      case 0: // Return Information
        if (!formData.original_dc_id) {
          errors.original_dc_id = 'Please select a delivery challan';
          errorMessages.push('Please select a delivery challan');
          isValid = false;
        }
        if (!formData.return_reason) {
          errors.return_reason = 'Return reason is required';
          errorMessages.push('Return reason is required');
          isValid = false;
        }
        break;
      
      case 1: // Return Items
        if (returnItems.length === 0) {
          errors.items = 'Please add at least one return item';
          errorMessages.push('Please add at least one return item');
          isValid = false;
        }
        
        returnItems.forEach((item) => {
          if (!item.part_no) {
            errors[`items_${item.id}_part_no`] = 'Please select a part';
            errorMessages.push('Please select a part for all items');
            isValid = false;
          }
          if (!item.return_qty || item.return_qty <= 0) {
            errors[`items_${item.id}_return_qty`] = 'Please enter valid return quantity';
            errorMessages.push('Please enter valid return quantity for all items');
            isValid = false;
          }
          if (item.return_qty > item.max_qty) {
            errors[`items_${item.id}_return_qty`] = `Cannot exceed ${item.max_qty}`;
            errorMessages.push(`Return quantity cannot exceed dispatched quantity (${item.max_qty})`);
            isValid = false;
          }
        });
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

    if (!formData.original_dc_id) {
      errors.original_dc_id = 'Please select a delivery challan';
      errorMessages.push('Please select a delivery challan');
      isValid = false;
    }
    if (!formData.return_reason) {
      errors.return_reason = 'Return reason is required';
      errorMessages.push('Return reason is required');
      isValid = false;
    }
    if (returnItems.length === 0) {
      errors.items = 'Please add at least one return item';
      errorMessages.push('Please add at least one return item');
      isValid = false;
    }

    returnItems.forEach((item) => {
      if (!item.part_no) {
        errors[`items_${item.id}_part_no`] = 'Please select a part';
        errorMessages.push('Please select a part for all items');
        isValid = false;
      }
      if (!item.return_qty || item.return_qty <= 0) {
        errors[`items_${item.id}_return_qty`] = 'Please enter valid return quantity';
        errorMessages.push('Please enter valid return quantity for all items');
        isValid = false;
      }
      if (item.return_qty > item.max_qty) {
        errors[`items_${item.id}_return_qty`] = `Cannot exceed ${item.max_qty}`;
        errorMessages.push(`Return quantity cannot exceed dispatched quantity (${item.max_qty})`);
        isValid = false;
      }
    });

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

  const calculateTotalValue = () => {
    return returnItems.reduce((total, item) => {
      return total + ((item.return_qty || 0) * (item.unit_price || 0));
    }, 0);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        return_type: formData.return_type,
        original_dc_id: formData.original_dc_id,
        return_reason: formData.return_reason,
        rejection_details: formData.rejection_details,
        items: returnItems.map(item => ({
          so_item_id: item.so_item_id,
          part_no: item.part_no,
          return_qty: parseFloat(item.return_qty),
          unit_price: parseFloat(item.unit_price),
          condition: item.condition
        }))
      };
      
      const response = await axios.post(`${BASE_URL}/api/customer-returns`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onSuccess();
        resetForm();
        onClose();
      } else {
        showError(response.data.message || 'Failed to create customer return');
      }
    } catch (err) {
      console.error('Error creating customer return:', err);
      
      // Handle API validation errors
      let errorMessage = 'Failed to create customer return. Please try again.';
      
      if (err.response?.data?.error) {
        // Handle mongoose validation error message
        const errorMsg = err.response.data.error;
        if (errorMsg.includes('customer_id: Path `customer_id` is required')) {
          errorMessage = 'Unable to process return: Customer information is missing. Please ensure the delivery challan has valid customer data.';
        } else if (errorMsg.includes('so_id: Path `so_id` is required')) {
          errorMessage = 'Unable to process return: Sales order reference is missing. Please check the delivery challan.';
        } else {
          errorMessage = errorMsg;
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      return_type: 'Return After Delivery',
      original_dc_id: '',
      return_reason: '',
      rejection_details: ''
    });
    setReturnItems([]);
    setSelectedDC(null);
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const availableParts = selectedDC?.items.map(item => item.part_no) || [];

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ReturnIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Return Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Return Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="return_type"
                        value={formData.return_type}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {RETURN_TYPES.map(type => (
                          <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Original Delivery Challan <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={deliveryChallans}
                      getOptionLabel={(option) => `${option.dc_number} - ${option.customer_name}`}
                      loading={loadingDCs}
                      onChange={handleDCChange}
                      value={selectedDC}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select delivery challan"
                          error={!!fieldErrors.original_dc_id}
                          helperText={fieldErrors.original_dc_id}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&.Mui-error fieldset': { borderColor: '#EF4444' },
                              '& input': { py: 1, px: 1.5, fontSize: '0.75rem' }
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
                      Return Reason <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.return_reason}>
                      <Select
                        name="return_reason"
                        value={formData.return_reason}
                        onChange={handleChange}
                        displayEmpty
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 },
                          '&.Mui-error': { borderColor: '#EF4444' }
                        }}
                      >
                        <MenuItem value="" disabled>Select reason</MenuItem>
                        {RETURN_REASONS.map(reason => (
                          <MenuItem key={reason} value={reason} sx={{ fontSize: '0.75rem' }}>{reason}</MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.return_reason && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                          {fieldErrors.return_reason}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Rejection Details
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rejection_details"
                      multiline
                      rows={2}
                      value={formData.rejection_details}
                      onChange={handleChange}
                      placeholder="Provide detailed reason for return..."
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

            {selectedDC && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Selected Delivery Challan Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>DC Number</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedDC.dc_number}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Customer</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedDC.customer_name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>DC Date</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {new Date(selectedDC.dc_date).toLocaleDateString('en-IN')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Total Items</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedDC.items?.length || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                  <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Return Items <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                {selectedDC && (
                  <Button
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: '0.8rem' }} />}
                    onClick={handleAddItem}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.7rem',
                      color: COLORS.primary,
                      minWidth: 'auto',
                      height: 28,
                      '&:hover': { bgcolor: `${COLORS.primary}10` }
                    }}
                  >
                    Add Item
                  </Button>
                )}
              </Stack>

              {!selectedDC ? (
                <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  Please select a delivery challan first to add return items
                </Alert>
              ) : returnItems.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  Click "Add Item" to add products being returned
                </Alert>
              ) : (
                <>
                  <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.primary }}>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Part Name</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Return Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Unit Price</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1 }}>Condition</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 1, width: 40 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {returnItems.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell sx={{ py: 1 }}>
                              <FormControl fullWidth size="small" error={!!fieldErrors[`items_${item.id}_part_no`]}>
                                <Select
                                  value={item.part_no}
                                  onChange={(e) => handleItemChange(item.id, 'part_no', e.target.value)}
                                  displayEmpty
                                  sx={{
                                    borderRadius: 1.5,
                                    fontSize: '0.7rem',
                                    '& .MuiSelect-select': { py: 0.75, px: 1 },
                                    '&.Mui-error': { borderColor: '#EF4444' }
                                  }}
                                >
                                  <MenuItem value="" disabled>Select</MenuItem>
                                  {availableParts.map(part => (
                                    <MenuItem key={part} value={part} sx={{ fontSize: '0.7rem' }}>{part}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography sx={{ fontSize: '0.7rem' }}>
                                {item.part_name}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <TextField
                                fullWidth
                                type="number"
                                size="small"
                                value={item.return_qty}
                                onChange={(e) => handleItemChange(item.id, 'return_qty', e.target.value)}
                                error={!!fieldErrors[`items_${item.id}_return_qty`]}
                                helperText={fieldErrors[`items_${item.id}_return_qty`]}
                                placeholder={`Max: ${item.max_qty}`}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    fontSize: '0.7rem',
                                    '&.Mui-error fieldset': { borderColor: '#EF4444' },
                                    '& input': { py: 0.75, px: 1, fontSize: '0.7rem', width: 80 }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography sx={{ fontSize: '0.7rem' }}>
                                ₹{item.unit_price?.toLocaleString() || 0}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={item.condition}
                                  onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)}
                                  sx={{
                                    borderRadius: 1.5,
                                    fontSize: '0.7rem',
                                    '& .MuiSelect-select': { py: 0.75, px: 1 }
                                  }}
                                >
                                  {CONDITIONS.map(condition => (
                                    <MenuItem key={condition} value={condition} sx={{ fontSize: '0.7rem' }}>{condition}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(item.id)}
                                sx={{ color: '#EF4444', p: 0.5 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {fieldErrors.items && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.items}
                    </Typography>
                  )}
                </>
              )}
            </Paper>

            {returnItems.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  Summary
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                  Total Return Value: ₹{calculateTotalValue().toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  Total Items: {returnItems.length} | Total Quantity: {returnItems.reduce((sum, item) => sum + (parseFloat(item.return_qty) || 0), 0)} units
                </Typography>
              </Paper>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review & Submit
              </Typography>

              {/* Return Details */}
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                Return Details
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Return Type</Typography>
                  <Chip label={formData.return_type} size="small" sx={{ fontSize: '0.65rem', mt: 0.5, height: 22 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Return Reason</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mt: 0.5 }}>
                    {formData.return_reason || '-'}
                  </Typography>
                </Grid>
                {formData.rejection_details && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Rejection Details</Typography>
                    <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                      {formData.rejection_details}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* Delivery Challan Details */}
              {selectedDC && (
                <>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Original Delivery Challan
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>DC Number</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{selectedDC.dc_number}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Customer</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{selectedDC.customer_name}</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 1.5 }} />
                </>
              )}

              {/* Return Items Summary */}
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                Return Items
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden', mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.primary }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Return Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Unit Price</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light, py: 0.75 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {returnItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.75 }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.75 }}>{item.return_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.75 }}>₹{item.unit_price?.toLocaleString()}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', py: 0.75, fontWeight: 500 }}>₹{((item.return_qty || 0) * (item.unit_price || 0)).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Total Return Value
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                    ₹{calculateTotalValue().toLocaleString()}
                  </Typography>
                </Stack>
              </Paper>
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
          Create Customer Return
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
              {loading ? 'Creating...' : 'Create Return'}
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

export default AddCustomerReturn;