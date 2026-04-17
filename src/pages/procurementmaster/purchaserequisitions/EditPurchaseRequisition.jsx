// // EditPurchaseRequisition.js
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
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
//   Select,
//   MenuItem,
//   Autocomplete,
//   InputAdornment,
//   Chip,
//   styled
// } from '@mui/material';
// import { 
//   Edit as EditIcon,
//   Close as CloseIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
//   background: { white: '#FFFFFF', light: '#F8FFFC', hover: '#F0FDF9' },
//   border: '#E3E8EF'
// };

// // Modern Stepper Connector
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const steps = ['Basic Information', 'Item Details'];

// const EditPurchaseRequisition = ({ open, onClose, pr, onUpdate }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [items, setItems] = useState([]);
//   const [loadingItems, setLoadingItems] = useState(false);
  
//   const [formData, setFormData] = useState({
//     pr_type: 'Material',
//     source: 'Manual',
//     mrp_run_id: '',
//     department: '',
//     required_date: '',
//     item: {
//       item_id: '',
//       required_qty: '',
//       estimated_price: '',
//       remarks: ''
//     }
//   });

//   const [fieldErrors, setFieldErrors] = useState({});

//   const prTypes = [
//     { value: 'Material', label: 'Material' },
//     { value: 'Service', label: 'Service' },
//     { value: 'Capital', label: 'Capital' },
//     { value: 'Subcontract', label: 'Subcontract' }
//   ];

//   const sources = [
//     { value: 'MRP Auto', label: 'MRP Auto' },
//     { value: 'Manual', label: 'Manual' },
//     { value: 'Reorder Alert', label: 'Reorder Alert' },
//     { value: 'Indent', label: 'Indent' }
//   ];

//   const departments = [
//     { value: 'Production', label: 'Production' },
//     { value: 'Quality', label: 'Quality' },
//     { value: 'Maintenance', label: 'Maintenance' },
//     { value: 'Admin', label: 'Admin' },
//     { value: 'Store', label: 'Store' },
//     { value: 'Sales', label: 'Sales' }
//   ];

//   useEffect(() => {
//     if (open && pr) {
//       fetchItems();
//       loadPRData();
//     }
//   }, [open, pr]);

