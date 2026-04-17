// // AddRFQ.js
// import React, { useState, useEffect } from 'react';
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
//   Select,
//   MenuItem,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Autocomplete,
//   Chip,
//   InputAdornment,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   styled
// } from '@mui/material';
// import { 
//   Add as AddIcon,
//   Delete as DeleteIcon,
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
//   primaryBlue: '#00B4D8',
//   text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
//   background: { white: '#FFFFFF', light: '#F8FFFC', hover: '#F0FDF9' },
//   border: '#E3E8EF'
// };

// const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
// const PRIMARY_DARK = '#063C3F';
// const PRIMARY_BLUE = '#00B4D8';

// // Modern Stepper Connector with Gradient
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: HEADER_GRADIENT,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: HEADER_GRADIENT,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 2,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// // Custom Step Icon styling
// const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
//   zIndex: 1,
//   color: '#fff',
//   width: 24,
//   height: 24,
//   display: 'flex',
//   borderRadius: '50%',
//   justifyContent: 'center',
//   alignItems: 'center',
//   fontSize: '0.75rem',
//   fontWeight: 600,
//   ...(ownerState.active && {
//     backgroundColor: PRIMARY_BLUE,
//     boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
//   }),
//   ...(ownerState.completed && {
//     backgroundColor: PRIMARY_BLUE,
//   }),
// }));

// function CustomStepIcon(props) {
//   const { active, completed, className } = props;
//   return (
//     <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
//       {completed ? '✓' : props.icon}
//     </CustomStepIconRoot>
//   );
// }

// const steps = ['Basic Info', 'Items & Vendors'];

// const AddRFQ = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [pendingPRs, setPendingPRs] = useState([]);
//   const [loadingPRs, setLoadingPRs] = useState(false);
//   const [vendors, setVendors] = useState([]);
//   const [loadingVendors, setLoadingVendors] = useState(false);
  
//   const [formData, setFormData] = useState({
//     pr_id: '',
//     valid_till: '',
//     vendor_ids: []
//   });

//   const [selectedPR, setSelectedPR] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});

//   useEffect(() => {
//     if (open) {
//       fetchPendingPRs();
//       fetchVendors();
//     }
//   }, [open]);

//   const fetchPendingPRs = async () => {
//     try {
//       setLoadingPRs(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/purchase-requisitions/pending-rfq`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setPendingPRs(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching pending PRs:', err);
//     } finally {
//       setLoadingPRs(false);
//     }
//   };

//   const fetchVendors = async () => {
//     try {
//       setLoadingVendors(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/vendors?page=1&limit=100`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setVendors(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//     } finally {
//       setLoadingVendors(false);
//     }
//   };

//   const handlePRChange = (event, value) => {
//     setSelectedPR(value);
//     setFormData(prev => ({ ...prev, pr_id: value?._id || '' }));
//     setFieldErrors(prev => ({ ...prev, pr_id: '' }));
//   };

//   const handleVendorSelect = (event, newValue) => {
//     setFormData(prev => ({ ...prev, vendor_ids: newValue.map(v => v._id) }));
//     setFieldErrors(prev => ({ ...prev, vendor_ids: '' }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateStep = (step) => {
//     const errors = {};
//     let isValid = true;

//     switch (step) {
//       case 0: // Basic Info
//         if (!formData.pr_id) {
//           errors.pr_id = 'Purchase requisition is required';
//           isValid = false;
//         }
//         if (!formData.valid_till) {
//           errors.valid_till = 'Valid till date is required';
//           isValid = false;
//         }
//         break;
//       case 1: // Items & Vendors
//         if (formData.vendor_ids.length === 0) {
//           errors.vendor_ids = 'At least one vendor is required';
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
//     if (formData.vendor_ids.length === 0) {
//       setError('At least one vendor is required');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
      
//       const submissionData = {
//         pr_id: formData.pr_id,
//         valid_till: formData.valid_till,
//         vendor_ids: formData.vendor_ids,
//         created_by: user._id
//       };

//       const response = await axios.post(`${BASE_URL}/api/rfqs`, submissionData, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });

