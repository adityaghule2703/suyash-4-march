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
//   styled,
//   Autocomplete,
//   CircularProgress,
//   Tooltip,
//   IconButton
// } from '@mui/material';
// import { 
//   Edit as EditIcon,
//   Add as AddIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddTax from '../taxmaster/AddTax';


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

// const steps = ['Basic Info', 'Drawing & Material', 'RM Details & Tax', 'Process Parameters'];

// // Options — kept in sync with AddItem
// const unitOptions = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];
// const itemCategoryOptions = ['Raw Material', 'Semi-Finished', 'Finished Good', 'Consumable', 'Tool', 'Bought-Out', 'Subcontract'];
// const itemTypeOptions = ['Busbar', 'Stamping', 'Gasket', 'Tooling', 'Copper Strip', 'Aluminium Profile', 'Rubber Sheet', 'Cork', 'Other'];
// const procurementTypeOptions = ['Manufacture', 'Purchase', 'Subcontract', 'In-House'];
// const rmTypeOptions = ['Strip', 'Profile', 'Sheet', 'Wire', 'Tube', 'Compound', 'Bar', 'Rod', 'Coil'];

// // ─── Validation helpers ───────────────────────────────────────────────────────
// const validatePartNo = (v) => {
//   if (!v?.trim()) return 'Part number is required';
//   if (v.length > 50) return 'Part number should not exceed 50 characters';
//   return '';
// };
// const validatePartName = (v) => {
//   if (!v?.trim()) return 'Part name is required';
//   if (v.length > 100) return 'Part name should not exceed 100 characters';
//   return '';
// };
// const validatePartDescription = (v) => {
//   if (!v?.trim()) return 'Part description is required';
//   if (v.length > 200) return 'Part description should not exceed 200 characters';
//   return '';
// };
// const validateItemCategory = (v) => (!v ? 'Item category is required' : '');
// const validateItemType = (v) => (!v ? 'Item type is required' : '');
// const validateMaterial = (v) => {
//   if (!v?.trim()) return 'Material is required';
//   if (v.length > 100) return 'Material should not exceed 100 characters';
//   return '';
// };
// const validateDensity = (v) => (v && (isNaN(v) || v <= 0) ? 'Density must be a positive number' : '');
// const validateThickness = (v) => (v && (isNaN(v) || v <= 0) ? 'Thickness must be a positive number' : '');
// const validateWidth = (v) => (v && (isNaN(v) || v <= 0) ? 'Width must be a positive number' : '');
// const validateGSTPercentage = (v) => (v && (isNaN(v) || v < 0 || v > 100) ? 'GST percentage must be between 0 and 100' : '');
// const validateReorderLevel = (v) => (v && (isNaN(v) || v < 0) ? 'Reorder level must be a positive number' : '');
// const validateLeadTimeDays = (v) => (v && (isNaN(v) || v < 0) ? 'Lead time must be a positive number' : '');
// const validateStripSize = (v) => (v && (isNaN(v) || v <= 0) ? 'Strip size must be a positive number' : '');
// const validatePitch = (v) => (v && (isNaN(v) || v <= 0) ? 'Pitch must be a positive number' : '');
// const validateNoOfCavity = (v) => (v && (isNaN(v) || v < 1) ? 'Number of cavities must be at least 1' : '');
// const validatePercentage = (v, label) => (v && (isNaN(v) || v < 0 || v > 100) ? `${label} must be between 0 and 100` : '');

// // ─── Empty form state ─────────────────────────────────────────────────────────
// const emptyForm = {
//   part_no: '',
//   part_name: '',
//   part_description: '',
//   item_category: '',
//   item_type: '',
//   drawing_no: '',
//   revision_no: '',
//   rm_grade: '',
//   density: '',
//   thickness: '',
//   width: '',
//   unit: '',
//   hsn_code: '',
//   gst_percentage: '',
//   procurement_type: '',
//   reorder_level: '',
//   lead_time_days: '',
//   material: '',
//   rm_source: '',
//   rm_type: '',
//   rm_spec: '',
//   strip_size: '',
//   pitch: '',
//   no_of_cavity: 1,
//   rm_rejection_percent: '',
//   scrap_realisation_percent: ''
// };

// // ─── Helper: safely convert nullable number to string ────────────────────────
// const numStr = (v) => (v !== undefined && v !== null ? v.toString() : '');

// // ─── Component ────────────────────────────────────────────────────────────────
// const EditItem = ({ open, onClose, item, onUpdate }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState(emptyForm);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [hsnCodes, setHsnCodes] = useState([]);
//   const [loadingHsn, setLoadingHsn] = useState(false);
//   const [selectedHSN, setSelectedHSN] = useState(null);
  
//   // State for Add Tax dialog
//   const [addTaxOpen, setAddTaxOpen] = useState(false);

//   // ── Shared sx shortcuts ──────────────────────────────────────────────────
//   const textFieldSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 1.5,
//       fontSize: '0.75rem',
//       '&:hover fieldset': { borderColor: COLORS.primary },
//       '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//     },
//     '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary },
//     '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25 }
//   };
//   const numberFieldSx = {
//     ...textFieldSx,
//     '& input[type=number]': { MozAppearance: 'textfield' },
//     '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//       WebkitAppearance: 'none', margin: 0
//     }
//   };
//   const selectSx = {
//     borderRadius: 1.5,
//     fontSize: '0.75rem',
//     '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' }
//   };

//   // ── Fetch HSN codes ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (open) fetchHsnCodes();
//   }, [open]);

//   // ── Populate form when item/hsnCodes change ──────────────────────────────
//   useEffect(() => {
//     if (!item) return;
//     setFormData({
//       part_no: item.part_no || '',
//       part_name: item.part_name || '',
//       part_description: item.part_description || '',
//       item_category: item.item_category || '',
//       item_type: item.item_type || '',
//       drawing_no: item.drawing_no || '',
//       revision_no: item.revision_no || '',
//       rm_grade: item.rm_grade || '',
//       density: numStr(item.density),
//       thickness: numStr(item.thickness),
//       width: numStr(item.width),
//       unit: item.unit || '',
//       hsn_code: item.hsn_code || '',
//       gst_percentage: numStr(item.gst_percentage),
//       procurement_type: item.procurement_type || '',
//       reorder_level: numStr(item.reorder_level),
//       lead_time_days: numStr(item.lead_time_days),
//       material: item.material || '',
//       rm_source: item.rm_source || '',
//       rm_type: item.rm_type || '',
//       rm_spec: item.rm_spec || '',
//       strip_size: numStr(item.strip_size),
//       pitch: numStr(item.pitch),
//       no_of_cavity: item.no_of_cavity || 1,
//       rm_rejection_percent: numStr(item.rm_rejection_percent),
//       scrap_realisation_percent: numStr(item.scrap_realisation_percent)
//     });

//     // Restore selected HSN
//     if (item.hsn_code && hsnCodes.length > 0) {
//       const hsn = hsnCodes.find(h => h.HSNCode === item.hsn_code);
//       setSelectedHSN(hsn || null);
//     }
//   }, [item, hsnCodes]);