//   const fetchItems = async () => {
//     try {
//       setLoadingItems(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setItems(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching items:', err);
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   const loadPRData = () => {
//     if (!pr) return;

//     // Get the first item from items array
//     const firstItem = pr.items?.[0] || {};
    
//     // Format the required date from the item (it's stored in the item, not at root level)
//     let formattedRequiredDate = '';
//     if (firstItem.required_date) {
//       formattedRequiredDate = new Date(firstItem.required_date).toISOString().split('T')[0];
//     }

//     setFormData({
//       pr_type: pr.pr_type || 'Material',
//       source: pr.source || 'Manual',
//       mrp_run_id: pr.mrp_run_id || '',
//       department: pr.department || '',
//       required_date: formattedRequiredDate, // This now comes from the item
//       item: {
//         item_id: firstItem.item_id || '',
//         required_qty: firstItem.required_qty || '',
//         estimated_price: firstItem.estimated_price || '',
//         remarks: firstItem.remarks || ''
//       }
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleItemChange = (field, value) => {
//     setFieldErrors(prev => ({ ...prev, [field]: '' }));
//     setFormData(prev => ({
//       ...prev,
//       item: { ...prev.item, [field]: value }
//     }));
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Basic Information
//         if (!formData.pr_type) {
//           errors.pr_type = 'PR type is required';
//           isValid = false;
//         }
//         if (!formData.source) {
//           errors.source = 'Source is required';
//           isValid = false;
//         }
//         if (!formData.department) {
//           errors.department = 'Department is required';
//           isValid = false;
//         }
//         if (!formData.required_date) {
//           errors.required_date = 'Required date is required';
//           isValid = false;
//         }
//         break;
//       case 1: // Item Details
//         if (!formData.item.item_id) {
//           errors.item_id = 'Item is required';
//           isValid = false;
//         }
//         if (!formData.item.required_qty) {
//           errors.required_qty = 'Quantity is required';
//           isValid = false;
//         } else if (formData.item.required_qty <= 0) {
//           errors.required_qty = 'Quantity must be greater than 0';
//           isValid = false;
//         }
//         if (!formData.item.estimated_price) {
//           errors.estimated_price = 'Estimated price is required';
//           isValid = false;
//         } else if (formData.item.estimated_price <= 0) {
//           errors.estimated_price = 'Price must be greater than 0';
//           isValid = false;
//         }
//         break;
//       default:
//         break;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fill all required fields');
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
//     if (!formData.item.item_id || !formData.item.required_qty || !formData.item.estimated_price) {
//       setError('Please fill all item details');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
      
//       const submissionData = {
//         pr_type: formData.pr_type,
//         source: formData.source,
//         mrp_run_id: formData.mrp_run_id || null,
//         department: formData.department,
//         items: [{
//           item_id: formData.item.item_id,
//           required_qty: parseFloat(formData.item.required_qty),
//           estimated_price: parseFloat(formData.item.estimated_price),
//           required_date: formData.required_date, // Include required_date in the item
//           remarks: formData.item.remarks
//         }],
//         updated_by: user._id
//       };

//       const response = await axios.put(`${BASE_URL}/api/purchase-requisitions/${pr._id}`, submissionData, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update purchase requisition');
//       }
//     } catch (err) {
//       console.error('Error updating PR:', err);
//       setError(err.response?.data?.message || 'Failed to update purchase requisition');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       pr_type: 'Material',
//       source: 'Manual',
//       mrp_run_id: '',
//       department: '',
//       required_date: '',
//       item: {
//         item_id: '',
//         required_qty: '',
//         estimated_price: '',
//         remarks: ''
//       }
//     });
//     setFieldErrors({});
//     setError('');
//     setActiveStep(0);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const selectedItem = items.find(i => i._id === formData.item.item_id);
//   const totalValue = selectedItem && formData.item.required_qty && formData.item.estimated_price 
//     ? parseFloat(formData.item.required_qty) * parseFloat(formData.item.estimated_price) 
//     : 0;
//   const today = new Date().toISOString().split('T')[0];

//   if (!pr) return null;

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Basic Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       PR TYPE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.pr_type}>
//                       <Select
//                         name="pr_type"
//                         value={formData.pr_type}
//                         onChange={handleSelectChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {prTypes.map(type => <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>{type.label}</MenuItem>)}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       SOURCE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.source}>
//                       <Select
//                         name="source"
//                         value={formData.source}
//                         onChange={handleSelectChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {sources.map(src => <MenuItem key={src.value} value={src.value} sx={{ fontSize: '0.75rem' }}>{src.label}</MenuItem>)}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.department}>
//                       <Select
//                         name="department"
//                         value={formData.department}
//                         onChange={handleSelectChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {departments.map(dept => <MenuItem key={dept.value} value={dept.value} sx={{ fontSize: '0.75rem' }}>{dept.label}</MenuItem>)}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       REQUIRED DATE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField 
//                       fullWidth 
//                       size="small" 
//                       type="date" 
//                       name="required_date"
//                       value={formData.required_date} 
//                       onChange={handleChange}
//                       error={!!fieldErrors.required_date}
//                       helperText={fieldErrors.required_date}
//                       InputLabelProps={{ shrink: true }}
//                       inputProps={{ min: today }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                         '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       MRP RUN ID
//                     </Typography>
//                     <TextField 
//                       fullWidth 
//                       size="small" 
//                       name="mrp_run_id" 
//                       value={formData.mrp_run_id} 
//                       onChange={handleChange} 
//                       placeholder="e.g., MRP-20250315-001"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
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
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Item Details
//               </Typography>
              
//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       SELECT ITEM <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       options={items}
//                       loading={loadingItems}
//                       value={selectedItem || null}
//                       onChange={(e, val) => handleItemChange('item_id', val?._id || '')}
//                       getOptionLabel={(opt) => {
//                         const partNo = opt.part_no || opt.PartNo || '';
//                         const desc = opt.part_description || opt.Description || '';
//                         return `${partNo} - ${desc}`;
//                       }}
//                       renderInput={(params) => (
//                         <TextField 
//                           {...params} 
//                           size="small" 
//                           placeholder="Search and select an item..." 
//                           error={!!fieldErrors.item_id} 
//                           helperText={fieldErrors.item_id}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                             '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                           }}
//                         />
//                       )}
//                     />
//                   </Box>
//                 </Grid>

//                 {selectedItem && (
//                   <>
//                     <Grid size={{ xs: 12, md: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           PART NUMBER
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={selectedItem.part_no || selectedItem.PartNo || ''}
//                           disabled
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               backgroundColor: COLORS.background.light
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           DESCRIPTION
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={selectedItem.part_description || selectedItem.Description || ''}
//                           disabled
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               backgroundColor: COLORS.background.light
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           UNIT
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={selectedItem.unit || selectedItem.Unit || 'Nos'}
//                           disabled
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               backgroundColor: COLORS.background.light
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           QUANTITY <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <TextField 
//                           fullWidth 
//                           size="small" 
//                           type="number" 
//                           placeholder="Enter quantity" 
//                           value={formData.item.required_qty} 
//                           onChange={(e) => handleItemChange('required_qty', e.target.value)} 
//                           error={!!fieldErrors.required_qty} 
//                           helperText={fieldErrors.required_qty} 
//                           inputProps={{ step: 1, min: 1 }} 
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                             '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           ESTIMATED PRICE <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <TextField 
//                           fullWidth 
//                           size="small" 
//                           type="number" 
//                           placeholder="Enter price" 
//                           value={formData.item.estimated_price} 
//                           onChange={(e) => handleItemChange('estimated_price', e.target.value)} 
//                           error={!!fieldErrors.estimated_price} 
//                           helperText={fieldErrors.estimated_price} 
//                           InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                             '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           REMARKS
//                         </Typography>
//                         <TextField 
//                           fullWidth 
//                           size="small" 
//                           multiline
//                           rows={2}
//                           placeholder="Enter any remarks" 
//                           value={formData.item.remarks} 
//                           onChange={(e) => handleItemChange('remarks', e.target.value)} 
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     {formData.item.required_qty && formData.item.estimated_price && (
//                       <Grid size={{ xs: 12 }}>
//                         <Box sx={{ 
//                           p: 2, 
//                           bgcolor: COLORS.background.light, 
//                           borderRadius: 1.5,
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center'
//                         }}>
//                           <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                             Total Value:
//                           </Typography>
//                           <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
//                             ₹{totalValue.toLocaleString()}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     )}
//                   </>
//                 )}
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
//           overflow: 'hidden',
//           maxHeight: '95vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 1
//       }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Edit Purchase Requisition
//           </Typography>
//           <Chip 
//             label={`PR: ${pr.pr_number}`} 
//             size="small" 
//             sx={{ 
//               bgcolor: COLORS.primaryLight, 
//               color: COLORS.primary, 
//               fontSize: '0.7rem',
//               borderRadius: 1.5
//             }} 
//           />
//         </Box>

//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 0.5, mt: 0.5 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
//         {renderStepContent(activeStep)}

//         {error && (
//           <Alert 
//             severity="error" 
//             sx={{ 
//               mt: 2, 
//               borderRadius: 1.5,
//               '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
//               fontSize: '0.75rem',
//               py: 0.5
//             }}
//           >
//             {error}
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: 1
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
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || !formData.item.item_id || !formData.item.required_qty || !formData.item.estimated_price || !formData.required_date}
//               startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': { bgcolor: COLORS.primaryDark }
//               }}
//             >
//               {loading ? 'Updating...' : 'Update Requisition'}
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
//                 '&:hover': { bgcolor: COLORS.primaryDark }
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

// export default EditPurchaseRequisition;


// // EditPurchaseRequisition.js
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
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
//   Select,
//   MenuItem,
//   Autocomplete,
//   InputAdornment,
//   Chip,
//   styled
// } from '@mui/material';
// import { 
//   Edit as EditIcon,
//   Close as CloseIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
//   background: { white: '#FFFFFF', light: '#F8FFFC', hover: '#F0FDF9' },
//   border: '#E3E8EF'
// };

// // Modern Stepper Connector
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const steps = ['Basic Information', 'Item Details'];

// const EditPurchaseRequisition = ({ open, onClose, pr, onUpdate }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [items, setItems] = useState([]);
//   const [loadingItems, setLoadingItems] = useState(false);
  
//   const [formData, setFormData] = useState({
//     pr_type: 'Material',
//     source: 'Manual',
//     mrp_run_id: '',
//     department: '',
//     required_by: '', // Changed from required_date to required_by to match API
//     item: {
//       item_id: '',
//       required_qty: '',
//       estimated_price: '',
//       remarks: ''
//     }
//   });

//   const [fieldErrors, setFieldErrors] = useState({});

//   const prTypes = [
//     { value: 'Material', label: 'Material' },
//     { value: 'Service', label: 'Service' },
//     { value: 'Capital', label: 'Capital' },
//     { value: 'Subcontract', label: 'Subcontract' }
//   ];

//   const sources = [
//     { value: 'MRP Auto', label: 'MRP Auto' },
//     { value: 'Manual', label: 'Manual' },
//     { value: 'Reorder Alert', label: 'Reorder Alert' },
//     { value: 'Indent', label: 'Indent' }
//   ];

//   const departments = [
//     { value: 'Production', label: 'Production' },
//     { value: 'Quality', label: 'Quality' },
//     { value: 'Maintenance', label: 'Maintenance' },
//     { value: 'Admin', label: 'Admin' },
//     { value: 'Store', label: 'Store' },
//     { value: 'Sales', label: 'Sales' }
//   ];

//   useEffect(() => {
//     if (open && pr) {
//       fetchItems();
//       loadPRData();
//     }
//   }, [open, pr]);

//   const fetchItems = async () => {
//     try {
//       setLoadingItems(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setItems(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching items:', err);
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   const loadPRData = () => {
//     if (!pr) return;

//     // Get the first item from items array
//     const firstItem = pr.items?.[0] || {};
    
//     // Format the required_by date (changed from required_date to required_by)
//     let formattedRequiredBy = '';
//     if (firstItem.required_by) {
//       formattedRequiredBy = new Date(firstItem.required_by).toISOString().split('T')[0];
//     } else if (pr.required_by) {
//       // Fallback to PR level required_by if exists
//       formattedRequiredBy = new Date(pr.required_by).toISOString().split('T')[0];
//     }

//     setFormData({
//       pr_type: pr.pr_type || 'Material',
//       source: pr.source || 'Manual',
//       mrp_run_id: pr.mrp_run_id || '',
//       department: pr.department || '',
//       required_by: formattedRequiredBy, // Changed to required_by
//       item: {
//         item_id: firstItem.item_id || '',
//         required_qty: firstItem.required_qty || '',
//         estimated_price: firstItem.estimated_price || '',
//         remarks: firstItem.remarks || ''
//       }
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleItemChange = (field, value) => {
//     setFieldErrors(prev => ({ ...prev, [field]: '' }));
//     setFormData(prev => ({
//       ...prev,
//       item: { ...prev.item, [field]: value }
//     }));
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Basic Information
//         if (!formData.pr_type) {
//           errors.pr_type = 'PR type is required';
//           isValid = false;
//         }
//         if (!formData.source) {
//           errors.source = 'Source is required';
//           isValid = false;
//         }
//         if (!formData.department) {
//           errors.department = 'Department is required';
//           isValid = false;
//         }
//         if (!formData.required_by) {
//           errors.required_by = 'Required date is required';
//           isValid = false;
//         }
//         break;
//       case 1: // Item Details
//         if (!formData.item.item_id) {
//           errors.item_id = 'Item is required';
//           isValid = false;
//         }
//         if (!formData.item.required_qty) {
//           errors.required_qty = 'Quantity is required';
//           isValid = false;
//         } else if (formData.item.required_qty <= 0) {
//           errors.required_qty = 'Quantity must be greater than 0';
//           isValid = false;
//         }
//         if (!formData.item.estimated_price) {
//           errors.estimated_price = 'Estimated price is required';
//           isValid = false;
//         } else if (formData.item.estimated_price <= 0) {
//           errors.estimated_price = 'Price must be greater than 0';
//           isValid = false;
//         }
//         break;
//       default:
//         break;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fill all required fields');
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
//     if (!formData.item.item_id || !formData.item.required_qty || !formData.item.estimated_price) {
//       setError('Please fill all item details');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
      
//       // Updated submission data structure to match API requirements
//       const submissionData = {
//         pr_type: formData.pr_type,
//         source: formData.source,
//         mrp_run_id: formData.mrp_run_id || null,
//         department: formData.department,
//         required_by: formData.required_by, // Changed from required_date to required_by and moved to root level
//         items: [{
//           item_id: formData.item.item_id,
//           required_qty: parseFloat(formData.item.required_qty),
//           estimated_price: parseFloat(formData.item.estimated_price),
//           remarks: formData.item.remarks
//         }],
//         status: pr?.status || 'Draft', // Preserve existing status or set to Draft
//         updated_by: user._id
//       };

//       const response = await axios.put(`${BASE_URL}/api/purchase-requisitions/${pr._id}`, submissionData, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update purchase requisition');
//       }
//     } catch (err) {
//       console.error('Error updating PR:', err);
//       setError(err.response?.data?.message || 'Failed to update purchase requisition');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       pr_type: 'Material',
//       source: 'Manual',
//       mrp_run_id: '',
//       department: '',
//       required_by: '',
//       item: {
//         item_id: '',
//         required_qty: '',
//         estimated_price: '',
//         remarks: ''
//       }
//     });
//     setFieldErrors({});
//     setError('');
//     setActiveStep(0);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const selectedItem = items.find(i => i._id === formData.item.item_id);
//   const totalValue = selectedItem && formData.item.required_qty && formData.item.estimated_price 
//     ? parseFloat(formData.item.required_qty) * parseFloat(formData.item.estimated_price) 
//     : 0;
//   const today = new Date().toISOString().split('T')[0];

//   if (!pr) return null;

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Basic Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       PR TYPE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.pr_type}>
//                       <Select
//                         name="pr_type"
//                         value={formData.pr_type}
//                         onChange={handleSelectChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {prTypes.map(type => <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>{type.label}</MenuItem>)}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       SOURCE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.source}>
//                       <Select
//                         name="source"
//                         value={formData.source}
//                         onChange={handleSelectChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {sources.map(src => <MenuItem key={src.value} value={src.value} sx={{ fontSize: '0.75rem' }}>{src.label}</MenuItem>)}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.department}>
//                       <Select
//                         name="department"
//                         value={formData.department}
//                         onChange={handleSelectChange}
//                         sx={{
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                           '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
//                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
//                         }}
//                       >
//                         {departments.map(dept => <MenuItem key={dept.value} value={dept.value} sx={{ fontSize: '0.75rem' }}>{dept.label}</MenuItem>)}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 3 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       REQUIRED DATE <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField 
//                       fullWidth 
//                       size="small" 
//                       type="date" 
//                       name="required_by"
//                       value={formData.required_by} 
//                       onChange={handleChange}
//                       error={!!fieldErrors.required_by}
//                       helperText={fieldErrors.required_by}
//                       InputLabelProps={{ shrink: true }}
//                       inputProps={{ min: today }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                         '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       MRP RUN ID
//                     </Typography>
//                     <TextField 
//                       fullWidth 
//                       size="small" 
//                       name="mrp_run_id" 
//                       value={formData.mrp_run_id} 
//                       onChange={handleChange} 
//                       placeholder="e.g., MRP-20250315-001"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
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
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Item Details
//               </Typography>
              
//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       SELECT ITEM <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       options={items}
//                       loading={loadingItems}
//                       value={selectedItem || null}
//                       onChange={(e, val) => handleItemChange('item_id', val?._id || '')}
//                       getOptionLabel={(opt) => {
//                         const partNo = opt.part_no || opt.PartNo || '';
//                         const desc = opt.part_description || opt.Description || '';
//                         return `${partNo} - ${desc}`;
//                       }}
//                       renderInput={(params) => (
//                         <TextField 
//                           {...params} 
//                           size="small" 
//                           placeholder="Search and select an item..." 
//                           error={!!fieldErrors.item_id} 
//                           helperText={fieldErrors.item_id}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                             '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                           }}
//                         />
//                       )}
//                     />
//                   </Box>
//                 </Grid>

//                 {selectedItem && (
//                   <>
//                     <Grid size={{ xs: 12, md: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           PART NUMBER
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={selectedItem.part_no || selectedItem.PartNo || ''}
//                           disabled
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               backgroundColor: COLORS.background.light
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 6 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           DESCRIPTION
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={selectedItem.part_description || selectedItem.Description || ''}
//                           disabled
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               backgroundColor: COLORS.background.light
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           UNIT
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={selectedItem.unit || selectedItem.Unit || 'Nos'}
//                           disabled
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               backgroundColor: COLORS.background.light
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           QUANTITY <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <TextField 
//                           fullWidth 
//                           size="small" 
//                           type="number" 
//                           placeholder="Enter quantity" 
//                           value={formData.item.required_qty} 
//                           onChange={(e) => handleItemChange('required_qty', e.target.value)} 
//                           error={!!fieldErrors.required_qty} 
//                           helperText={fieldErrors.required_qty} 
//                           inputProps={{ step: 1, min: 1 }} 
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                             '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           ESTIMATED PRICE <span style={{ color: '#EF4444' }}>*</span>
//                         </Typography>
//                         <TextField 
//                           fullWidth 
//                           size="small" 
//                           type="number" 
//                           placeholder="Enter price" 
//                           value={formData.item.estimated_price} 
//                           onChange={(e) => handleItemChange('estimated_price', e.target.value)} 
//                           error={!!fieldErrors.estimated_price} 
//                           helperText={fieldErrors.estimated_price} 
//                           InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                             '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     <Grid size={{ xs: 12 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                           REMARKS
//                         </Typography>
//                         <TextField 
//                           fullWidth 
//                           size="small" 
//                           multiline
//                           rows={2}
//                           placeholder="Enter any remarks" 
//                           value={formData.item.remarks} 
//                           onChange={(e) => handleItemChange('remarks', e.target.value)} 
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.primary },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                             },
//                             '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     {formData.item.required_qty && formData.item.estimated_price && (
//                       <Grid size={{ xs: 12 }}>
//                         <Box sx={{ 
//                           p: 2, 
//                           bgcolor: COLORS.background.light, 
//                           borderRadius: 1.5,
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center'
//                         }}>
//                           <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                             Total Value:
//                           </Typography>
//                           <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
//                             ₹{totalValue.toLocaleString()}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     )}
//                   </>
//                 )}
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
//           overflow: 'hidden',
//           maxHeight: '95vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 1
//       }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Edit Purchase Requisition
//           </Typography>
//           <Chip 
//             label={`PR: ${pr.pr_number}`} 
//             size="small" 
//             sx={{ 
//               bgcolor: COLORS.primaryLight, 
//               color: COLORS.primary, 
//               fontSize: '0.7rem',
//               borderRadius: 1.5
//             }} 
//           />
//         </Box>

//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 0.5, mt: 0.5 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
//         {renderStepContent(activeStep)}

//         {error && (
//           <Alert 
//             severity="error" 
//             sx={{ 
//               mt: 2, 
//               borderRadius: 1.5,
//               '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
//               fontSize: '0.75rem',
//               py: 0.5
//             }}
//           >
//             {error}
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: 1
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
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || !formData.item.item_id || !formData.item.required_qty || !formData.item.estimated_price || !formData.required_by}
//               startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
//               sx={{
//                 height: 32,
//                 px: 2,
//                 borderRadius: 1.5,
//                 bgcolor: COLORS.primary,
//                 fontSize: '0.7rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                 '&:hover': { bgcolor: COLORS.primaryDark }
//               }}
//             >
//               {loading ? 'Updating...' : 'Update Requisition'}
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
//                 '&:hover': { bgcolor: COLORS.primaryDark }
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