//       if (response.data.success) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to create RFQ');
//       }
//     } catch (err) {
//       console.error('Error creating RFQ:', err);
//       setError(err.response?.data?.message || 'Failed to create RFQ');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ pr_id: '', valid_till: '', vendor_ids: [] });
//     setSelectedPR(null);
//     setFieldErrors({});
//     setError('');
//     setActiveStep(0);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const today = new Date().toISOString().split('T')[0];
//   const selectedVendorObjects = vendors.filter(v => formData.vendor_ids.includes(v._id));

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0: // Basic Info
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Basic Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       PURCHASE REQUISITION <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       options={pendingPRs}
//                       loading={loadingPRs}
//                       value={selectedPR}
//                       onChange={handlePRChange}
//                       getOptionLabel={(opt) => `${opt.pr_number} - ${opt.department} (${opt.items?.length || 0} items) - ₹${opt.total_estimated_value?.toLocaleString() || 0}`}
//                       renderInput={(params) => (
//                         <TextField 
//                           {...params} 
//                           size="small" 
//                           placeholder="Select purchase requisition..." 
//                           error={!!fieldErrors.pr_id} 
//                           helperText={fieldErrors.pr_id}
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
//                       renderOption={(props, opt) => (
//                         <li {...props}>
//                           <Box>
//                             <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{opt.pr_number}</Typography>
//                             <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                               {opt.department} | {opt.items?.length} items | ₹{opt.total_estimated_value?.toLocaleString()}
//                             </Typography>
//                           </Box>
//                         </li>
//                       )}
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
//                       VALID TILL <span style={{ color: '#EF4444' }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       type="date"
//                       name="valid_till"
//                       value={formData.valid_till}
//                       onChange={handleChange}
//                       error={!!fieldErrors.valid_till}
//                       helperText={fieldErrors.valid_till}
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
//               </Grid>
//             </Paper>
//           </Stack>
//         );
      
//       case 1: // Items & Vendors
//         return (
//           <Stack spacing={2}>
//             {selectedPR && selectedPR.items && selectedPR.items.length > 0 && (
//               <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//                 <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                   Items
//                 </Typography>
//                 <TableContainer>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ bgcolor: COLORS.background.light }}>
//                         <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
//                         <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
//                         <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Qty</TableCell>
//                         <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedPR.items.map((item, idx) => (
//                         <TableRow key={idx}>
//                           <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
//                           <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
//                           <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.required_qty}</TableCell>
//                           <TableCell sx={{ fontSize: '0.75rem' }} align="right">{item.unit}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Paper>
//             )}

//             <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Select Vendors
//               </Typography>
              
//               <Autocomplete
//                 multiple
//                 options={vendors}
//                 loading={loadingVendors}
//                 value={selectedVendorObjects}
//                 onChange={handleVendorSelect}
//                 getOptionLabel={(opt) => `${opt.vendor_code} - ${opt.vendor_name}`}
//                 renderInput={(params) => (
//                   <TextField 
//                     {...params} 
//                     size="small" 
//                     placeholder="Select vendors..." 
//                     error={!!fieldErrors.vendor_ids} 
//                     helperText={fieldErrors.vendor_ids}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         fontSize: '0.75rem',
//                         '&:hover fieldset': { borderColor: COLORS.primary },
//                         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                       },
//                       '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
//                       '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
//                     }}
//                   />
//                 )}
//                 renderTags={(value, getTagProps) =>
//                   value.map((option, index) => (
//                     <Chip
//                       key={option._id}
//                       label={`${option.vendor_code} - ${option.vendor_name}`}
//                       size="small"
//                       {...getTagProps({ index })}
//                       sx={{ 
//                         fontSize: '0.7rem', 
//                         height: 24, 
//                         bgcolor: COLORS.primaryLight, 
//                         color: COLORS.primary,
//                         '& .MuiChip-label': { px: 1 }
//                       }}
//                     />
//                   ))
//                 }
//                 renderOption={(props, option) => (
//                   <li {...props}>
//                     <Box>
//                       <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{option.vendor_name}</Typography>
//                       <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                         Code: {option.vendor_code} | GST: {option.gstin || 'N/A'}
//                       </Typography>
//                     </Box>
//                   </li>
//                 )}
//               />
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
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           Create Request for Quotation
//         </Typography>

//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 0.5, mt: 0.5 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel StepIconComponent={CustomStepIcon}>
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
//               disabled={loading || !formData.pr_id || !formData.valid_till || formData.vendor_ids.length === 0}
//               startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
//               {loading ? 'Creating...' : 'Create RFQ'}
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

// export default AddRFQ;

// AddRFQ.js
import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Link,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  AddCircle as AddCircleIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddVendor from '../../master/vendormaster/AddVendor';
import ApproveVendor from '../../master/vendormaster/ApproveVendor';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  primaryBlue: '#00B4D8',
  text: { primary: '#151C26', secondary: '#4B5568', tertiary: '#94A3B8' },
  background: { white: '#FFFFFF', light: '#F8FFFC', hover: '#F0FDF9' },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const steps = ['Basic Info', 'Items & Vendors'];