//   const fetchHsnCodes = async () => {
//     try {
//       setLoadingHsn(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/taxes`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         const active = (response.data.data || [])
//           .filter(tax => tax.IsActive === true)
//           .map(tax => ({
//             _id: tax._id,
//             HSNCode: tax.HSNCode,
//             Description: tax.Description,
//             GSTPercentage: tax.GSTPercentage || 0
//           }));
//         setHsnCodes(active);
//       }
//     } catch (err) {
//       console.error('Error fetching HSN codes:', err);
//     } finally {
//       setLoadingHsn(false);
//     }
//   };

//   // Handle tax added from AddTax dialog
//   const handleTaxAdded = (newTax) => {
//     // Add the new tax to the hsnCodes list
//     const newHsnCode = {
//       _id: newTax._id,
//       HSNCode: newTax.HSNCode,
//       Description: newTax.Description,
//       GSTPercentage: newTax.GSTPercentage || 0
//     };
//     setHsnCodes(prev => [...prev, newHsnCode]);
    
//     // Auto-select the newly added HSN code
//     setSelectedHSN(newHsnCode);
//     setFormData(prev => ({
//       ...prev,
//       hsn_code: newTax.HSNCode,
//       gst_percentage: newTax.GSTPercentage || ''
//     }));
//   };

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));

//     const numericFields = ['density', 'thickness', 'width', 'gst_percentage', 'reorder_level',
//       'lead_time_days', 'strip_size', 'pitch', 'no_of_cavity',
//       'rm_rejection_percent', 'scrap_realisation_percent'];

//     if (numericFields.includes(name)) {
//       if (value === '' || /^\d*\.?\d*$/.test(value)) {
//         setFormData(prev => ({ ...prev, [name]: value }));
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleHSNChange = (event, newValue) => {
//     setSelectedHSN(newValue);
//     if (newValue) {
//       setFormData(prev => ({
//         ...prev,
//         hsn_code: newValue.HSNCode,
//         gst_percentage: newValue.GSTPercentage || ''
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, hsn_code: '', gst_percentage: '' }));
//     }
//   };

//   // ── Per-field validation ─────────────────────────────────────────────────
//   const validateField = (name, value) => {
//     switch (name) {
//       case 'part_no':              return validatePartNo(value);
//       case 'part_name':            return validatePartName(value);
//       case 'part_description':     return validatePartDescription(value);
//       case 'item_category':        return validateItemCategory(value);
//       case 'item_type':            return validateItemType(value);
//       case 'material':             return validateMaterial(value);
//       case 'unit':                 return !value ? 'Unit is required' : '';
//       case 'density':              return validateDensity(value);
//       case 'thickness':            return validateThickness(value);
//       case 'width':                return validateWidth(value);
//       case 'gst_percentage':       return validateGSTPercentage(value);
//       case 'reorder_level':        return validateReorderLevel(value);
//       case 'lead_time_days':       return validateLeadTimeDays(value);
//       case 'strip_size':           return validateStripSize(value);
//       case 'pitch':                return validatePitch(value);
//       case 'no_of_cavity':         return validateNoOfCavity(value);
//       case 'rm_rejection_percent': return validatePercentage(value, 'RM rejection percentage');
//       case 'scrap_realisation_percent': return validatePercentage(value, 'Scrap realisation percentage');
//       default:                     return '';
//     }
//   };

//   // ── Step validation ──────────────────────────────────────────────────────
//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     const addErr = (field, msg) => { if (msg) { errors[field] = msg; isValid = false; } };

//     switch (step) {
//       case 0:
//         addErr('part_no', validateField('part_no', formData.part_no));
//         addErr('part_name', validateField('part_name', formData.part_name));
//         addErr('part_description', validateField('part_description', formData.part_description));
//         addErr('item_category', validateField('item_category', formData.item_category));
//         addErr('item_type', validateField('item_type', formData.item_type));
//         if (!formData.unit) { errors.unit = 'Unit is required'; isValid = false; }
//         break;
//       case 1:
//         addErr('material', validateField('material', formData.material));
//         if (formData.density)   addErr('density',   validateField('density', formData.density));
//         if (formData.thickness) addErr('thickness', validateField('thickness', formData.thickness));
//         if (formData.width)     addErr('width',     validateField('width', formData.width));
//         if (!formData.procurement_type) { errors.procurement_type = 'Procurement type is required'; isValid = false; }
//         break;
//       case 2:
//         if (formData.strip_size)    addErr('strip_size',    validateField('strip_size', formData.strip_size));
//         if (formData.pitch)         addErr('pitch',         validateField('pitch', formData.pitch));
//         addErr('no_of_cavity', validateField('no_of_cavity', formData.no_of_cavity));
//         if (formData.gst_percentage) addErr('gst_percentage', validateField('gst_percentage', formData.gst_percentage));
//         if (formData.reorder_level)  addErr('reorder_level',  validateField('reorder_level', formData.reorder_level));
//         if (formData.lead_time_days) addErr('lead_time_days', validateField('lead_time_days', formData.lead_time_days));
//         break;
//       case 3:
//         if (formData.rm_rejection_percent)    addErr('rm_rejection_percent',    validateField('rm_rejection_percent', formData.rm_rejection_percent));
//         if (formData.scrap_realisation_percent) addErr('scrap_realisation_percent', validateField('scrap_realisation_percent', formData.scrap_realisation_percent));
//         break;
//       default:
//         return true;
//     }

//     setFieldErrors(errors);
//     if (!isValid) setError('Please fix the errors in this section');
//     return isValid;
//   };

//   const validateAllFields = () => {
//     const errors = {};
//     let isValid = true;
//     const addErr = (field, msg) => { if (msg) { errors[field] = msg; isValid = false; } };

//     // Required
//     [
//       ['part_no', 'Part number'], ['part_name', 'Part name'],
//       ['part_description', 'Part description'], ['item_category', 'Item category'],
//       ['item_type', 'Item type'], ['material', 'Material'],
//       ['unit', 'Unit'], ['procurement_type', 'Procurement type']
//     ].forEach(([f, label]) => {
//       if (!formData[f]?.toString().trim()) { errors[f] = `${label} is required`; isValid = false; }
//     });

//     // Optional with format rules
//     ['part_no', 'part_name', 'part_description', 'material',
//       'density', 'thickness', 'width', 'gst_percentage',
//       'reorder_level', 'lead_time_days', 'strip_size', 'pitch',
//       'no_of_cavity', 'rm_rejection_percent', 'scrap_realisation_percent'
//     ].forEach(f => {
//       if (formData[f]) addErr(f, validateField(f, formData[f]));
//     });

//     setFieldErrors(errors);
//     if (!isValid) setError('Please fix all validation errors');
//     return isValid;
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) { setError(''); setActiveStep(s => s + 1); }
//   };
//   const handleBack = () => { setError(''); setActiveStep(s => s - 1); };

