// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   Typography,
//   Box,
//   Autocomplete,
//   Switch,
//   FormControlLabel,
//   CircularProgress
// } from '@mui/material';
// import { Edit as EditIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants matching other components
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
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// const EditProcess = ({ open, onClose, process, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     process_id: '',
//     process_name: '',
//     category: 'Core',
//     rate_type: 'Per Hour',
//     description: '',
//     work_centre: '',
//     setup_time_min: 0,
//     cycle_time_min: 0,
//     is_subcontract: false,
//     default_vendor: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // State for dropdown options
//   const [workCentres, setWorkCentres] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [loadingWorkCentres, setLoadingWorkCentres] = useState(false);
//   const [loadingVendors, setLoadingVendors] = useState(false);

//   // Category options based on enum in backend
//   const categoryOptions = ['Core', 'Finishing', 'Packing', 'Other'];
  
//   // Rate type options based on enum in backend
//   const rateTypeOptions = ['Per Kg', 'Per Nos', 'Per Hour', 'Fixed'];

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedRateType, setSelectedRateType] = useState(null);
//   const [selectedWorkCentre, setSelectedWorkCentre] = useState(null);
//   const [selectedVendor, setSelectedVendor] = useState(null);

//   // Fetch work centres (machines) from API
//   useEffect(() => {
//     if (open) {
//       fetchWorkCentres();
//       fetchVendors();
//     }
//   }, [open]);

//   const fetchWorkCentres = async () => {
//     setLoadingWorkCentres(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/machines`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         // Filter only active machines
//         const activeMachines = response.data.data.filter(machine => machine.is_active === true);
//         setWorkCentres(activeMachines);
//       }
//     } catch (err) {
//       console.error('Error fetching work centres:', err);
//       setError('Failed to load work centres');
//     } finally {
//       setLoadingWorkCentres(false);
//     }
//   };

//   const fetchVendors = async () => {
//     setLoadingVendors(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/vendors`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         setVendors(response.data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//       setError('Failed to load vendors');
//     } finally {
//       setLoadingVendors(false);
//     }
//   };

//  useEffect(() => {
//   if (process) {
//     setFormData({
//       process_id: process.process_id || '',
//       process_name: process.process_name || '',
//       category: process.category || 'Core',
//       rate_type: process.rate_type || 'Per Hour',
//       description: process.description || '',
//       work_centre: process.work_centre?._id || process.work_centre || '', // Handle both object and string
//       setup_time_min: process.setup_time_min || 0,
//       cycle_time_min: process.cycle_time_min || 0,
//       is_subcontract: process.is_subcontract || false,
//       default_vendor: process.default_vendor?._id || process.default_vendor || '' // Handle both object and string
//     });

//     // Set selected category
//     if (process.category) {
//       setSelectedCategory(process.category);
//     }

//     // Set selected rate type
//     if (process.rate_type) {
//       setSelectedRateType(process.rate_type);
//     }

//     // Set selected work centre - Handle when work_centre is an object
//     if (process.work_centre && typeof process.work_centre === 'object' && process.work_centre._id) {
//       // If work_centre is a populated object
//       setSelectedWorkCentre(process.work_centre);
//       setFormData(prev => ({
//         ...prev,
//         work_centre: process.work_centre._id
//       }));
//     } else if (process.work_centre && typeof process.work_centre === 'string' && workCentres.length > 0) {
//       // If work_centre is just an ID string, find the full object
//       const foundWorkCentre = workCentres.find(wc => wc._id === process.work_centre);
//       setSelectedWorkCentre(foundWorkCentre || null);
//     }

//     // Set selected vendor - Handle when default_vendor is an object
//     if (process.default_vendor && typeof process.default_vendor === 'object' && process.default_vendor._id) {
//       setSelectedVendor(process.default_vendor);
//     } else if (process.default_vendor && typeof process.default_vendor === 'string' && vendors.length > 0) {
//       const foundVendor = vendors.find(v => v._id === process.default_vendor);
//       setSelectedVendor(foundVendor || null);
//     }
//   }
// }, [process, workCentres, vendors]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleCategoryChange = (event, newValue) => {
//     setSelectedCategory(newValue);
//     setFormData(prev => ({
//       ...prev,
//       category: newValue || 'Core'
//     }));
//   };

