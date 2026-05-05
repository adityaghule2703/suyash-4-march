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
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Autocomplete,
//   CircularProgress,
//   Tooltip,
//   IconButton
// } from '@mui/material';
// import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddItem from '../itemmaster/AddItem';


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

// const EditDimensions = ({ open, onClose, dimension, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     PartNo: '',
//     Thickness: '',
//     Width: '',
//     Length: '',
//     Density: ''
//   });
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchingItems, setFetchingItems] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedPart, setSelectedPart] = useState(null);
  
//   // State for Add Item dialog
//   const [addItemOpen, setAddItemOpen] = useState(false);

//   // Fetch items for Part No dropdown
//   useEffect(() => {
//     const fetchItems = async () => {
//       if (!open) return;
      
//       setFetchingItems(true);
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/items`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.data.success) {
//           setItems(response.data.data || []);
//         }
//       } catch (err) {
//         console.error('Error fetching items:', err);
//         setError('Failed to load items. Please try again.');
//       } finally {
//         setFetchingItems(false);
//       }
//     };

//     fetchItems();
//   }, [open]);

//   // Set form data when dimension prop changes
//   useEffect(() => {
//     if (dimension) {
//       setFormData({
//         PartNo: dimension.PartNo || '',
//         Thickness: dimension.Thickness || '',
//         Width: dimension.Width || '',
//         Length: dimension.Length || '',
//         Density: dimension.Density || '',
//       });

//       // Set selected part
//       const part = items.find(item => item.part_no === dimension.PartNo);
//       if (part) {
//         setSelectedPart(part);
//       }
//     }
//   }, [dimension, items]);

//   // Handle item added from AddItem dialog
//   const handleItemAdded = (newItem) => {
//     // Add the new item to the items list
//     setItems(prev => [...prev, newItem]);
    
//     // Auto-select the newly added item
//     setSelectedPart(newItem);
//     setFormData(prev => ({
//       ...prev,
//       PartNo: newItem.part_no,
//       Density: newItem.density ? newItem.density.toString() : prev.Density
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePartChange = (event, newValue) => {
//     setSelectedPart(newValue);
    
//     if (newValue) {
//       setFormData(prev => ({
//         ...prev,
//         PartNo: newValue.part_no
//       }));
      
//       // Auto-fill density from the item's material if density is empty
//       if (newValue.density && !formData.Density) {
//         setFormData(prev => ({
//           ...prev,
//           Density: newValue.density.toString() || ''
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         PartNo: ''
//       }));
//     }
//   };

//   const calculateWeight = () => {
//     const { Thickness, Width, Length, Density } = formData;
//     if (Thickness && Width && Length && Density) {
//       const thicknessMm = parseFloat(Thickness) / 1000;
//       const widthMm = parseFloat(Width) / 1000;
//       const lengthMm = parseFloat(Length) / 1000;
//       const density = parseFloat(Density);
      
//       const volume = thicknessMm * widthMm * lengthMm;
//       const weight = volume * density * 1000;
//       return weight.toFixed(6);
//     }
//     return 0;
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!formData.PartNo) {
//       setError('Part No is required');
//       return;
//     }
//     if (!formData.Thickness || parseFloat(formData.Thickness) <= 0) {
//       setError('Thickness must be greater than 0');
//       return;
//     }
//     if (!formData.Width || parseFloat(formData.Width) <= 0) {
//       setError('Width must be greater than 0');
//       return;
//     }
//     if (!formData.Length || parseFloat(formData.Length) <= 0) {
//       setError('Length must be greater than 0');
//       return;
//     }
//     if (!formData.Density || parseFloat(formData.Density) <= 0) {
//       setError('Density must be greater than 0');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(`${BASE_URL}/api/dimension-weights/${dimension._id}`, {
//         PartNo: formData.PartNo,
//         Thickness: parseFloat(formData.Thickness),
//         Width: parseFloat(formData.Width),
//         Length: parseFloat(formData.Length),
//         Density: parseFloat(formData.Density)
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onUpdate(response.data.data);
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update dimension');
//       }
//     } catch (err) {
//       console.error('Error updating dimension:', err);
//       setError(err.response?.data?.message || 'Failed to update dimension. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const weight = calculateWeight();

//   // Label component for consistency
//   const Label = ({ children, required }) => (
//     <Typography sx={{ 
//       fontSize: '0.7rem', 
//       fontWeight: 600, 
//       color: COLORS.text.secondary, 
//       letterSpacing: '0.5px' 
//     }}>
//       {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
//     </Typography>
//   );

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         maxWidth="md"
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
//           mb: 2,
//           bgcolor: COLORS.background.white,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography
//             sx={{
//               fontSize: '1.2rem',
//               fontWeight: 700,
//               color: COLORS.text.primary
//             }}
//           >
//             Edit Dimension Weight
//           </Typography>
//         </DialogTitle>

//         <DialogContent sx={{ p: 2.5 }}>
//           <Stack spacing={2}>
//             <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
//               {/* Part No Field with Add Button */}
//               <Box sx={{ gridColumn: 'span 2' }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Label required>PART NO</Label>
//                     <Tooltip title="Add New Item">
//                       <IconButton
//                         size="small"
//                         onClick={() => setAddItemOpen(true)}
//                         sx={{
//                           color: COLORS.primary,
//                           p: 0.25,
//                           '&:hover': { bgcolor: COLORS.primaryLight }
//                         }}
//                       >
//                         <AddIcon sx={{ fontSize: '0.8rem' }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
                  
//                   <Autocomplete
//                     fullWidth
//                     options={items}
//                     loading={fetchingItems}
//                     value={selectedPart}
//                     onChange={handlePartChange}
//                     getOptionLabel={(option) => option.part_no || ''}
//                     isOptionEqualToValue={(option, value) => option._id === value._id}
//                     disabled={loading}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         placeholder="Select a part number"
//                         required
//                         error={!!error && error.includes('Part No')}
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
//                             color: COLORS.text.primary,
//                             '&::placeholder': {
//                               color: COLORS.text.tertiary,
//                               fontSize: '0.75rem'
//                             }
//                           }
//                         }}
//                         InputProps={{
//                           ...params.InputProps,
//                           endAdornment: (
//                             <>
//                               {fetchingItems ? <CircularProgress color="inherit" size={16} /> : null}
//                               {params.InputProps.endAdornment}
//                             </>
//                           ),
//                         }}
//                       />
//                     )}
//                     renderOption={(props, option) => (
//                       <li {...props}>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
//                             {option.part_no}
//                           </Typography>
//                           {option.part_description && (
//                             <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
//                               {option.part_description}
//                             </Typography>
//                           )}
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

//                   {fetchingItems && !selectedPart && (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
//                       <CircularProgress size={12} sx={{ color: COLORS.primary }} />
//                       <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                         Loading parts...
//                       </Typography>
//                     </Box>
//                   )}
//                   {!fetchingItems && items.length === 0 && (
//                     <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
//                       No parts available. Please click the + button to add an item first.
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>

//               {/* Thickness Field */}
//               <Box sx={{ gridColumn: 'span 1' }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Label required>THICKNESS (mm)</Label>
//                   <TextField
//                     fullWidth
//                     name="Thickness"
//                     type="number"
//                     value={formData.Thickness}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                     placeholder="Enter thickness"
//                     size="small"
//                     variant="outlined"
//                     InputProps={{
//                       endAdornment: (
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
//                           mm
//                         </Typography>
//                       ),
//                       inputProps: { min: 0, step: 0.01 }
//                     }}
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
//                         fontSize: '0.75rem',
//                         color: COLORS.text.primary,
//                         '&::placeholder': {
//                           color: COLORS.text.tertiary,
//                           fontSize: '0.75rem'
//                         }
//                       },
//                       '& input[type=number]': {
//                         MozAppearance: 'textfield'
//                       },
//                       '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//                         WebkitAppearance: 'none', margin: 0
//                       }
//                     }}
//                   />
//                 </Box>
//               </Box>

//               {/* Width Field */}
//               <Box sx={{ gridColumn: 'span 1' }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Label required>WIDTH (mm)</Label>
//                   <TextField
//                     fullWidth
//                     name="Width"
//                     type="number"
//                     value={formData.Width}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                     placeholder="Enter width"
//                     size="small"
//                     variant="outlined"
//                     InputProps={{
//                       endAdornment: (
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
//                           mm
//                         </Typography>
//                       ),
//                       inputProps: { min: 0, step: 0.01 }
//                     }}
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
//                         fontSize: '0.75rem',
//                         color: COLORS.text.primary,
//                         '&::placeholder': {
//                           color: COLORS.text.tertiary,
//                           fontSize: '0.75rem'
//                         }
//                       },
//                       '& input[type=number]': {
//                         MozAppearance: 'textfield'
//                       },
//                       '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//                         WebkitAppearance: 'none', margin: 0
//                       }
//                     }}
//                   />
//                 </Box>
//               </Box>

//               {/* Length Field */}
//               <Box sx={{ gridColumn: 'span 1' }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Label required>LENGTH (mm)</Label>
//                   <TextField
//                     fullWidth
//                     name="Length"
//                     type="number"
//                     value={formData.Length}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                     placeholder="Enter length"
//                     size="small"
//                     variant="outlined"
//                     InputProps={{
//                       endAdornment: (
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
//                           mm
//                         </Typography>
//                       ),
//                       inputProps: { min: 0, step: 0.01 }
//                     }}
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
//                         fontSize: '0.75rem',
//                         color: COLORS.text.primary,
//                         '&::placeholder': {
//                           color: COLORS.text.tertiary,
//                           fontSize: '0.75rem'
//                         }
//                       },
//                       '& input[type=number]': {
//                         MozAppearance: 'textfield'
//                       },
//                       '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//                         WebkitAppearance: 'none', margin: 0
//                       }
//                     }}
//                   />
//                 </Box>
//               </Box>

//               {/* Density Field */}
//               <Box sx={{ gridColumn: 'span 1' }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Label required>DENSITY (g/cm³)</Label>
//                   <TextField
//                     fullWidth
//                     name="Density"
//                     type="number"
//                     value={formData.Density}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                     placeholder="Enter density"
//                     size="small"
//                     variant="outlined"
//                     InputProps={{
//                       endAdornment: (
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
//                           g/cm³
//                         </Typography>
//                       ),
//                       inputProps: { min: 0, step: 0.01 }
//                     }}
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
//                         fontSize: '0.75rem',
//                         color: COLORS.text.primary,
//                         '&::placeholder': {
//                           color: COLORS.text.tertiary,
//                           fontSize: '0.75rem'
//                         }
//                       },
//                       '& input[type=number]': {
//                         MozAppearance: 'textfield'
//                       },
//                       '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//                         WebkitAppearance: 'none', margin: 0
//                       }
//                     }}
//                   />
//                 </Box>
//               </Box>

//               {/* Weight Preview */}
//               {weight > 0 && (
//                 <Box sx={{ 
//                   gridColumn: 'span 2',
//                   p: 2, 
//                   bgcolor: COLORS.primaryLight, 
//                   borderRadius: 1.5,
//                   border: `1px solid ${COLORS.primary}`,
//                   mt: 1
//                 }}>
//                   <Typography 
//                     variant="subtitle2" 
//                     sx={{ 
//                       fontWeight: 600, 
//                       color: COLORS.primaryDark, 
//                       mb: 1.5,
//                       fontSize: '0.8rem'
//                     }}
//                   >
//                     Weight Calculation Preview
//                   </Typography>
//                   <Stack spacing={1}>
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Weight:</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                         {dimension?.WeightInKG || 0} kg
//                       </Typography>
//                     </Stack>
                    
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>New Calculated Weight:</Typography>
//                       <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primaryDark }}>
//                         {weight} kg
//                       </Typography>
//                     </Stack>
//                   </Stack>
//                 </Box>
//               )}
//             </Box>
            
//             {error && (
//               <Alert 
//                 severity="error" 
//                 sx={{ 
//                   borderRadius: 1.5,
//                   mt: 1,
//                   '& .MuiAlert-icon': {
//                     fontSize: '1.25rem',
//                     alignItems: 'center'
//                   },
//                   fontSize: '0.75rem',
//                   py: 0.5
//                 }}
//               >
//                 {error}
//               </Alert>
//             )}
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{
//           px: 2.5,
//           py: 1.5,
//           borderTop: `1px solid ${COLORS.border}`,
//           bgcolor: COLORS.background.white,
//           display: 'flex',
//           justifyContent: 'flex-end',
//           gap: 1
//         }}>
//           <Button
//             onClick={onClose}
//             disabled={loading}
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
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading || fetchingItems || !formData.PartNo || !formData.Thickness || !formData.Width || !formData.Length || !formData.Density}
//             startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
//             sx={{
//               height: 32,
//               px: 2,
//               borderRadius: 1.5,
//               bgcolor: COLORS.primary,
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               textTransform: 'none',
//               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//               '&:hover': {
//                 bgcolor: COLORS.primaryDark,
//               },
//               '&:disabled': {
//                 bgcolor: COLORS.border,
//                 color: COLORS.text.tertiary
//               }
//             }}
//           >
//             {loading ? 'Updating...' : 'Update Dimension'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Item Dialog */}
//       <AddItem
//         open={addItemOpen}
//         onClose={() => setAddItemOpen(false)}
//         onAdd={handleItemAdded}
//       />
//     </>
//   );
// };

// export default EditDimensions;




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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  CircularProgress,
  Tooltip,
  IconButton,
  Collapse,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Error as ErrorIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddItem from '../itemmaster/AddItem';

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

const EditDimensions = ({ open, onClose, dimension, onUpdate }) => {
  const [formData, setFormData] = useState({
    PartNo: '',
    Thickness: '',
    Width: '',
    Length: '',
    Density: ''
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedPart, setSelectedPart] = useState(null);
  
  // State for Add Item dialog
  const [addItemOpen, setAddItemOpen] = useState(false);

  const showError = (message) => {
    setError(message);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Fetch items for Part No dropdown
  useEffect(() => {
    const fetchItems = async () => {
      if (!open) return;
      
      setFetchingItems(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/items`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setItems(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        showError('Failed to load items. Please try again.');
      } finally {
        setFetchingItems(false);
      }
    };

    fetchItems();
  }, [open]);

  // Set form data when dimension prop changes
  useEffect(() => {
    if (dimension) {
      setFormData({
        PartNo: dimension.PartNo || '',
        Thickness: dimension.Thickness || '',
        Width: dimension.Width || '',
        Length: dimension.Length || '',
        Density: dimension.Density || '',
      });

      // Set selected part
      const part = items.find(item => item.part_no === dimension.PartNo);
      if (part) {
        setSelectedPart(part);
      }
    }
  }, [dimension, items]);

  // Handle item added from AddItem dialog
  const handleItemAdded = (newItem) => {
    // Add the new item to the items list
    setItems(prev => [...prev, newItem]);
    
    // Auto-select the newly added item
    setSelectedPart(newItem);
    setFormData(prev => ({
      ...prev,
      PartNo: newItem.part_no,
      Density: newItem.density ? newItem.density.toString() : prev.Density
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartChange = (event, newValue) => {
    setSelectedPart(newValue);
    setFieldErrors(prev => ({ ...prev, PartNo: '' }));
    
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        PartNo: newValue.part_no
      }));
      
      // Auto-fill density from the item's material if density is empty
      if (newValue.density && !formData.Density) {
        setFormData(prev => ({
          ...prev,
          Density: newValue.density.toString() || ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        PartNo: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    // Part No validation
    if (!formData.PartNo) {
      errors.PartNo = 'Part No is required';
      errorMessages.push('Part No is required');
      isValid = false;
    }

    // Thickness validation
    if (!formData.Thickness) {
      errors.Thickness = 'Thickness is required';
      errorMessages.push('Thickness is required');
      isValid = false;
    } else if (parseFloat(formData.Thickness) <= 0) {
      errors.Thickness = 'Thickness must be greater than 0';
      errorMessages.push('Thickness must be greater than 0');
      isValid = false;
    }

    // Width validation
    if (!formData.Width) {
      errors.Width = 'Width is required';
      errorMessages.push('Width is required');
      isValid = false;
    } else if (parseFloat(formData.Width) <= 0) {
      errors.Width = 'Width must be greater than 0';
      errorMessages.push('Width must be greater than 0');
      isValid = false;
    }

    // Length validation
    if (!formData.Length) {
      errors.Length = 'Length is required';
      errorMessages.push('Length is required');
      isValid = false;
    } else if (parseFloat(formData.Length) <= 0) {
      errors.Length = 'Length must be greater than 0';
      errorMessages.push('Length must be greater than 0');
      isValid = false;
    }

    // Density validation
    if (!formData.Density) {
      errors.Density = 'Density is required';
      errorMessages.push('Density is required');
      isValid = false;
    } else if (parseFloat(formData.Density) <= 0) {
      errors.Density = 'Density must be greater than 0';
      errorMessages.push('Density must be greater than 0');
      isValid = false;
    }

    setFieldErrors(errors);
    
    if (!isValid) {
      showError(errorMessages[0]);
    }
    
    return isValid;
  };

  const calculateWeight = () => {
    const { Thickness, Width, Length, Density } = formData;
    if (Thickness && Width && Length && Density) {
      const thicknessMm = parseFloat(Thickness) / 1000;
      const widthMm = parseFloat(Width) / 1000;
      const lengthMm = parseFloat(Length) / 1000;
      const density = parseFloat(Density);
      
      const volume = thicknessMm * widthMm * lengthMm;
      const weight = volume * density * 1000;
      return weight.toFixed(6);
    }
    return 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/dimension-weights/${dimension._id}`, {
        PartNo: formData.PartNo,
        Thickness: parseFloat(formData.Thickness),
        Width: parseFloat(formData.Width),
        Length: parseFloat(formData.Length),
        Density: parseFloat(formData.Density)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        showError(response.data.message || 'Failed to update dimension');
      }
    } catch (err) {
      console.error('Error updating dimension:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update dimension. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const weight = calculateWeight();

  // Label component for consistency
  const Label = ({ children, required }) => (
    <Typography sx={{ 
      fontSize: '0.7rem', 
      fontWeight: 600, 
      color: COLORS.text.secondary, 
      letterSpacing: '0.5px' 
    }}>
      {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </Typography>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
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
          mb: 2,
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
            Edit Dimension Weight
          </Typography>
        </DialogTitle>

        {/* Floating Error Alert - Positioned at top of dialog content */}
        <Box sx={{ px: 2.5, pt: 1 }}>
          <FloatingErrorAlert error={error} onClose={() => setError('')} />
        </Box>

        <DialogContent sx={{ p: 2.5, pt: error ? 1 : 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Part No Field with Add Button */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Label required>PART NO</Label>
                    <Tooltip title="Add New Item">
                      <IconButton
                        size="small"
                        onClick={() => setAddItemOpen(true)}
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
                    loading={fetchingItems}
                    value={selectedPart}
                    onChange={handlePartChange}
                    getOptionLabel={(option) => option.part_no || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select a part number"
                        required
                        error={!!fieldErrors.PartNo}
                        helperText={fieldErrors.PartNo}
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
                            color: COLORS.text.primary,
                            '&::placeholder': {
                              color: COLORS.text.tertiary,
                              fontSize: '0.75rem'
                            }
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {fetchingItems ? <CircularProgress color="inherit" size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                            {option.part_no}
                          </Typography>
                          {option.part_description && (
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                              {option.part_description}
                            </Typography>
                          )}
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

                  {fetchingItems && !selectedPart && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CircularProgress size={12} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Loading parts...
                      </Typography>
                    </Box>
                  )}
                  {!fetchingItems && items.length === 0 && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                      No parts available. Please click the + button to add an item first.
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Thickness Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>THICKNESS (mm)</Label>
                  <TextField
                    fullWidth
                    name="Thickness"
                    type="number"
                    value={formData.Thickness}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter thickness"
                    size="small"
                    variant="outlined"
                    error={!!fieldErrors.Thickness}
                    helperText={fieldErrors.Thickness}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                          mm
                        </Typography>
                      ),
                      inputProps: { min: 0, step: 0.01 }
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
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none', margin: 0
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Width Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>WIDTH (mm)</Label>
                  <TextField
                    fullWidth
                    name="Width"
                    type="number"
                    value={formData.Width}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter width"
                    size="small"
                    variant="outlined"
                    error={!!fieldErrors.Width}
                    helperText={fieldErrors.Width}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                          mm
                        </Typography>
                      ),
                      inputProps: { min: 0, step: 0.01 }
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
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none', margin: 0
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Length Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>LENGTH (mm)</Label>
                  <TextField
                    fullWidth
                    name="Length"
                    type="number"
                    value={formData.Length}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter length"
                    size="small"
                    variant="outlined"
                    error={!!fieldErrors.Length}
                    helperText={fieldErrors.Length}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                          mm
                        </Typography>
                      ),
                      inputProps: { min: 0, step: 0.01 }
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
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none', margin: 0
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Density Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Label required>DENSITY (g/cm³)</Label>
                  <TextField
                    fullWidth
                    name="Density"
                    type="number"
                    value={formData.Density}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter density"
                    size="small"
                    variant="outlined"
                    error={!!fieldErrors.Density}
                    helperText={fieldErrors.Density}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, ml: 0.5 }}>
                          g/cm³
                        </Typography>
                      ),
                      inputProps: { min: 0, step: 0.01 }
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
                        color: COLORS.text.primary,
                        '&::placeholder': {
                          color: COLORS.text.tertiary,
                          fontSize: '0.75rem'
                        }
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none', margin: 0
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Weight Preview */}
              {weight > 0 && (
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
                    Weight Calculation Preview
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Weight:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {dimension?.WeightInKG || 0} kg
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>New Calculated Weight:</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primaryDark }}>
                        {weight} kg
                      </Typography>
                    </Stack>
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
            disabled={loading || fetchingItems}
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
            {loading ? 'Updating...' : 'Update Dimension'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Item Dialog */}
      <AddItem
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onAdd={handleItemAdded}
      />
    </>
  );
};

export default EditDimensions;