//   const handleSubmit = async () => {
//     if (!validateAllFields()) return;
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       const submissionData = {
//         ...formData,
//         density:                  formData.density                  ? parseFloat(formData.density)                  : null,
//         thickness:                formData.thickness                ? parseFloat(formData.thickness)                : null,
//         width:                    formData.width                    ? parseFloat(formData.width)                    : null,
//         gst_percentage:           formData.gst_percentage           ? parseFloat(formData.gst_percentage)           : null,
//         reorder_level:            formData.reorder_level            ? parseInt(formData.reorder_level)              : null,
//         lead_time_days:           formData.lead_time_days           ? parseInt(formData.lead_time_days)             : null,
//         strip_size:               formData.strip_size               ? parseFloat(formData.strip_size)               : null,
//         pitch:                    formData.pitch                    ? parseFloat(formData.pitch)                    : null,
//         no_of_cavity:             formData.no_of_cavity             ? parseInt(formData.no_of_cavity)               : 1,
//         rm_rejection_percent:     formData.rm_rejection_percent     ? parseFloat(formData.rm_rejection_percent)     : null,
//         scrap_realisation_percent: formData.scrap_realisation_percent ? parseFloat(formData.scrap_realisation_percent) : null
//       };
//       const response = await axios.put(`${BASE_URL}/api/items/${item._id}`, submissionData, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (response.data.success) {
//         onUpdate(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update item');
//       }
//     } catch (err) {
//       console.error('Error updating item:', err);
//       setError(err.response?.data?.message || 'Failed to update item. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData(emptyForm);
//     setSelectedHSN(null);
//     setFieldErrors({});
//     setError('');
//     setActiveStep(0);
//   };

//   const handleClose = () => { resetForm(); onClose(); };

//   // ── Label helper ─────────────────────────────────────────────────────────
//   const Label = ({ children, required }) => (
//     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//       {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
//     </Typography>
//   );
//   const Hint = ({ children }) => (
//     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{children}</Typography>
//   );
//   const FieldErr = ({ name }) => fieldErrors[name]
//     ? <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors[name]}</Typography>
//     : null;

//   // ── Step content ─────────────────────────────────────────────────────────
//   const renderStepContent = (step) => {
//     switch (step) {

//       // ── Step 0 : Basic Info ──────────────────────────────────────────────
//       case 0:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Basic Information
//               </Typography>
//               <Grid container spacing={1.5}>

//                 {/* Part Number */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>PART NUMBER</Label>
//                     <TextField fullWidth size="small" name="part_no" value={formData.part_no}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., BR-001"
//                       error={!!fieldErrors.part_no} helperText={fieldErrors.part_no}
//                       inputProps={{ maxLength: 50 }} sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* Part Name */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>PART NAME</Label>
//                     <TextField fullWidth size="small" name="part_name" value={formData.part_name}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., Copper Busbar 100x10mm"
//                       error={!!fieldErrors.part_name} helperText={fieldErrors.part_name}
//                       inputProps={{ maxLength: 100 }} sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* Item Category */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>ITEM CATEGORY</Label>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.item_category}>
//                       <Select name="item_category" value={formData.item_category}
//                         onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
//                         <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select category</MenuItem>
//                         {itemCategoryOptions.map(o => (
//                           <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
//                         ))}
//                       </Select>
//                       <FieldErr name="item_category" />
//                     </FormControl>
//                   </Box>
//                 </Grid>

//                 {/* Item Type */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>ITEM TYPE</Label>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.item_type}>
//                       <Select name="item_type" value={formData.item_type}
//                         onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
//                         <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select type</MenuItem>
//                         {itemTypeOptions.map(o => (
//                           <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
//                         ))}
//                       </Select>
//                       <FieldErr name="item_type" />
//                     </FormControl>
//                   </Box>
//                 </Grid>

//                 {/* Unit */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>UNIT</Label>
//                     <Autocomplete
//                       fullWidth options={unitOptions} value={formData.unit || null}
//                       onChange={(_, newValue) => {
//                         setFieldErrors(prev => ({ ...prev, unit: '' }));
//                         setFormData(prev => ({ ...prev, unit: newValue || '' }));
//                       }}
//                       disabled={loading}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" placeholder="Select unit"
//                           error={!!fieldErrors.unit} helperText={fieldErrors.unit} sx={textFieldSx} />
//                       )}
//                       renderOption={(props, option) => (
//                         <li {...props}><Typography sx={{ fontSize: '0.75rem' }}>{option}</Typography></li>
//                       )}
//                       ListboxProps={{ sx: { '& .MuiAutocomplete-option': { fontSize: '0.75rem', py: 1, px: 1.5 } } }}
//                     />
//                   </Box>
//                 </Grid>

//                 {/* Part Description */}
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>PART DESCRIPTION</Label>
//                     <TextField fullWidth size="small" name="part_description" value={formData.part_description}
//                       onChange={handleChange} multiline rows={2} disabled={loading}
//                       placeholder="Enter detailed part description"
//                       error={!!fieldErrors.part_description} helperText={fieldErrors.part_description}
//                       inputProps={{ maxLength: 200 }} sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       // ── Step 1 : Drawing & Material ──────────────────────────────────────
//       case 1:
//         return (
//           <Stack spacing={2}>
//             {/* Drawing Information */}
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Drawing Information
//               </Typography>
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>DRAWING NUMBER</Label>
//                     <TextField fullWidth size="small" name="drawing_no" value={formData.drawing_no}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., DRG001" sx={textFieldSx} />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>REVISION NUMBER</Label>
//                     <TextField fullWidth size="small" name="revision_no" value={formData.revision_no}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., Rev 1.0" sx={textFieldSx} />
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Material Information */}
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Material Information
//               </Typography>
//               <Grid container spacing={1.5}>

//                 {/* Material */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>MATERIAL</Label>
//                     <TextField fullWidth size="small" name="material" value={formData.material}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., Copper"
//                       error={!!fieldErrors.material} helperText={fieldErrors.material}
//                       inputProps={{ maxLength: 100 }} sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* RM Grade */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>RM GRADE</Label>
//                     <TextField fullWidth size="small" name="rm_grade" value={formData.rm_grade}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., C11000" sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* Density */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>DENSITY (g/cm³)</Label>
//                     <TextField fullWidth size="small" name="density" value={formData.density}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 8.96"
//                       error={!!fieldErrors.density} helperText={fieldErrors.density}
//                       inputProps={{ step: '0.01', min: 0, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional</Hint>
//                   </Box>
//                 </Grid>

//                 {/* Thickness */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>THICKNESS (mm)</Label>
//                     <TextField fullWidth size="small" name="thickness" value={formData.thickness}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 10"
//                       error={!!fieldErrors.thickness} helperText={fieldErrors.thickness}
//                       inputProps={{ step: '0.01', min: 0, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional</Hint>
//                   </Box>
//                 </Grid>

//                 {/* Width */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>WIDTH (mm)</Label>
//                     <TextField fullWidth size="small" name="width" value={formData.width}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 100"
//                       error={!!fieldErrors.width} helperText={fieldErrors.width}
//                       inputProps={{ step: '0.01', min: 0, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional</Hint>
//                   </Box>
//                 </Grid>

//                 {/* Procurement Type */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label required>PROCUREMENT TYPE</Label>
//                     <FormControl fullWidth size="small" error={!!fieldErrors.procurement_type}>
//                       <Select name="procurement_type" value={formData.procurement_type}
//                         onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
//                         <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select procurement type</MenuItem>
//                         {procurementTypeOptions.map(o => (
//                           <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
//                         ))}
//                       </Select>
//                       <FieldErr name="procurement_type" />
//                     </FormControl>
//                   </Box>
//                 </Grid>

//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       // ── Step 2 : RM Details & Tax ────────────────────────────────────────
//       case 2:
//         return (
//           <Stack spacing={2}>
//             {/* Raw Material Details */}
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Raw Material Details
//               </Typography>
//               <Grid container spacing={1.5}>