// export default EditPurchaseRequisition;

// EditPurchaseRequisition.js
import React, { useState, useEffect } from 'react';
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
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  InputAdornment,
  Chip,
  styled
} from '@mui/material';
import { 
  Edit as EditIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddDepartments from '../../hrmaster/departmentmaster/AddDepartments';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  background: { white: '#FFFFFF', light: '#F8FFFC', hover: '#F0FDF9' },
  border: '#E3E8EF'
};

// Modern Stepper Connector
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

// Custom styled Paper for dropdowns
const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none'
});

const steps = ['Basic Information', 'Item Details'];

const EditPurchaseRequisition = ({ open, onClose, pr, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    pr_type: 'Material',
    source: 'Manual',
    mrp_run_id: '',
    department: '',
    required_by: '',
    item: {
      item_id: '',
      required_qty: '',
      estimated_price: '',
      remarks: ''
    }
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const prTypes = [
    { value: 'Material', label: 'Material' },
    { value: 'Service', label: 'Service' },
    { value: 'Capital', label: 'Capital' },
    { value: 'Subcontract', label: 'Subcontract' }
  ];

  const sources = [
    { value: 'MRP Auto', label: 'MRP Auto' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Reorder Alert', label: 'Reorder Alert' },
    { value: 'Indent', label: 'Indent' }
  ];

  useEffect(() => {
    if (open && pr) {
      fetchItems();
      fetchDepartments();
    }
  }, [open, pr]);

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Helper function to get department ID from object or string
  const getDepartmentId = (department) => {
    if (!department) return '';
    if (typeof department === 'string') return department;
    if (typeof department === 'object' && department._id) return department._id;
    return '';
  };

  // Helper function to get department name from object or string
  const getDepartmentName = (department) => {
    if (!department) return '';
    if (typeof department === 'string') return department;
    if (typeof department === 'object' && department.DepartmentName) return department.DepartmentName;
    return '';
  };

  // Handle department added from modal
  const handleDepartmentAdded = (newDepartment) => {
    setDepartments(prev => [...prev, newDepartment]);
    setFormData(prev => ({
      ...prev,
      department: newDepartment._id
    }));
    if (fieldErrors.department) {
      setFieldErrors(prev => ({
        ...prev,
        department: ''
      }));
    }
  };

  const loadPRData = () => {
    if (!pr) return;

    // Get the first item from items array
    const firstItem = pr.items?.[0] || {};
    
    // Format the required_by date
    let formattedRequiredBy = '';
    if (firstItem.required_by) {
      formattedRequiredBy = new Date(firstItem.required_by).toISOString().split('T')[0];
    } else if (pr.required_by) {
      formattedRequiredBy = new Date(pr.required_by).toISOString().split('T')[0];
    }

    // Get department ID (handle both string and object)
    const departmentId = getDepartmentId(pr.department);

    setFormData({
      pr_type: pr.pr_type || 'Material',
      source: pr.source || 'Manual',
      mrp_run_id: pr.mrp_run_id || '',
      department: departmentId,
      required_by: formattedRequiredBy,
      item: {
        item_id: firstItem.item_id || '',
        required_qty: firstItem.required_qty || '',
        estimated_price: firstItem.estimated_price || '',
        remarks: firstItem.remarks || ''
      }
    });
  };

  // Load PR data when departments are loaded
  useEffect(() => {
    if (open && pr && departments.length > 0) {
      loadPRData();
    }
  }, [open, pr, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (field, value) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setFormData(prev => ({
      ...prev,
      item: { ...prev.item, [field]: value }
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.pr_type) {
          errors.pr_type = 'PR type is required';
          isValid = false;
        }
        if (!formData.source) {
          errors.source = 'Source is required';
          isValid = false;
        }
        if (!formData.department) {
          errors.department = 'Department is required';
          isValid = false;
        }
        if (!formData.required_by) {
          errors.required_by = 'Required date is required';
          isValid = false;
        }
        break;
      case 1: // Item Details
        if (!formData.item.item_id) {
          errors.item_id = 'Item is required';
          isValid = false;
        }
        if (!formData.item.required_qty) {
          errors.required_qty = 'Quantity is required';
          isValid = false;
        } else if (formData.item.required_qty <= 0) {
          errors.required_qty = 'Quantity must be greater than 0';
          isValid = false;
        }
        if (!formData.item.estimated_price) {
          errors.estimated_price = 'Estimated price is required';
          isValid = false;
        } else if (formData.item.estimated_price <= 0) {
          errors.estimated_price = 'Price must be greater than 0';
          isValid = false;
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill all required fields');
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
    if (!formData.item.item_id || !formData.item.required_qty || !formData.item.estimated_price) {
      setError('Please fill all item details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const submissionData = {
        pr_type: formData.pr_type,
        source: formData.source,
        mrp_run_id: formData.mrp_run_id || null,
        department: formData.department,
        required_by: formData.required_by,
        items: [{
          item_id: formData.item.item_id,
          required_qty: parseFloat(formData.item.required_qty),
          estimated_price: parseFloat(formData.item.estimated_price),
          remarks: formData.item.remarks
        }],
        status: pr?.status || 'Draft',
        updated_by: user._id
      };

      const response = await axios.put(`${BASE_URL}/api/purchase-requisitions/${pr._id}`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update purchase requisition');
      }
    } catch (err) {
      console.error('Error updating PR:', err);
      setError(err.response?.data?.message || 'Failed to update purchase requisition');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pr_type: 'Material',
      source: 'Manual',
      mrp_run_id: '',
      department: '',
      required_by: '',
      item: {
        item_id: '',
        required_qty: '',
        estimated_price: '',
        remarks: ''
      }
    });
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedItem = items.find(i => i._id === formData.item.item_id);
  const selectedDepartment = departments.find(dept => dept._id === formData.department);
  const totalValue = selectedItem && formData.item.required_qty && formData.item.estimated_price 
    ? parseFloat(formData.item.required_qty) * parseFloat(formData.item.estimated_price) 
    : 0;
  const today = new Date().toISOString().split('T')[0];

  if (!pr) return null;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                {/* Row 1: PR Type, Source, Department */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PR TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.pr_type}>
                      <Select
                        name="pr_type"
                        value={formData.pr_type}
                        onChange={handleSelectChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                        }}
                      >
                        {prTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SOURCE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.source}>
                      <Select
                        name="source"
                        value={formData.source}
                        onChange={handleSelectChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                        }}
                      >
                        {sources.map((src) => (
                          <MenuItem key={src.value} value={src.value} sx={{ fontSize: '0.75rem' }}>
                            {src.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          options={departments}
                          loading={loadingDepartments}
                          getOptionLabel={(option) => {
                            if (!option || !option.DepartmentName) return '';
                            return option.DepartmentName;
                          }}
                          isOptionEqualToValue={(option, value) => {
                            if (!option || !value) return false;
                            return option._id === value._id;
                          }}
                          value={selectedDepartment || null}
                          onChange={(event, newValue) => {
                            setFormData(prev => ({
                              ...prev,
                              department: newValue?._id || ''
                            }));
                            if (fieldErrors.department) {
                              setFieldErrors(prev => ({ ...prev, department: '' }));
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select department"
                              error={!!fieldErrors.department}
                              helperText={fieldErrors.department}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  '&:hover fieldset': { borderColor: COLORS.primary },
                                  '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                                },
                                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                          PaperComponent={CustomPaper}
                          noOptionsText="No departments found"
                        />
                      </Box>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddDepartmentOpen(true)}
                        startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                        sx={{
                          height: 32,
                          minWidth: 'auto',
                          px: 1.5,
                          borderRadius: 1.5,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.text.secondary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            borderColor: COLORS.primary,
                            bgcolor: `${COLORS.primary}10`,
                            color: COLORS.primary
                          }
                        }}
                      >
                        Add New
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                {/* Row 2: Required Date, MRP RUN ID */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      REQUIRED DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      type="date" 
                      name="required_by"
                      value={formData.required_by} 
                      onChange={handleChange}
                      error={!!fieldErrors.required_by}
                      helperText={fieldErrors.required_by}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: today }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                        '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MRP RUN ID
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      name="mrp_run_id" 
                      value={formData.mrp_run_id} 
                      onChange={handleChange} 
                      placeholder="e.g., MRP-20250315-001"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
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
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Item Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SELECT ITEM <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={items}
                      loading={loadingItems}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        const partNo = option.part_no || option.PartNo || '';
                        const desc = option.part_description || option.Description || '';
                        return `${partNo} - ${desc}`;
                      }}
                      isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return option._id === value._id;
                      }}
                      value={selectedItem || null}
                      onChange={(e, val) => handleItemChange('item_id', val?._id || '')}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          size="small" 
                          placeholder="Search and select an item..." 
                          error={!!fieldErrors.item_id} 
                          helperText={fieldErrors.item_id}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                          }}
                        />
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No items found"
                    />
                  </Box>
                </Grid>

                {selectedItem && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          PART NUMBER
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={selectedItem.part_no || selectedItem.PartNo || ''}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              backgroundColor: COLORS.background.light,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.border,
                              },
                            },
                            '& .MuiInputBase-input': { 
                              py: 1, 
                              px: 1.5, 
                              fontSize: '0.75rem',
                              color: COLORS.text.primary,
                              WebkitTextFillColor: COLORS.text.primary,
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: COLORS.text.primary,
                              color: COLORS.text.primary,
                              opacity: 1,
                            }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          DESCRIPTION
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={selectedItem.part_description || selectedItem.Description || ''}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              backgroundColor: COLORS.background.light,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.border,
                              },
                            },
                            '& .MuiInputBase-input': { 
                              py: 1, 
                              px: 1.5, 
                              fontSize: '0.75rem',
                              color: COLORS.text.primary,
                              WebkitTextFillColor: COLORS.text.primary,
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: COLORS.text.primary,
                              color: COLORS.text.primary,
                              opacity: 1,
                            }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          UNIT
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={selectedItem.unit || selectedItem.Unit || 'Nos'}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              backgroundColor: COLORS.background.light,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.border,
                              },
                            },
                            '& .MuiInputBase-input': { 
                              py: 1, 
                              px: 1.5, 
                              fontSize: '0.75rem',
                              color: COLORS.text.primary,
                              WebkitTextFillColor: COLORS.text.primary,
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: COLORS.text.primary,
                              color: COLORS.text.primary,
                              opacity: 1,
                            }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField 
                          fullWidth 
                          size="small" 
                          type="number" 
                          placeholder="Enter quantity" 
                          value={formData.item.required_qty} 
                          onChange={(e) => handleItemChange('required_qty', e.target.value)} 
                          error={!!fieldErrors.required_qty} 
                          helperText={fieldErrors.required_qty} 
                          inputProps={{ step: 1, min: 1 }} 
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          ESTIMATED PRICE <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField 
                          fullWidth 
                          size="small" 
                          type="number" 
                          placeholder="Enter price" 
                          value={formData.item.estimated_price} 
                          onChange={(e) => handleItemChange('estimated_price', e.target.value)} 
                          error={!!fieldErrors.estimated_price} 
                          helperText={fieldErrors.estimated_price} 
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          REMARKS
                        </Typography>
                        <TextField 
                          fullWidth 
                          size="small" 
                          multiline
                          rows={2}
                          placeholder="Enter any remarks" 
                          value={formData.item.remarks} 
                          onChange={(e) => handleItemChange('remarks', e.target.value)} 
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                            },
                            '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    </Grid>

                    {formData.item.required_qty && formData.item.estimated_price && (
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: COLORS.background.light, 
                          borderRadius: 1.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Total Value:
                          </Typography>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                            ₹{totalValue.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </>
                )}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Purchase Requisition
          </Typography>
          <Chip 
            label={`PR: ${pr.pr_number}`} 
            size="small" 
            sx={{ 
              bgcolor: COLORS.primaryLight, 
              color: COLORS.primary, 
              fontSize: '0.7rem',
              borderRadius: 1.5
            }} 
          />
        </Box>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
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
              '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
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
            }
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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
              disabled={loading || !formData.item.item_id || !formData.item.required_qty || !formData.item.estimated_price || !formData.required_by}
              startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? 'Updating...' : 'Update Requisition'}
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
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>

      {/* Add Department Modal */}
      <AddDepartments
        open={addDepartmentOpen}
        onClose={() => setAddDepartmentOpen(false)}
        onAdd={handleDepartmentAdded}
      />
    </Dialog>
  );
};

export default EditPurchaseRequisition;