//   const handleRateTypeChange = (event, newValue) => {
//     setSelectedRateType(newValue);
//     setFormData(prev => ({
//       ...prev,
//       rate_type: newValue || 'Per Hour'
//     }));
//   };

//   const handleWorkCentreChange = (event, newValue) => {
//     setSelectedWorkCentre(newValue);
//     setFormData(prev => ({
//       ...prev,
//       work_centre: newValue ? newValue._id : ''
//     }));
//   };

//   const handleVendorChange = (event, newValue) => {
//     setSelectedVendor(newValue);
//     setFormData(prev => ({
//       ...prev,
//       default_vendor: newValue ? newValue._id : ''
//     }));
//   };

//   const handleSubcontractChange = (e) => {
//     const checked = e.target.checked;
//     setFormData(prev => ({
//       ...prev,
//       is_subcontract: checked,
//       default_vendor: checked ? prev.default_vendor : '' // Clear vendor if subcontract is unchecked
//     }));
//     if (!checked) {
//       setSelectedVendor(null);
//     }
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!formData.process_id.trim()) {
//       setError('Process ID is required');
//       return;
//     }

//     if (!formData.process_name.trim()) {
//       setError('Process Name is required');
//       return;
//     }

//     if (!formData.category) {
//       setError('Category is required');
//       return;
//     }

//     if (!formData.rate_type) {
//       setError('Rate Type is required');
//       return;
//     }

//     if (!formData.work_centre) {
//       setError('Work Centre is required');
//       return;
//     }

//     if (formData.is_subcontract && !formData.default_vendor) {
//       setError('Default Vendor is required for subcontract processes');
//       return;
//     }

//     // Prepare submission data
//     const submissionData = {
//       process_id: formData.process_id,
//       process_name: formData.process_name,
//       description: formData.description,
//       category: formData.category,
//       rate_type: formData.rate_type,
//       work_centre: formData.work_centre,
//       setup_time_min: Number(formData.setup_time_min) || 0,
//       cycle_time_min: Number(formData.cycle_time_min) || 0,
//       is_subcontract: formData.is_subcontract
//     };

//     // Only add default_vendor if is_subcontract is true
//     if (formData.is_subcontract && formData.default_vendor) {
//       submissionData.default_vendor = formData.default_vendor;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(`${BASE_URL}/api/processes/${process._id}`, submissionData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update process');
//       }
//     } catch (err) {
//       console.error('Error updating process:', err);
//       setError(err.response?.data?.message || 'Failed to update process. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
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
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography
//           sx={{
//             fontSize: '1.2rem',
//             fontWeight: 700,
//             color: COLORS.text.primary
//           }}
//         >
//           Edit Process
//         </Typography>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
//             {/* Process ID Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   PROCESS ID <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="process_id"
//                   value={formData.process_id}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="e.g., PROC-CNC-001"
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                   Unique identifier for the process
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Process Name Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   PROCESS NAME <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="process_name"
//                   value={formData.process_name}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="e.g., CNC Drilling"
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Category Field - Using Autocomplete */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   CATEGORY <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={categoryOptions}
//                   value={selectedCategory}
//                   onChange={handleCategoryChange}
//                   disabled={loading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Select category"
//                       required
//                       error={!!error && error.includes('Category')}
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
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
//                         {option}
//                       </Typography>
//                     </li>
//                   )}
//                   ListboxProps={{
//                     sx: {
//                       '& .MuiAutocomplete-option': {
//                         fontSize: '0.75rem',
//                         py: 1,
//                         px: 1.5
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Rate Type Field - Using Autocomplete */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   RATE TYPE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={rateTypeOptions}
//                   value={selectedRateType}
//                   onChange={handleRateTypeChange}
//                   disabled={loading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Select rate type"
//                       required
//                       error={!!error && error.includes('Rate Type')}
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
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
//                         {option}
//                       </Typography>
//                     </li>
//                   )}
//                   ListboxProps={{
//                     sx: {
//                       '& .MuiAutocomplete-option': {
//                         fontSize: '0.75rem',
//                         py: 1,
//                         px: 1.5
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Work Centre Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   WORK CENTRE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={workCentres}
//                   getOptionLabel={(option) => option.machine_name || option.machine_id}
//                   isOptionEqualToValue={(option, value) => option._id === value._id}
//                   value={selectedWorkCentre}
//                   onChange={handleWorkCentreChange}
//                   disabled={loading || loadingWorkCentres}
//                   loading={loadingWorkCentres}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Select work centre"
//                       required
//                       InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                           <>
//                             {loadingWorkCentres ? <CircularProgress color="inherit" size={20} /> : null}
//                             {params.InputProps.endAdornment}
//                           </>
//                         ),
//                       }}
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
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       <Box>
//                         <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                           {option.machine_name}
//                         </Typography>
//                         <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           Code: {option.machine_code} | Type: {option.machine_type} | Work Centre: {option.work_centre}
//                         </Typography>
//                       </Box>
//                     </li>
//                   )}
//                   ListboxProps={{
//                     sx: {
//                       '& .MuiAutocomplete-option': {
//                         fontSize: '0.75rem',
//                         py: 1,
//                         px: 1.5
//                       }
//                     }
//                   }}
//                 />
//                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                   Select the machine/work centre for this process
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Setup Time and Cycle Time */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   SETUP TIME (MINUTES)
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="setup_time_min"
//                   type="number"
//                   value={formData.setup_time_min}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="0"
//                   size="small"
//                   variant="outlined"
//                   inputProps={{ min: 0, step: 0.5 }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': { borderColor: COLORS.primary },
//                       '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   CYCLE TIME (MINUTES)
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="cycle_time_min"
//                   type="number"
//                   value={formData.cycle_time_min}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="0"
//                   size="small"
//                   variant="outlined"
//                   inputProps={{ min: 0, step: 0.5 }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': { borderColor: COLORS.primary },
//                       '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Subcontract Toggle */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={formData.is_subcontract}
//                     onChange={handleSubcontractChange}
//                     disabled={loading}
//                     sx={{
//                       '& .MuiSwitch-switchBase.Mui-checked': {
//                         color: COLORS.primary,
//                         '&:hover': {
//                           backgroundColor: `${COLORS.primary}10`,
//                         },
//                       },
//                       '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                         backgroundColor: COLORS.primary,
//                       },
//                     }}
//                   />
//                 }
//                 label={
//                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
//                     Subcontract Process
//                   </Typography>
//                 }
//               />
//             </Box>

//             {/* Default Vendor - Conditional Field */}
//             {formData.is_subcontract && (
//               <Box sx={{ gridColumn: 'span 2' }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography
//                     sx={{
//                       fontSize: '0.7rem',
//                       fontWeight: 600,
//                       color: COLORS.text.secondary,
//                       letterSpacing: '0.5px'
//                     }}
//                   >
//                     DEFAULT VENDOR <span style={{ color: '#EF4444' }}>*</span>
//                   </Typography>
//                   <Autocomplete
//                     fullWidth
//                     options={vendors}
//                     getOptionLabel={(option) => `${option.vendor_name} (${option.vendor_code})`}
//                     isOptionEqualToValue={(option, value) => option._id === value._id}
//                     value={selectedVendor}
//                     onChange={handleVendorChange}
//                     disabled={loading || loadingVendors}
//                     loading={loadingVendors}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         placeholder="Select default vendor"
//                         required
//                         InputProps={{
//                           ...params.InputProps,
//                           endAdornment: (
//                             <>
//                               {loadingVendors ? <CircularProgress color="inherit" size={20} /> : null}
//                               {params.InputProps.endAdornment}
//                             </>
//                           ),
//                         }}
//                         sx={{
//                           '& .MuiOutlinedInput-root': {
//                             borderRadius: 1.5,
//                             fontSize: '0.75rem',
//                             '&:hover fieldset': { borderColor: COLORS.primary },
//                             '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                           },
//                           '& .MuiInputBase-input': {
//                             py: 1,
//                             px: 1.5,
//                             fontSize: '0.75rem',
//                             color: COLORS.text.primary
//                           }
//                         }}
//                       />
//                     )}
//                     renderOption={(props, option) => (
//                       <li {...props}>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                             {option.vendor_name}
//                           </Typography>
//                           <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                             Code: {option.vendor_code} | Type: {option.vendor_type}
//                           </Typography>
//                         </Box>
//                       </li>
//                     )}
//                     ListboxProps={{
//                       sx: {
//                         '& .MuiAutocomplete-option': {
//                           fontSize: '0.75rem',
//                           py: 1,
//                           px: 1.5
//                         }
//                       }
//                     }}
//                   />
//                 </Box>
//               </Box>
//             )}

//             {/* Description Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   DESCRIPTION
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   multiline
//                   rows={3}
//                   disabled={loading}
//                   placeholder="Describe the process, equipment used, special requirements, etc."
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Process Information Preview */}
//             {process && (
//               <Box sx={{ 
//                 gridColumn: 'span 2',
//                 p: 2, 
//                 bgcolor: COLORS.primaryLight, 
//                 borderRadius: 1.5,
//                 border: `1px solid ${COLORS.primary}`,
//                 mt: 1
//               }}>
//                 <Typography 
//                   variant="subtitle2" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: COLORS.primaryDark, 
//                     mb: 1.5,
//                     fontSize: '0.8rem'
//                   }}
//                 >
//                   Process Information
//                 </Typography>
//                 <Stack spacing={1}>
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Process ID:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {formData.process_id || process.process_id}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Process Name:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {formData.process_name || process.process_name}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Category:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {formData.category}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rate Type:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {formData.rate_type}
//                     </Typography>
//                   </Stack>