//                 {/* RM Source */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>RM SOURCE</Label>
//                     <TextField fullWidth size="small" name="rm_source" value={formData.rm_source}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., New India CT" sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* RM Type — Select with backend enum */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>RM TYPE</Label>
//                     <FormControl fullWidth size="small">
//                       <Select name="rm_type" value={formData.rm_type}
//                         onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
//                         <MenuItem value="" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
//                           Select RM type
//                         </MenuItem>
//                         {rmTypeOptions.map(o => (
//                           <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>

//                 {/* RM Specification */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>RM SPECIFICATION</Label>
//                     <TextField fullWidth size="small" name="rm_spec" value={formData.rm_spec}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., Copper" sx={textFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* Strip Size */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>STRIP SIZE (mm)</Label>
//                     <TextField fullWidth size="small" name="strip_size" value={formData.strip_size}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 3660"
//                       error={!!fieldErrors.strip_size} helperText={fieldErrors.strip_size}
//                       inputProps={{ min: 0, step: '0.01', onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional</Hint>
//                   </Box>
//                 </Grid>

//                 {/* Pitch */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>PITCH (mm)</Label>
//                     <TextField fullWidth size="small" name="pitch" value={formData.pitch}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 42"
//                       error={!!fieldErrors.pitch} helperText={fieldErrors.pitch}
//                       inputProps={{ min: 0, step: '0.01', onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional</Hint>
//                   </Box>
//                 </Grid>

//                 {/* No of Cavity */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>NUMBER OF CAVITIES</Label>
//                     <TextField fullWidth size="small" name="no_of_cavity" value={formData.no_of_cavity}
//                       onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 1"
//                       error={!!fieldErrors.no_of_cavity} helperText={fieldErrors.no_of_cavity}
//                       inputProps={{ min: 1, step: 1, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                   </Box>
//                 </Grid>

//                 {/* Reorder Level */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>REORDER LEVEL</Label>
//                     <TextField fullWidth size="small" name="reorder_level" value={formData.reorder_level}
//                       onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 100"
//                       error={!!fieldErrors.reorder_level} helperText={fieldErrors.reorder_level}
//                       inputProps={{ min: 0, step: 1, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional - Minimum stock level</Hint>
//                   </Box>
//                 </Grid>

//                 {/* Lead Time */}
//                 <Grid size={{ xs: 12, md: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>LEAD TIME (Days)</Label>
//                     <TextField fullWidth size="small" name="lead_time_days" value={formData.lead_time_days}
//                       onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 7"
//                       error={!!fieldErrors.lead_time_days} helperText={fieldErrors.lead_time_days}
//                       inputProps={{ min: 0, step: 1, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional - Procurement lead time</Hint>
//                   </Box>
//                 </Grid>

//               </Grid>
//             </Paper>

//             {/* Tax Information */}
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Tax Information
//               </Typography>
//               <Grid container spacing={1.5}>

//                 {/* HSN Code with Add Button */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Label>HSN CODE</Label>
//                       <Tooltip title="Add New HSN Code">
//                         <IconButton
//                           size="small"
//                           onClick={() => setAddTaxOpen(true)}
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
//                       fullWidth options={hsnCodes} loading={loadingHsn} value={selectedHSN}
//                       onChange={handleHSNChange} getOptionLabel={(o) => o.HSNCode || ''}
//                       isOptionEqualToValue={(o, v) => o._id === v._id} disabled={loading}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small"
//                           placeholder={loadingHsn ? 'Loading...' : 'Select HSN code'}
//                           sx={textFieldSx}
//                           InputProps={{
//                             ...params.InputProps,
//                             endAdornment: (
//                               <>
//                                 {loadingHsn ? <CircularProgress color="inherit" size={16} /> : null}
//                                 {params.InputProps.endAdornment}
//                               </>
//                             ),
//                           }}
//                         />
//                       )}
//                       renderOption={(props, option) => (
//                         <li {...props}>
//                           <Box>
//                             <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{option.HSNCode}</Typography>
//                             <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
//                               {option.Description} (GST: {option.GSTPercentage}%)
//                             </Typography>
//                           </Box>
//                         </li>
//                       )}
//                       ListboxProps={{ sx: { '& .MuiAutocomplete-option': { fontSize: '0.75rem', py: 1, px: 1.5 } } }}
//                     />
//                     <Hint>Optional - Auto-populates GST percentage</Hint>
//                   </Box>
//                 </Grid>

//                 {/* GST Percentage */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>GST PERCENTAGE (%)</Label>
//                     <TextField fullWidth size="small" name="gst_percentage" value={formData.gst_percentage}
//                       onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 18"
//                       error={!!fieldErrors.gst_percentage} helperText={fieldErrors.gst_percentage}
//                       inputProps={{ min: 0, max: 100, step: 0.1, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional - Will be auto-filled if HSN selected</Hint>
//                   </Box>
//                 </Grid>

//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       // ── Step 3 : Process Parameters ──────────────────────────────────────
//       case 3:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Process Parameters
//               </Typography>
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>RM REJECTION PERCENTAGE (%)</Label>
//                     <TextField fullWidth size="small" name="rm_rejection_percent" value={formData.rm_rejection_percent}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 2"
//                       error={!!fieldErrors.rm_rejection_percent} helperText={fieldErrors.rm_rejection_percent}
//                       inputProps={{ min: 0, max: 100, step: 0.1, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional - Percentage of raw material rejection</Hint>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Label>SCRAP REALISATION PERCENTAGE (%)</Label>
//                     <TextField fullWidth size="small" name="scrap_realisation_percent" value={formData.scrap_realisation_percent}
//                       onChange={handleChange} disabled={loading} placeholder="e.g., 98"
//                       error={!!fieldErrors.scrap_realisation_percent} helperText={fieldErrors.scrap_realisation_percent}
//                       inputProps={{ min: 0, max: 100, step: 0.1, onWheel: (e) => e.target.blur() }}
//                       sx={numberFieldSx} />
//                     <Hint>Optional - Percentage of scrap that can be recovered</Hint>
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

//   // ── Dialog ───────────────────────────────────────────────────────────────
//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 5,
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//             border: `1px solid ${COLORS.border}`,
//             overflow: 'hidden',
//             maxHeight: '95vh'
//           }
//         }}
//       >
//         <DialogTitle sx={{
//           borderBottom: `1px solid ${COLORS.border}`,
//           py: 1.5, px: 2.5,mb: 2,
//           bgcolor: COLORS.background.white,
//           display: 'flex', flexDirection: 'column', gap: 1
//         }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Edit Item
//           </Typography>
//           <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mb: 0.5, mt: 0.5 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>
//                   <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </DialogTitle>

//         <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
//           {renderStepContent(activeStep)}
//           {error && (
//             <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' }, fontSize: '0.75rem', py: 0.5 }}>
//               {error}
//             </Alert>
//           )}
//         </DialogContent>

//         <DialogActions sx={{
//           px: 2.5, py: 1.5,
//           borderTop: `1px solid ${COLORS.border}`,
//           bgcolor: COLORS.background.white,
//           display: 'flex', justifyContent: 'space-between', gap: 1
//         }}>
//           <Button onClick={handleBack} disabled={activeStep === 0 || loading}
//             startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
//             sx={{
//               height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`,
//               color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
//               '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` },
//               '&:disabled': { borderColor: COLORS.border, color: COLORS.text.tertiary }
//             }}
//           >
//             Back
//           </Button>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button onClick={handleClose} disabled={loading}
//               sx={{
//                 height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`,
//                 color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
//                 '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
//               }}
//             >
//               Cancel
//             </Button>
//             {activeStep === steps.length - 1 ? (
//               <Button variant="contained" onClick={handleSubmit} disabled={loading}
//                 startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
//                 sx={{
//                   height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary,
//                   fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': { bgcolor: COLORS.primaryDark },
//                   '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
//                 }}
//               >
//                 {loading ? 'Updating...' : 'Update Item'}
//               </Button>
//             ) : (
//               <Button variant="contained" onClick={handleNext} disabled={loading}
//                 endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
//                 sx={{
//                   height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary,
//                   fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': { bgcolor: COLORS.primaryDark },
//                   '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
//                 }}
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         </DialogActions>
//       </Dialog>

//       {/* Add Tax Dialog */}
//       <AddTax
//         open={addTaxOpen}
//         onClose={() => setAddTaxOpen(false)}
//         onAdd={handleTaxAdded}
//       />
//     </>
//   );
// };

// export default EditItem;




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
  FormControl,
  Select,
  MenuItem,
  styled,
  Autocomplete,
  CircularProgress,
  Tooltip,
  IconButton,
  Collapse,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddTax from '../taxmaster/AddTax';


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

const steps = ['Basic Info', 'Drawing & Material', 'RM Details & Tax', 'Process Parameters'];

// Options — kept in sync with AddItem
const unitOptions = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];
const itemCategoryOptions = ['Raw Material', 'Semi-Finished', 'Finished Good', 'Consumable', 'Tool', 'Bought-Out', 'Subcontract'];
const itemTypeOptions = ['Busbar', 'Stamping', 'Gasket', 'Tooling', 'Copper Strip', 'Aluminium Profile', 'Rubber Sheet', 'Cork', 'Other'];
const procurementTypeOptions = ['Manufacture', 'Purchase', 'Subcontract', 'In-House'];
const rmTypeOptions = ['Strip', 'Profile', 'Sheet', 'Wire', 'Tube', 'Compound', 'Bar', 'Rod', 'Coil'];

// ─── Validation helpers ───────────────────────────────────────────────────────
const validatePartNo = (v) => {
  if (!v?.trim()) return 'Part number is required';
  if (v.length > 50) return 'Part number should not exceed 50 characters';
  return '';
};
const validatePartName = (v) => {
  if (!v?.trim()) return 'Part name is required';
  if (v.length > 100) return 'Part name should not exceed 100 characters';
  return '';
};
const validatePartDescription = (v) => {
  if (!v?.trim()) return 'Part description is required';
  if (v.length > 200) return 'Part description should not exceed 200 characters';
  return '';
};
const validateItemCategory = (v) => (!v ? 'Item category is required' : '');
const validateItemType = (v) => (!v ? 'Item type is required' : '');
const validateMaterial = (v) => {
  if (!v?.trim()) return 'Material is required';
  if (v.length > 100) return 'Material should not exceed 100 characters';
  return '';
};
const validateDensity = (v) => (v && (isNaN(v) || v <= 0) ? 'Density must be a positive number' : '');
const validateThickness = (v) => (v && (isNaN(v) || v <= 0) ? 'Thickness must be a positive number' : '');
const validateWidth = (v) => (v && (isNaN(v) || v <= 0) ? 'Width must be a positive number' : '');
const validateGSTPercentage = (v) => (v && (isNaN(v) || v < 0 || v > 100) ? 'GST percentage must be between 0 and 100' : '');
const validateReorderLevel = (v) => (v && (isNaN(v) || v < 0) ? 'Reorder level must be a positive number' : '');
const validateLeadTimeDays = (v) => (v && (isNaN(v) || v < 0) ? 'Lead time must be a positive number' : '');
const validateStripSize = (v) => (v && (isNaN(v) || v <= 0) ? 'Strip size must be a positive number' : '');
const validatePitch = (v) => (v && (isNaN(v) || v <= 0) ? 'Pitch must be a positive number' : '');
const validateNoOfCavity = (v) => (v && (isNaN(v) || v < 1) ? 'Number of cavities must be at least 1' : '');
const validatePercentage = (v, label) => (v && (isNaN(v) || v < 0 || v > 100) ? `${label} must be between 0 and 100` : '');

// ─── Empty form state ─────────────────────────────────────────────────────────
const emptyForm = {
  part_no: '',
  part_name: '',
  part_description: '',
  item_category: '',
  item_type: '',
  drawing_no: '',
  revision_no: '',
  rm_grade: '',
  density: '',
  thickness: '',
  width: '',
  unit: '',
  hsn_code: '',
  gst_percentage: '',
  procurement_type: '',
  reorder_level: '',
  lead_time_days: '',
  material: '',
  rm_source: '',
  rm_type: '',
  rm_spec: '',
  strip_size: '',
  pitch: '',
  no_of_cavity: 1,
  rm_rejection_percent: '',
  scrap_realisation_percent: ''
};

// ─── Helper: safely convert nullable number to string ────────────────────────
const numStr = (v) => (v !== undefined && v !== null ? v.toString() : '');