// Helper function to safely get department name
const getDepartmentName = (department) => {
  if (!department) return 'N/A';
  if (typeof department === 'string') return department;
  if (typeof department === 'object') {
    return department.DepartmentName || department.name || 'N/A';
  }
  return 'N/A';
};

const AddRFQ = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingPRs, setPendingPRs] = useState([]);
  const [loadingPRs, setLoadingPRs] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showApproveVendor, setShowApproveVendor] = useState(false);
  const [selectedVendorForApproval, setSelectedVendorForApproval] = useState(null);
  
  const [formData, setFormData] = useState({
    pr_id: '',
    valid_till: '',
    vendor_ids: []
  });

  const [selectedPR, setSelectedPR] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchPendingPRs();
      fetchVendors();
    }
  }, [open]);

  const fetchPendingPRs = async () => {
    try {
      setLoadingPRs(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/purchase-requisitions/pending-rfq`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setPendingPRs(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching pending PRs:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending PRs');
    } finally {
      setLoadingPRs(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handlePRChange = (event, value) => {
    setSelectedPR(value);
    setFormData(prev => ({ ...prev, pr_id: value?._id || '' }));
    setFieldErrors(prev => ({ ...prev, pr_id: '' }));
  };

  const handleVendorSelect = (event, newValue) => {
    setFormData(prev => ({ ...prev, vendor_ids: newValue.map(v => v._id) }));
    setFieldErrors(prev => ({ ...prev, vendor_ids: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.pr_id) {
          errors.pr_id = 'Purchase requisition is required';
          isValid = false;
        }
        if (!formData.valid_till) {
          errors.valid_till = 'Valid till date is required';
          isValid = false;
        }
        break;
      case 1:
        if (formData.vendor_ids.length === 0) {
          errors.vendor_ids = 'At least one vendor is required';
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
    if (formData.vendor_ids.length === 0) {
      setError('At least one vendor is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const submissionData = {
        pr_id: formData.pr_id,
        valid_till: formData.valid_till,
        vendor_ids: formData.vendor_ids,
        created_by: user._id
      };

      const response = await axios.post(`${BASE_URL}/api/rfqs`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create RFQ');
      }
    } catch (err) {
      console.error('Error creating RFQ:', err);
      setError(err.response?.data?.message || 'Failed to create RFQ');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ pr_id: '', valid_till: '', vendor_ids: [] });
    setSelectedPR(null);
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleVendorAdded = (newVendor) => {
    setVendors(prev => [...prev, newVendor]);
    setFormData(prev => ({
      ...prev,
      vendor_ids: [...prev.vendor_ids, newVendor._id]
    }));
    setShowAddVendor(false);
  };



  const handleVendorApproved = (updatedVendor) => {
  
    setVendors(prev => prev.map(v => 
      v._id === updatedVendor._id ? updatedVendor : v
    ));
    
    setFormData(prev => ({
      ...prev,
      vendor_ids: prev.vendor_ids 
    }));
    
    setShowApproveVendor(false);
    setSelectedVendorForApproval(null);
    
    setError(''); 
  };

  const handleOpenApproveVendor = (vendor) => {
    setSelectedVendorForApproval(vendor);
    setShowApproveVendor(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedVendorObjects = vendors.filter(v => formData.vendor_ids.includes(v._id));

  const getVendorAvlStatus = (vendor) => {
    if (vendor.avl_approved) {
      return { text: 'AVL Approved', color: COLORS.success, icon: <VerifiedIcon sx={{ fontSize: 12 }} /> };
    }
    return { text: 'Not AVL Approved', color: COLORS.warning, icon: <WarningIcon sx={{ fontSize: 12 }} /> };
  };

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
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PURCHASE REQUISITION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={pendingPRs}
                      loading={loadingPRs}
                      value={selectedPR}
                      onChange={handlePRChange}
                      // getOptionLabel={(opt) => {
                      //   const deptName = getDepartmentName(opt.department);
                      //   return `${opt.pr_number} - ${deptName} (${opt.items?.length || 0} items) - ₹${opt.total_estimated_value?.toLocaleString() || 0}`;
                      // }}
                      getOptionLabel={(opt) => `${opt.pr_number} (${opt.items?.length || 0} items) - ₹${opt.total_estimated_value?.toLocaleString() || 0}`}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          size="small" 
                          placeholder="Select purchase requisition..." 
                          error={!!fieldErrors.pr_id} 
                          helperText={fieldErrors.pr_id}
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
                     renderOption={(props, opt) => {
  return (
    <li {...props}>
      <Box>
        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{opt.pr_number}</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
          {opt.items?.length} items | ₹{opt.total_estimated_value?.toLocaleString()}
        </Typography>
      </Box>
    </li>
  );
}}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      VALID TILL <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="valid_till"
                      value={formData.valid_till}
                      onChange={handleChange}
                      error={!!fieldErrors.valid_till}
                      helperText={fieldErrors.valid_till}
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
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            {selectedPR && selectedPR.items && selectedPR.items.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPR.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.required_qty}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">{item.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '0.9rem' }}>
                  Select Vendors
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddCircleIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setShowAddVendor(true)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    color: COLORS.primary,
                    '&:hover': { bgcolor: `${COLORS.primary}10` }
                  }}
                >
                  Add New Vendor
                </Button>
              </Box>
              
              <Autocomplete
                multiple
                options={vendors}
                loading={loadingVendors}
                value={selectedVendorObjects}
                onChange={handleVendorSelect}
                getOptionLabel={(opt) => `${opt.vendor_code} - ${opt.vendor_name}`}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    size="small" 
                    placeholder="Select vendors..." 
                    error={!!fieldErrors.vendor_ids} 
                    helperText={fieldErrors.vendor_ids}
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
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const avlStatus = getVendorAvlStatus(option);
                    return (
                      <Tooltip key={option._id} title={avlStatus.text}>
                        <Chip
                          label={`${option.vendor_code} - ${option.vendor_name}`}
                          size="small"
                          {...getTagProps({ index })}
                          onClick={() => handleOpenApproveVendor(option)}
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 24, 
                            bgcolor: option.avl_approved ? COLORS.success + '20' : COLORS.warning + '20',
                            color: option.avl_approved ? COLORS.success : COLORS.warning,
                            border: `1px solid ${option.avl_approved ? COLORS.success : COLORS.warning}`,
                            cursor: 'pointer',
                            '& .MuiChip-label': { px: 1, display: 'flex', alignItems: 'center', gap: 0.5 },
                            '&:hover': {
                              opacity: 0.8,
                              transform: 'scale(1.02)',
                              transition: 'all 0.2s ease'
                            }
                          }}
                          icon={avlStatus.icon}
                        />
                      </Tooltip>
                    );
                  })
                }
                renderOption={(props, option) => {
                  const avlStatus = getVendorAvlStatus(option);
                  return (
                    <li {...props}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                            {option.vendor_name}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Code: {option.vendor_code} | GST: {option.gstin || 'N/A'}
                          </Typography>
                        </Box>
                        <Chip
                          label={avlStatus.text}
                          size="small"
                          icon={avlStatus.icon}
                          onClick={() => {
                            props.onClick?.(props);
                            handleOpenApproveVendor(option);
                          }}
                          sx={{
                            fontSize: '0.6rem',
                            height: 20,
                            bgcolor: avlStatus.color + '20',
                            color: avlStatus.color,
                            cursor: 'pointer',
                            '& .MuiChip-label': { fontSize: '0.6rem', px: 1 },
                            '&:hover': {
                              opacity: 0.8
                            }
                          }}
                        />
                      </Box>
                    </li>
                  );
                }}
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

              {/* Warning message if selected vendor is not AVL approved */}
              {selectedVendorObjects.some(v => !v.avl_approved) && (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mt: 1.5, 
                    borderRadius: 1.5,
                    fontSize: '0.7rem',
                    py: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    ⚠️ Some selected vendors are not AVL approved. Click on the vendor chip to approve them.
                  </Typography>
                </Alert>
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
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Create Request for Quotation
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorConnector />}
            sx={{ mb: 0.5, mt: 0.5 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
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
                disabled={loading || !formData.pr_id || !formData.valid_till || formData.vendor_ids.length === 0}
                startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? 'Creating...' : 'Create RFQ'}
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
      </Dialog>

      {/* Add Vendor Dialog */}
      <AddVendor 
        open={showAddVendor}
        onClose={() => setShowAddVendor(false)}
        onAdd={handleVendorAdded}
      />

      {/* Approve Vendor Dialog */}
      <ApproveVendor
        open={showApproveVendor}
        onClose={() => {
          setShowApproveVendor(false);
          setSelectedVendorForApproval(null);
        }}
        vendor={selectedVendorForApproval}
        onApprove={handleVendorApproved}
      />
    </>
  );
};

export default AddRFQ;