//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {selectedWorkCentre ? selectedWorkCentre.machine_name : (process.work_centre_name || 'Not selected')}
//                     </Typography>
//                   </Stack>

//                   {selectedWorkCentre && (
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code:</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                         {selectedWorkCentre.machine_code}
//                       </Typography>
//                     </Stack>
//                   )}

//                   {formData.is_subcontract && (
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Default Vendor:</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                         {selectedVendor ? selectedVendor.vendor_name : (process.default_vendor_name || 'Not selected')}
//                       </Typography>
//                     </Stack>
//                   )}

//                   {formData.description && (
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Description:</Typography>
//                       <Typography 
//                         sx={{ 
//                           fontSize: '0.7rem', 
//                           fontWeight: 500, 
//                           color: COLORS.text.primary,
//                           maxWidth: '60%', 
//                           textAlign: 'right' 
//                         }}
//                       >
//                         {formData.description}
//                       </Typography>
//                     </Stack>
//                   )}
//                 </Stack>
//               </Box>
//             )}
//           </Box>
          
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1.5,
//                 mt: 1,
//                 '& .MuiAlert-icon': {
//                   fontSize: '1.25rem',
//                   alignItems: 'center'
//                 },
//                 fontSize: '0.75rem',
//                 py: 0.5
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: 1
//       }}>
//         <Button
//           onClick={onClose}
//           disabled={loading}
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
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || !formData.process_id || !formData.process_name || !formData.work_centre || (formData.is_subcontract && !formData.default_vendor)}
//           startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.primary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//             '&:hover': {
//               bgcolor: COLORS.primaryDark,
//             },
//             '&:disabled': {
//               bgcolor: COLORS.border,
//               color: COLORS.text.tertiary
//             }
//           }}
//         >
//           {loading ? 'Updating...' : 'Update Process'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditProcess;