// ─── Component ────────────────────────────────────────────────────────────────
const EditItem = ({ open, onClose, item, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hsnCodes, setHsnCodes] = useState([]);
  const [loadingHsn, setLoadingHsn] = useState(false);
  const [selectedHSN, setSelectedHSN] = useState(null);
  
  // State for Add Tax dialog
  const [addTaxOpen, setAddTaxOpen] = useState(false);

  const showError = (message) => {
    setError(message);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // ── Shared sx shortcuts ──────────────────────────────────────────────────
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem', color: COLORS.text.primary },
    '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0, marginTop: 0.25 }
  };
  const numberFieldSx = {
    ...textFieldSx,
    '& input[type=number]': { MozAppearance: 'textfield' },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none', margin: 0
    }
  };
  const selectSx = {
    borderRadius: 1.5,
    fontSize: '0.75rem',
    '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' }
  };

  // ── Fetch HSN codes ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open) fetchHsnCodes();
  }, [open]);

  // ── Populate form when item/hsnCodes change ──────────────────────────────
  useEffect(() => {
    if (!item) return;
    setFormData({
      part_no: item.part_no || '',
      part_name: item.part_name || '',
      part_description: item.part_description || '',
      item_category: item.item_category || '',
      item_type: item.item_type || '',
      drawing_no: item.drawing_no || '',
      revision_no: item.revision_no || '',
      rm_grade: item.rm_grade || '',
      density: numStr(item.density),
      thickness: numStr(item.thickness),
      width: numStr(item.width),
      unit: item.unit || '',
      hsn_code: item.hsn_code || '',
      gst_percentage: numStr(item.gst_percentage),
      procurement_type: item.procurement_type || '',
      reorder_level: numStr(item.reorder_level),
      lead_time_days: numStr(item.lead_time_days),
      material: item.material || '',
      rm_source: item.rm_source || '',
      rm_type: item.rm_type || '',
      rm_spec: item.rm_spec || '',
      strip_size: numStr(item.strip_size),
      pitch: numStr(item.pitch),
      no_of_cavity: item.no_of_cavity || 1,
      rm_rejection_percent: numStr(item.rm_rejection_percent),
      scrap_realisation_percent: numStr(item.scrap_realisation_percent)
    });

    // Restore selected HSN
    if (item.hsn_code && hsnCodes.length > 0) {
      const hsn = hsnCodes.find(h => h.HSNCode === item.hsn_code);
      setSelectedHSN(hsn || null);
    }
  }, [item, hsnCodes]);

  const fetchHsnCodes = async () => {
    try {
      setLoadingHsn(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/taxes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const active = (response.data.data || [])
          .filter(tax => tax.IsActive === true)
          .map(tax => ({
            _id: tax._id,
            HSNCode: tax.HSNCode,
            Description: tax.Description,
            GSTPercentage: tax.GSTPercentage || 0
          }));
        setHsnCodes(active);
      }
    } catch (err) {
      console.error('Error fetching HSN codes:', err);
    } finally {
      setLoadingHsn(false);
    }
  };

  // Handle tax added from AddTax dialog
  const handleTaxAdded = (newTax) => {
    // Add the new tax to the hsnCodes list
    const newHsnCode = {
      _id: newTax._id,
      HSNCode: newTax.HSNCode,
      Description: newTax.Description,
      GSTPercentage: newTax.GSTPercentage || 0
    };
    setHsnCodes(prev => [...prev, newHsnCode]);
    
    // Auto-select the newly added HSN code
    setSelectedHSN(newHsnCode);
    setFormData(prev => ({
      ...prev,
      hsn_code: newTax.HSNCode,
      gst_percentage: newTax.GSTPercentage || ''
    }));
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));

    const numericFields = ['density', 'thickness', 'width', 'gst_percentage', 'reorder_level',
      'lead_time_days', 'strip_size', 'pitch', 'no_of_cavity',
      'rm_rejection_percent', 'scrap_realisation_percent'];

    if (numericFields.includes(name)) {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHSNChange = (event, newValue) => {
    setSelectedHSN(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        hsn_code: newValue.HSNCode,
        gst_percentage: newValue.GSTPercentage || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, hsn_code: '', gst_percentage: '' }));
    }
  };

  // ── Per-field validation ─────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'part_no':              return validatePartNo(value);
      case 'part_name':            return validatePartName(value);
      case 'part_description':     return validatePartDescription(value);
      case 'item_category':        return validateItemCategory(value);
      case 'item_type':            return validateItemType(value);
      case 'material':             return validateMaterial(value);
      case 'unit':                 return !value ? 'Unit is required' : '';
      case 'density':              return validateDensity(value);
      case 'thickness':            return validateThickness(value);
      case 'width':                return validateWidth(value);
      case 'gst_percentage':       return validateGSTPercentage(value);
      case 'reorder_level':        return validateReorderLevel(value);
      case 'lead_time_days':       return validateLeadTimeDays(value);
      case 'strip_size':           return validateStripSize(value);
      case 'pitch':                return validatePitch(value);
      case 'no_of_cavity':         return validateNoOfCavity(value);
      case 'rm_rejection_percent': return validatePercentage(value, 'RM rejection percentage');
      case 'scrap_realisation_percent': return validatePercentage(value, 'Scrap realisation percentage');
      default:                     return '';
    }
  };

  // ── Step validation ──────────────────────────────────────────────────────
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    const addErr = (field, msg) => { 
      if (msg) { 
        errors[field] = msg; 
        errorMessages.push(msg);
        isValid = false; 
      } 
    };

    switch (step) {
      case 0:
        addErr('part_no', validateField('part_no', formData.part_no));
        addErr('part_name', validateField('part_name', formData.part_name));
        addErr('part_description', validateField('part_description', formData.part_description));
        addErr('item_category', validateField('item_category', formData.item_category));
        addErr('item_type', validateField('item_type', formData.item_type));
        if (!formData.unit) { 
          errors.unit = 'Unit is required'; 
          errorMessages.push('Unit is required');
          isValid = false; 
        }
        break;
      case 1:
        addErr('material', validateField('material', formData.material));
        if (formData.density)   addErr('density',   validateField('density', formData.density));
        if (formData.thickness) addErr('thickness', validateField('thickness', formData.thickness));
        if (formData.width)     addErr('width',     validateField('width', formData.width));
        if (!formData.procurement_type) { 
          errors.procurement_type = 'Procurement type is required'; 
          errorMessages.push('Procurement type is required');
          isValid = false; 
        }
        break;
      case 2:
        if (formData.strip_size)    addErr('strip_size',    validateField('strip_size', formData.strip_size));
        if (formData.pitch)         addErr('pitch',         validateField('pitch', formData.pitch));
        addErr('no_of_cavity', validateField('no_of_cavity', formData.no_of_cavity));
        if (formData.gst_percentage) addErr('gst_percentage', validateField('gst_percentage', formData.gst_percentage));
        if (formData.reorder_level)  addErr('reorder_level',  validateField('reorder_level', formData.reorder_level));
        if (formData.lead_time_days) addErr('lead_time_days', validateField('lead_time_days', formData.lead_time_days));
        break;
      case 3:
        if (formData.rm_rejection_percent)    addErr('rm_rejection_percent',    validateField('rm_rejection_percent', formData.rm_rejection_percent));
        if (formData.scrap_realisation_percent) addErr('scrap_realisation_percent', validateField('scrap_realisation_percent', formData.scrap_realisation_percent));
        break;
      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      showError(errorMessages[0]);
    }
    return isValid;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];
    const addErr = (field, msg) => { 
      if (msg) { 
        errors[field] = msg; 
        errorMessages.push(msg);
        isValid = false; 
      } 
    };

    // Required
    [
      ['part_no', 'Part number'], ['part_name', 'Part name'],
      ['part_description', 'Part description'], ['item_category', 'Item category'],
      ['item_type', 'Item type'], ['material', 'Material'],
      ['unit', 'Unit'], ['procurement_type', 'Procurement type']
    ].forEach(([f, label]) => {
      if (!formData[f]?.toString().trim()) { 
        errors[f] = `${label} is required`; 
        errorMessages.push(`${label} is required`);
        isValid = false; 
      }
    });

    // Optional with format rules
    ['part_no', 'part_name', 'part_description', 'material',
      'density', 'thickness', 'width', 'gst_percentage',
      'reorder_level', 'lead_time_days', 'strip_size', 'pitch',
      'no_of_cavity', 'rm_rejection_percent', 'scrap_realisation_percent'
    ].forEach(f => {
      if (formData[f]) addErr(f, validateField(f, formData[f]));
    });

    setFieldErrors(errors);
    if (!isValid) {
      showError(errorMessages[0]);
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) { 
      setActiveStep(s => s + 1); 
    }
  };
  const handleBack = () => { 
    setActiveStep(s => s - 1); 
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submissionData = {
        ...formData,
        density:                  formData.density                  ? parseFloat(formData.density)                  : null,
        thickness:                formData.thickness                ? parseFloat(formData.thickness)                : null,
        width:                    formData.width                    ? parseFloat(formData.width)                    : null,
        gst_percentage:           formData.gst_percentage           ? parseFloat(formData.gst_percentage)           : null,
        reorder_level:            formData.reorder_level            ? parseInt(formData.reorder_level)              : null,
        lead_time_days:           formData.lead_time_days           ? parseInt(formData.lead_time_days)             : null,
        strip_size:               formData.strip_size               ? parseFloat(formData.strip_size)               : null,
        pitch:                    formData.pitch                    ? parseFloat(formData.pitch)                    : null,
        no_of_cavity:             formData.no_of_cavity             ? parseInt(formData.no_of_cavity)               : 1,
        rm_rejection_percent:     formData.rm_rejection_percent     ? parseFloat(formData.rm_rejection_percent)     : null,
        scrap_realisation_percent: formData.scrap_realisation_percent ? parseFloat(formData.scrap_realisation_percent) : null
      };
      const response = await axios.put(`${BASE_URL}/api/items/${item._id}`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        onUpdate(response.data.data);
        resetForm();
        onClose();
      } else {
        showError(response.data.message || 'Failed to update item');
      }
    } catch (err) {
      console.error('Error updating item:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update item. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedHSN(null);
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => { resetForm(); onClose(); };

  // ── Label helper ─────────────────────────────────────────────────────────
  const Label = ({ children, required }) => (
    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
      {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </Typography>
  );
  const Hint = ({ children }) => (
    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{children}</Typography>
  );
  const FieldErr = ({ name }) => fieldErrors[name]
    ? <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>{fieldErrors[name]}</Typography>
    : null;

  // ── Step content ─────────────────────────────────────────────────────────
  const renderStepContent = (step) => {
    switch (step) {

      // ── Step 0 : Basic Info ──────────────────────────────────────────────
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              <Grid container spacing={1.5}>

                {/* Part Number */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>PART NUMBER</Label>
                    <TextField fullWidth size="small" name="part_no" value={formData.part_no}
                      onChange={handleChange} disabled={loading} placeholder="e.g., BR-001"
                      error={!!fieldErrors.part_no} helperText={fieldErrors.part_no}
                      inputProps={{ maxLength: 50 }} sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* Part Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>PART NAME</Label>
                    <TextField fullWidth size="small" name="part_name" value={formData.part_name}
                      onChange={handleChange} disabled={loading} placeholder="e.g., Copper Busbar 100x10mm"
                      error={!!fieldErrors.part_name} helperText={fieldErrors.part_name}
                      inputProps={{ maxLength: 100 }} sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* Item Category */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>ITEM CATEGORY</Label>
                    <FormControl fullWidth size="small" error={!!fieldErrors.item_category}>
                      <Select name="item_category" value={formData.item_category}
                        onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select category</MenuItem>
                        {itemCategoryOptions.map(o => (
                          <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
                        ))}
                      </Select>
                      <FieldErr name="item_category" />
                    </FormControl>
                  </Box>
                </Grid>

                {/* Item Type */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>ITEM TYPE</Label>
                    <FormControl fullWidth size="small" error={!!fieldErrors.item_type}>
                      <Select name="item_type" value={formData.item_type}
                        onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select type</MenuItem>
                        {itemTypeOptions.map(o => (
                          <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
                        ))}
                      </Select>
                      <FieldErr name="item_type" />
                    </FormControl>
                  </Box>
                </Grid>

                {/* Unit */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>UNIT</Label>
                    <Autocomplete
                      fullWidth options={unitOptions} value={formData.unit || null}
                      onChange={(_, newValue) => {
                        setFieldErrors(prev => ({ ...prev, unit: '' }));
                        setFormData(prev => ({ ...prev, unit: newValue || '' }));
                      }}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField {...params} size="small" placeholder="Select unit"
                          error={!!fieldErrors.unit} helperText={fieldErrors.unit} sx={textFieldSx} />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}><Typography sx={{ fontSize: '0.75rem' }}>{option}</Typography></li>
                      )}
                      ListboxProps={{ sx: { '& .MuiAutocomplete-option': { fontSize: '0.75rem', py: 1, px: 1.5 } } }}
                    />
                  </Box>
                </Grid>

                {/* Part Description */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>PART DESCRIPTION</Label>
                    <TextField fullWidth size="small" name="part_description" value={formData.part_description}
                      onChange={handleChange} multiline rows={2} disabled={loading}
                      placeholder="Enter detailed part description"
                      error={!!fieldErrors.part_description} helperText={fieldErrors.part_description}
                      inputProps={{ maxLength: 200 }} sx={textFieldSx} />
                  </Box>
                </Grid>

              </Grid>
            </Paper>
          </Stack>
        );

      // ── Step 1 : Drawing & Material ──────────────────────────────────────
      case 1:
        return (
          <Stack spacing={2}>
            {/* Drawing Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Drawing Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>DRAWING NUMBER</Label>
                    <TextField fullWidth size="small" name="drawing_no" value={formData.drawing_no}
                      onChange={handleChange} disabled={loading} placeholder="e.g., DRG001" sx={textFieldSx} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>REVISION NUMBER</Label>
                    <TextField fullWidth size="small" name="revision_no" value={formData.revision_no}
                      onChange={handleChange} disabled={loading} placeholder="e.g., Rev 1.0" sx={textFieldSx} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Material Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Material Information
              </Typography>
              <Grid container spacing={1.5}>

                {/* Material */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>MATERIAL</Label>
                    <TextField fullWidth size="small" name="material" value={formData.material}
                      onChange={handleChange} disabled={loading} placeholder="e.g., Copper"
                      error={!!fieldErrors.material} helperText={fieldErrors.material}
                      inputProps={{ maxLength: 100 }} sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* RM Grade */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>RM GRADE</Label>
                    <TextField fullWidth size="small" name="rm_grade" value={formData.rm_grade}
                      onChange={handleChange} disabled={loading} placeholder="e.g., C11000" sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* Density */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>DENSITY (g/cm³)</Label>
                    <TextField fullWidth size="small" name="density" value={formData.density}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 8.96"
                      error={!!fieldErrors.density} helperText={fieldErrors.density}
                      inputProps={{ step: '0.01', min: 0, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional</Hint>
                  </Box>
                </Grid>

                {/* Thickness */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>THICKNESS (mm)</Label>
                    <TextField fullWidth size="small" name="thickness" value={formData.thickness}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 10"
                      error={!!fieldErrors.thickness} helperText={fieldErrors.thickness}
                      inputProps={{ step: '0.01', min: 0, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional</Hint>
                  </Box>
                </Grid>

                {/* Width */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>WIDTH (mm)</Label>
                    <TextField fullWidth size="small" name="width" value={formData.width}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 100"
                      error={!!fieldErrors.width} helperText={fieldErrors.width}
                      inputProps={{ step: '0.01', min: 0, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional</Hint>
                  </Box>
                </Grid>

                {/* Procurement Type */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>PROCUREMENT TYPE</Label>
                    <FormControl fullWidth size="small" error={!!fieldErrors.procurement_type}>
                      <Select name="procurement_type" value={formData.procurement_type}
                        onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select procurement type</MenuItem>
                        {procurementTypeOptions.map(o => (
                          <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
                        ))}
                      </Select>
                      <FieldErr name="procurement_type" />
                    </FormControl>
                  </Box>
                </Grid>

              </Grid>
            </Paper>
          </Stack>
        );

      // ── Step 2 : RM Details & Tax ────────────────────────────────────────
      case 2:
        return (
          <Stack spacing={2}>
            {/* Raw Material Details */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Raw Material Details
              </Typography>
              <Grid container spacing={1.5}>

                {/* RM Source */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>RM SOURCE</Label>
                    <TextField fullWidth size="small" name="rm_source" value={formData.rm_source}
                      onChange={handleChange} disabled={loading} placeholder="e.g., New India CT" sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* RM Type — Select with backend enum */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>RM TYPE</Label>
                    <FormControl fullWidth size="small">
                      <Select name="rm_type" value={formData.rm_type}
                        onChange={handleSelectChange} disabled={loading} displayEmpty sx={selectSx}>
                        <MenuItem value="" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          Select RM type
                        </MenuItem>
                        {rmTypeOptions.map(o => (
                          <MenuItem key={o} value={o} sx={{ fontSize: '0.75rem' }}>{o}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {/* RM Specification */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>RM SPECIFICATION</Label>
                    <TextField fullWidth size="small" name="rm_spec" value={formData.rm_spec}
                      onChange={handleChange} disabled={loading} placeholder="e.g., Copper" sx={textFieldSx} />
                  </Box>
                </Grid>

                {/* Strip Size */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>STRIP SIZE (mm)</Label>
                    <TextField fullWidth size="small" name="strip_size" value={formData.strip_size}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 3660"
                      error={!!fieldErrors.strip_size} helperText={fieldErrors.strip_size}
                      inputProps={{ min: 0, step: '0.01', onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional</Hint>
                  </Box>
                </Grid>

                {/* Pitch */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>PITCH (mm)</Label>
                    <TextField fullWidth size="small" name="pitch" value={formData.pitch}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 42"
                      error={!!fieldErrors.pitch} helperText={fieldErrors.pitch}
                      inputProps={{ min: 0, step: '0.01', onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional</Hint>
                  </Box>
                </Grid>

                {/* No of Cavity */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>NUMBER OF CAVITIES</Label>
                    <TextField fullWidth size="small" name="no_of_cavity" value={formData.no_of_cavity}
                      onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 1"
                      error={!!fieldErrors.no_of_cavity} helperText={fieldErrors.no_of_cavity}
                      inputProps={{ min: 1, step: 1, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                  </Box>
                </Grid>

                {/* Reorder Level */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>REORDER LEVEL</Label>
                    <TextField fullWidth size="small" name="reorder_level" value={formData.reorder_level}
                      onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 100"
                      error={!!fieldErrors.reorder_level} helperText={fieldErrors.reorder_level}
                      inputProps={{ min: 0, step: 1, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional - Minimum stock level</Hint>
                  </Box>
                </Grid>

                {/* Lead Time */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>LEAD TIME (Days)</Label>
                    <TextField fullWidth size="small" name="lead_time_days" value={formData.lead_time_days}
                      onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 7"
                      error={!!fieldErrors.lead_time_days} helperText={fieldErrors.lead_time_days}
                      inputProps={{ min: 0, step: 1, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional - Procurement lead time</Hint>
                  </Box>
                </Grid>

              </Grid>
            </Paper>

            {/* Tax Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Tax Information
              </Typography>
              <Grid container spacing={1.5}>

                {/* HSN Code with Add Button */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Label>HSN CODE</Label>
                      <Tooltip title="Add New HSN Code">
                        <IconButton
                          size="small"
                          onClick={() => setAddTaxOpen(true)}
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
                      fullWidth options={hsnCodes} loading={loadingHsn} value={selectedHSN}
                      onChange={handleHSNChange} getOptionLabel={(o) => o.HSNCode || ''}
                      isOptionEqualToValue={(o, v) => o._id === v._id} disabled={loading}
                      renderInput={(params) => (
                        <TextField {...params} size="small"
                          placeholder={loadingHsn ? 'Loading...' : 'Select HSN code'}
                          sx={textFieldSx}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingHsn ? <CircularProgress color="inherit" size={16} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{option.HSNCode}</Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                              {option.Description} (GST: {option.GSTPercentage}%)
                            </Typography>
                          </Box>
                        </li>
                      )}
                      ListboxProps={{ sx: { '& .MuiAutocomplete-option': { fontSize: '0.75rem', py: 1, px: 1.5 } } }}
                    />
                    <Hint>Optional - Auto-populates GST percentage</Hint>
                  </Box>
                </Grid>

                {/* GST Percentage */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>GST PERCENTAGE (%)</Label>
                    <TextField fullWidth size="small" name="gst_percentage" value={formData.gst_percentage}
                      onChange={handleChange} disabled={loading} type="number" placeholder="e.g., 18"
                      error={!!fieldErrors.gst_percentage} helperText={fieldErrors.gst_percentage}
                      inputProps={{ min: 0, max: 100, step: 0.1, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional - Will be auto-filled if HSN selected</Hint>
                  </Box>
                </Grid>

              </Grid>
            </Paper>
          </Stack>
        );

      // ── Step 3 : Process Parameters ──────────────────────────────────────
      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Process Parameters
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>RM REJECTION PERCENTAGE (%)</Label>
                    <TextField fullWidth size="small" name="rm_rejection_percent" value={formData.rm_rejection_percent}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 2"
                      error={!!fieldErrors.rm_rejection_percent} helperText={fieldErrors.rm_rejection_percent}
                      inputProps={{ min: 0, max: 100, step: 0.1, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional - Percentage of raw material rejection</Hint>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>SCRAP REALISATION PERCENTAGE (%)</Label>
                    <TextField fullWidth size="small" name="scrap_realisation_percent" value={formData.scrap_realisation_percent}
                      onChange={handleChange} disabled={loading} placeholder="e.g., 98"
                      error={!!fieldErrors.scrap_realisation_percent} helperText={fieldErrors.scrap_realisation_percent}
                      inputProps={{ min: 0, max: 100, step: 0.1, onWheel: (e) => e.target.blur() }}
                      sx={numberFieldSx} />
                    <Hint>Optional - Percentage of scrap that can be recovered</Hint>
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

  // ── Dialog ───────────────────────────────────────────────────────────────
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
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
          py: 1.5, px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex', flexDirection: 'column', gap: 1
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Item
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mb: 0.5, mt: 0.5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>

        {/* Floating Error Alert - Positioned below stepper */}
        <Box sx={{ px: 2.5, pt: 1 }}>
          <FloatingErrorAlert error={error} onClose={() => setError('')} />
        </Box>

        <DialogContent sx={{ p: 2.5, pt: error ? 1 : 2, overflow: 'auto' }}>
          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{
          px: 2.5, py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          display: 'flex', justifyContent: 'space-between', gap: 1
        }}>
          <Button onClick={handleBack} disabled={activeStep === 0 || loading}
            startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
              '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` },
              '&:disabled': { borderColor: COLORS.border, color: COLORS.text.tertiary }
            }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose} disabled={loading}
              sx={{
                height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`,
                color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
                '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
              }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} disabled={loading}
                startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary,
                  fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': { bgcolor: COLORS.primaryDark },
                  '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
                }}
              >
                {loading ? 'Updating...' : 'Update Item'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={loading}
                endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary,
                  fontSize: '0.7rem', fontWeight: 500, textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': { bgcolor: COLORS.primaryDark },
                  '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Add Tax Dialog */}
      <AddTax
        open={addTaxOpen}
        onClose={() => setAddTaxOpen(false)}
        onAdd={handleTaxAdded}
      />
    </>
  );
};

export default EditItem;