import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  Autocomplete,
  Switch,
  FormControlLabel,
  CircularProgress,
  Collapse,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Error as ErrorIcon, Close as CloseIcon } from '@mui/icons-material';
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

const EditProcess = ({ open, onClose, process, onUpdate }) => {
  const [formData, setFormData] = useState({
    process_id: '',
    process_name: '',
    category: 'Core',
    rate_type: 'Per Hour',
    description: '',
    work_centre: '',
    setup_time_min: 0,
    cycle_time_min: 0,
    is_subcontract: false,
    default_vendor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // State for dropdown options
  const [workCentres, setWorkCentres] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingWorkCentres, setLoadingWorkCentres] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);

  // Category options based on enum in backend
  const categoryOptions = ['Core', 'Finishing', 'Packing', 'Other'];
  
  // Rate type options based on enum in backend
  const rateTypeOptions = ['Per Kg', 'Per Nos', 'Per Hour', 'Fixed'];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRateType, setSelectedRateType] = useState(null);
  const [selectedWorkCentre, setSelectedWorkCentre] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const showError = (message) => {
    setError(message);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Fetch work centres (machines) from API
  useEffect(() => {
    if (open) {
      fetchWorkCentres();
      fetchVendors();
    }
  }, [open]);

  const fetchWorkCentres = async () => {
    setLoadingWorkCentres(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Filter only active machines
        const activeMachines = response.data.data.filter(machine => machine.is_active === true);
        setWorkCentres(activeMachines);
      }
    } catch (err) {
      console.error('Error fetching work centres:', err);
      showError('Failed to load work centres');
    } finally {
      setLoadingWorkCentres(false);
    }
  };

  const fetchVendors = async () => {
    setLoadingVendors(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      showError('Failed to load vendors');
    } finally {
      setLoadingVendors(false);
    }
  };

  useEffect(() => {
    if (process) {
      setFormData({
        process_id: process.process_id || '',
        process_name: process.process_name || '',
        category: process.category || 'Core',
        rate_type: process.rate_type || 'Per Hour',
        description: process.description || '',
        work_centre: process.work_centre?._id || process.work_centre || '', // Handle both object and string
        setup_time_min: process.setup_time_min || 0,
        cycle_time_min: process.cycle_time_min || 0,
        is_subcontract: process.is_subcontract || false,
        default_vendor: process.default_vendor?._id || process.default_vendor || '' // Handle both object and string
      });

      // Set selected category
      if (process.category) {
        setSelectedCategory(process.category);
      }

      // Set selected rate type
      if (process.rate_type) {
        setSelectedRateType(process.rate_type);
      }

      // Set selected work centre - Handle when work_centre is an object
      if (process.work_centre && typeof process.work_centre === 'object' && process.work_centre._id) {
        // If work_centre is a populated object
        setSelectedWorkCentre(process.work_centre);
        setFormData(prev => ({
          ...prev,
          work_centre: process.work_centre._id
        }));
      } else if (process.work_centre && typeof process.work_centre === 'string' && workCentres.length > 0) {
        // If work_centre is just an ID string, find the full object
        const foundWorkCentre = workCentres.find(wc => wc._id === process.work_centre);
        setSelectedWorkCentre(foundWorkCentre || null);
      }

      // Set selected vendor - Handle when default_vendor is an object
      if (process.default_vendor && typeof process.default_vendor === 'object' && process.default_vendor._id) {
        setSelectedVendor(process.default_vendor);
      } else if (process.default_vendor && typeof process.default_vendor === 'string' && vendors.length > 0) {
        const foundVendor = vendors.find(v => v._id === process.default_vendor);
        setSelectedVendor(foundVendor || null);
      }
    }
  }, [process, workCentres, vendors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setFieldErrors(prev => ({ ...prev, category: '' }));
    setFormData(prev => ({
      ...prev,
      category: newValue || 'Core'
    }));
  };

  const handleRateTypeChange = (event, newValue) => {
    setSelectedRateType(newValue);
    setFieldErrors(prev => ({ ...prev, rate_type: '' }));
    setFormData(prev => ({
      ...prev,
      rate_type: newValue || 'Per Hour'
    }));
  };

  const handleWorkCentreChange = (event, newValue) => {
    setSelectedWorkCentre(newValue);
    setFieldErrors(prev => ({ ...prev, work_centre: '' }));
    setFormData(prev => ({
      ...prev,
      work_centre: newValue ? newValue._id : ''
    }));
  };

  const handleVendorChange = (event, newValue) => {
    setSelectedVendor(newValue);
    setFieldErrors(prev => ({ ...prev, default_vendor: '' }));
    setFormData(prev => ({
      ...prev,
      default_vendor: newValue ? newValue._id : ''
    }));
  };

  const handleSubcontractChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      is_subcontract: checked,
      default_vendor: checked ? prev.default_vendor : '' // Clear vendor if subcontract is unchecked
    }));
    if (!checked) {
      setSelectedVendor(null);
      setFieldErrors(prev => ({ ...prev, default_vendor: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    // Process ID validation
    if (!formData.process_id.trim()) {
      errors.process_id = 'Process ID is required';
      errorMessages.push('Process ID is required');
      isValid = false;
    } else if (formData.process_id.length > 50) {
      errors.process_id = 'Process ID should not exceed 50 characters';
      errorMessages.push('Process ID should not exceed 50 characters');
      isValid = false;
    }

    // Process Name validation
    if (!formData.process_name.trim()) {
      errors.process_name = 'Process Name is required';
      errorMessages.push('Process Name is required');
      isValid = false;
    } else if (formData.process_name.length > 100) {
      errors.process_name = 'Process Name should not exceed 100 characters';
      errorMessages.push('Process Name should not exceed 100 characters');
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
      errorMessages.push('Category is required');
      isValid = false;
    }

    // Rate Type validation
    if (!formData.rate_type) {
      errors.rate_type = 'Rate Type is required';
      errorMessages.push('Rate Type is required');
      isValid = false;
    }

    // Work Centre validation
    if (!formData.work_centre) {
      errors.work_centre = 'Work Centre is required';
      errorMessages.push('Work Centre is required');
      isValid = false;
    }

    // Vendor validation for subcontract
    if (formData.is_subcontract && !formData.default_vendor) {
      errors.default_vendor = 'Default Vendor is required for subcontract processes';
      errorMessages.push('Default Vendor is required for subcontract processes');
      isValid = false;
    }

    // Time fields validation
    if (formData.setup_time_min < 0) {
      errors.setup_time_min = 'Setup time cannot be negative';
      errorMessages.push('Setup time cannot be negative');
      isValid = false;
    }

    if (formData.cycle_time_min < 0) {
      errors.cycle_time_min = 'Cycle time cannot be negative';
      errorMessages.push('Cycle time cannot be negative');
      isValid = false;
    }

    setFieldErrors(errors);
    
    if (!isValid) {
      showError(errorMessages[0]);
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Prepare submission data
    const submissionData = {
      process_id: formData.process_id,
      process_name: formData.process_name,
      description: formData.description,
      category: formData.category,
      rate_type: formData.rate_type,
      work_centre: formData.work_centre,
      setup_time_min: Number(formData.setup_time_min) || 0,
      cycle_time_min: Number(formData.cycle_time_min) || 0,
      is_subcontract: formData.is_subcontract
    };

    // Only add default_vendor if is_subcontract is true
    if (formData.is_subcontract && formData.default_vendor) {
      submissionData.default_vendor = formData.default_vendor;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/processes/${process._id}`, submissionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        showError(response.data.message || 'Failed to update process');
      }
    } catch (err) {
      console.error('Error updating process:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update process. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Edit Process
        </Typography>
      </DialogTitle>

      {/* Floating Error Alert - Positioned at top of dialog content */}
      <Box sx={{ px: 2.5, pt: 1 }}>
        <FloatingErrorAlert error={error} onClose={() => setError('')} />
      </Box>

      <DialogContent sx={{ p: 2.5, pt: error ? 1 : 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Process ID Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  PROCESS ID <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="process_id"
                  value={formData.process_id}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., PROC-CNC-001"
                  size="small"
                  variant="outlined"
                  error={!!fieldErrors.process_id}
                  helperText={fieldErrors.process_id}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#EF4444'
                      }
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
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Unique identifier for the process (max 50 characters)
                </Typography>
              </Box>
            </Box>

            {/* Process Name Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  PROCESS NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="process_name"
                  value={formData.process_name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., CNC Drilling"
                  size="small"
                  variant="outlined"
                  error={!!fieldErrors.process_name}
                  helperText={fieldErrors.process_name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#EF4444'
                      }
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
            </Box>

            {/* Category Field - Using Autocomplete */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  CATEGORY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select category"
                      required
                      error={!!fieldErrors.category}
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </Typography>
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
                {fieldErrors.category && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    {fieldErrors.category}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Rate Type Field - Using Autocomplete */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  RATE TYPE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={rateTypeOptions}
                  value={selectedRateType}
                  onChange={handleRateTypeChange}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select rate type"
                      required
                      error={!!fieldErrors.rate_type}
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </Typography>
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
                {fieldErrors.rate_type && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    {fieldErrors.rate_type}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Work Centre Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  WORK CENTRE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={workCentres}
                  getOptionLabel={(option) => option.machine_name || option.machine_id}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  value={selectedWorkCentre}
                  onChange={handleWorkCentreChange}
                  disabled={loading || loadingWorkCentres}
                  loading={loadingWorkCentres}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select work centre"
                      required
                      error={!!fieldErrors.work_centre}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingWorkCentres ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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
                          color: COLORS.text.primary
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {option.machine_name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Code: {option.machine_code} | Type: {option.machine_type} | Work Centre: {option.work_centre}
                        </Typography>
                      </Box>
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
                {fieldErrors.work_centre && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    {fieldErrors.work_centre}
                  </Typography>
                )}
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Select the machine/work centre for this process
                </Typography>
              </Box>
            </Box>

            {/* Setup Time and Cycle Time */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  SETUP TIME (MINUTES)
                </Typography>
                <TextField
                  fullWidth
                  name="setup_time_min"
                  type="number"
                  value={formData.setup_time_min}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0"
                  size="small"
                  variant="outlined"
                  error={!!fieldErrors.setup_time_min}
                  helperText={fieldErrors.setup_time_min}
                  inputProps={{ min: 0, step: 0.5 }}
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
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  CYCLE TIME (MINUTES)
                </Typography>
                <TextField
                  fullWidth
                  name="cycle_time_min"
                  type="number"
                  value={formData.cycle_time_min}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0"
                  size="small"
                  variant="outlined"
                  error={!!fieldErrors.cycle_time_min}
                  helperText={fieldErrors.cycle_time_min}
                  inputProps={{ min: 0, step: 0.5 }}
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
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Subcontract Toggle */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_subcontract}
                    onChange={handleSubcontractChange}
                    disabled={loading}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: COLORS.primary,
                        '&:hover': {
                          backgroundColor: `${COLORS.primary}10`,
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: COLORS.primary,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    Subcontract Process
                  </Typography>
                }
              />
            </Box>

            {/* Default Vendor - Conditional Field */}
            {formData.is_subcontract && (
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: COLORS.text.secondary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    DEFAULT VENDOR <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={vendors}
                    getOptionLabel={(option) => `${option.vendor_name} (${option.vendor_code})`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    value={selectedVendor}
                    onChange={handleVendorChange}
                    disabled={loading || loadingVendors}
                    loading={loadingVendors}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select default vendor"
                        required
                        error={!!fieldErrors.default_vendor}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingVendors ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
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
                            color: COLORS.text.primary
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {option.vendor_name}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Code: {option.vendor_code} | Type: {option.vendor_type}
                          </Typography>
                        </Box>
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
                  {fieldErrors.default_vendor && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.default_vendor}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* Description Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  DESCRIPTION
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Describe the process, equipment used, special requirements, etc."
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
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
            </Box>

            {/* Process Information Preview */}
            {process && (
              <Box sx={{ 
                gridColumn: 'span 2',
                p: 2, 
                bgcolor: COLORS.primaryLight, 
                borderRadius: 1.5,
                border: `1px solid ${COLORS.primary}`,
                mt: 1
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: COLORS.primaryDark, 
                    mb: 1.5,
                    fontSize: '0.8rem'
                  }}
                >
                  Process Information
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Process ID:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.process_id || process.process_id}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Process Name:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.process_name || process.process_name}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Category:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.category}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rate Type:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.rate_type}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedWorkCentre ? selectedWorkCentre.machine_name : (process.work_centre_name || 'Not selected')}
                    </Typography>
                  </Stack>

                  {selectedWorkCentre && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine Code:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {selectedWorkCentre.machine_code}
                      </Typography>
                    </Stack>
                  )}

                  {formData.is_subcontract && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Default Vendor:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {selectedVendor ? selectedVendor.vendor_name : (process.default_vendor_name || 'Not selected')}
                      </Typography>
                    </Stack>
                  )}

                  {formData.description && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Description:</Typography>
                      <Typography 
                        sx={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 500, 
                          color: COLORS.text.primary,
                          maxWidth: '60%', 
                          textAlign: 'right' 
                        }}
                      >
                        {formData.description}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            )}
          </Box>
        </Stack>
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
          onClick={onClose}
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
          onClick={handleSubmit}
          disabled={loading}
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
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Process'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProcess;