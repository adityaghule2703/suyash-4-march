// import React, { useState, useEffect } from 'react';
// import {
//   // Layout components
//   Box,
//   Container,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   Grid,
//   Card,
//   CardContent,
  
//   // Form components
//   TextField,
//   FormControl,
//   FormLabel,
//   FormHelperText,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Checkbox,
//   Switch,
//   Autocomplete,
  
//   // Feedback components
//   Alert,
//   AlertTitle,
//   Snackbar,
//   CircularProgress,
  
//   // Data display
//   Typography,
//   Chip,
//   Divider,
//   Avatar,
//   Badge,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   ListItemIcon,
  
//   // Buttons and actions
//   Button,
//   IconButton,
//   ButtonGroup,
//   Fab,
  
//   // Navigation
//   Breadcrumbs,
//   Link,
  
//   // Surfaces
//   AppBar,
//   Toolbar,
//   Drawer,
//   styled,
  
//   // Utils
//   Stack,
//   Grow,
//   Fade,
//   Zoom,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,  // 👈 Keep only ONE set of Dialog imports
  
// } from '@mui/material';
// import { Add as AddIcon, Close as CloseIcon, NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // 🔥 Modern Stepper Connector with Gradient
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const AddRequisition = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     department: null,
//     location: '',
//     positionTitle: '',
//     noOfPositions: '',
//     employmentType: '',
//     reasonForHire: '',
//     education: '',
//     experienceYears: '', // Changed to empty string instead of empty array
//     skills: [],
//     budgetMin: '',
//     budgetMax: '',
//     grade: '',
//     justification: '',
//     priority: 'Medium',
//     targetHireDate: ''
//   });

//   // Department dropdown state
//   const [departments, setDepartments] = useState([]);
//   const [departmentLoading, setDepartmentLoading] = useState(false);
//   const [departmentSearch, setDepartmentSearch] = useState('');
//   const [departmentOpen, setDepartmentOpen] = useState(false);
//   const [departmentPage, setDepartmentPage] = useState(1);
//   const [departmentTotalPages, setDepartmentTotalPages] = useState(1);
//   const [departmentInputValue, setDepartmentInputValue] = useState('');

//   const [skillInput, setSkillInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [validationErrors, setValidationErrors] = useState([]);

//   // Steps definition
//   const steps = ['Basic Info', 'Qualifications & Budget', 'Review & Submit']; // Added 3rd step

//   // Priorities
//   const priorities = ['Low', 'Medium', 'High', 'Critical'];

//   // Fetch departments from API
//   const fetchDepartments = async (search = '', page = 1) => {
//     setDepartmentLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/departments`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         params: {
//           page: page,
//           limit: 10,
//           search: search
//         }
//       });

//       if (response.data.success) {
//         if (page === 1) {
//           setDepartments(response.data.data || []);
//         } else {
//           setDepartments(prev => [...prev, ...(response.data.data || [])]);
//         }
//         setDepartmentTotalPages(response.data.pagination?.totalPages || 1);
//       }
//     } catch (err) {
//       console.error('Error fetching departments:', err);
//     } finally {
//       setDepartmentLoading(false);
//     }
//   };

//   // Load departments when dropdown opens
//   useEffect(() => {
//     if (departmentOpen) {
//       fetchDepartments(departmentSearch, 1);
//     }
//   }, [departmentOpen]);

//   // Search departments with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (departmentOpen) {
//         setDepartmentPage(1);
//         fetchDepartments(departmentSearch, 1);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [departmentSearch, departmentOpen]);

//   // Handle department scroll load more
//   const handleDepartmentScroll = (event) => {
//     const listboxNode = event.currentTarget;
//     if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
//       if (departmentPage < departmentTotalPages && !departmentLoading) {
//         const nextPage = departmentPage + 1;
//         setDepartmentPage(nextPage);
//         fetchDepartments(departmentSearch, nextPage);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     if (value === '' || /^\d+$/.test(value)) {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));

//       if (fieldErrors[name]) {
//         setFieldErrors(prev => ({
//           ...prev,
//           [name]: ''
//         }));
//       }
//     }
//   };

//   // Handle text change for experience (no validation)
//   const handleTextChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleAddSkill = () => {
//     if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, skillInput.trim()]
//       }));
//       setSkillInput('');
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(skill => skill !== skillToRemove)
//     }));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && skillInput.trim()) {
//       e.preventDefault();
//       handleAddSkill();
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     if (step === 0) {
//       if (!formData.department) {
//         errors.department = 'Department is required';
//       }
//       if (!formData.location.trim()) {
//         errors.location = 'Location is required';
//       }
//       if (!formData.positionTitle.trim()) {
//         errors.positionTitle = 'Position title is required';
//       }
//       if (!formData.noOfPositions) {
//         errors.noOfPositions = 'Number of positions is required';
//       } else if (parseInt(formData.noOfPositions) < 1) {
//         errors.noOfPositions = 'Must be at least 1 position';
//       }
//       if (!formData.employmentType.trim()) {
//         errors.employmentType = 'Employment type is required';
//       }
//       if (!formData.reasonForHire.trim()) {
//         errors.reasonForHire = 'Reason for hire is required';
//       }
//       if (!formData.grade.trim()) {
//         errors.grade = 'Grade is required';
//       }
//     } else if (step === 1) {
//       if (!formData.education.trim()) {
//         errors.education = 'Education requirement is required';
//       }
      
//       // Experience field validation removed - it's now optional
      
//       if (!formData.budgetMin) {
//         errors.budgetMin = 'Minimum budget is required';
//       }
//       if (!formData.budgetMax) {
//         errors.budgetMax = 'Maximum budget is required';
//       } else if (formData.budgetMin && formData.budgetMax &&
//         parseInt(formData.budgetMax) <= parseInt(formData.budgetMin)) {
//         errors.budgetMax = 'Maximum budget must be greater than minimum budget';
//       }
//       if (!formData.justification.trim()) {
//         errors.justification = 'Justification is required';
//       }
//       if (!formData.targetHireDate) {
//         errors.targetHireDate = 'Target hire date is required';
//       }
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep((prevStep) => prevStep + 1);
//       setError('');
//     } else {
//       setError('Please fill in all required fields in this section');
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//     setError('');
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(1)) {
//       setError('Please fill in all required fields correctly');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setValidationErrors([]);

//     try {
//       const token = localStorage.getItem('token');

//       // Prepare data according to API expectations
//       const submitData = {
//         department: formData.department?.DepartmentName || formData.department,
//         location: formData.location,
//         positionTitle: formData.positionTitle,
//         noOfPositions: parseInt(formData.noOfPositions),
//         employmentType: formData.employmentType,
//         reasonForHire: formData.reasonForHire,
//         education: formData.education,
//         experienceYears: formData.experienceYears, // Send as string, no conversion
//         skills: formData.skills,
//         budgetMin: parseInt(formData.budgetMin),
//         budgetMax: parseInt(formData.budgetMax),
//         grade: formData.grade,
//         justification: formData.justification,
//         priority: formData.priority,
//         targetHireDate: formData.targetHireDate
//       };

//       console.log('Submitting data:', submitData);

//       const response = await axios.post(`${BASE_URL}/api/requisitions`, submitData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to create requisition');
//       }
//     } catch (err) {
//       console.error('Error creating requisition:', err);
//       if (err.response) {
//         console.error('Error response:', err.response.data);

//         // Handle validation errors from backend
//         if (err.response.data.errors) {
//           setValidationErrors(err.response.data.errors);

//           // Map backend errors to field errors
//           const backendErrors = {};
//           err.response.data.errors.forEach(error => {
//             if (error.field) {
//               backendErrors[error.field] = error.message;
//             }
//           });
//           setFieldErrors(backendErrors);
//         }

//         setError(err.response.data?.message || 'Failed to create requisition. Please try again.');
//       } else {
//         setError('Failed to create requisition. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       department: null,
//       location: '',
//       positionTitle: '',
//       noOfPositions: '',
//       employmentType: '',
//       reasonForHire: '',
//       education: '',
//       experienceYears: '',
//       skills: [],
//       budgetMin: '',
//       budgetMax: '',
//       grade: '',
//       justification: '',
//       priority: 'Medium',
//       targetHireDate: ''
//     });
//     setSkillInput('');
//     setError('');
//     setFieldErrors({});
//     setValidationErrors([]);
//     setActiveStep(0);
//     setDepartmentSearch('');
//     setDepartmentInputValue('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             {/* Basic Information - Compact Grid */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Basic Information
//               </Typography>

//               <Grid container spacing={1.5}>
//                 {/* First Row: Department (Full Width) */}
//                 <Grid size={{ xs: 12 }}>
//                   <Autocomplete
//                     size="small"
//                     id="department-autocomplete"
//                     open={departmentOpen}
//                     onOpen={() => setDepartmentOpen(true)}
//                     onClose={() => setDepartmentOpen(false)}
//                     options={departments}
//                     loading={departmentLoading}
//                     value={formData.department}
//                     onChange={(event, newValue) => {
//                       setFormData(prev => ({ ...prev, department: newValue }));
//                       if (fieldErrors.department) setFieldErrors(prev => ({ ...prev, department: '' }));
//                     }}
//                     inputValue={departmentInputValue}
//                     onInputChange={(event, newInputValue) => {
//                       setDepartmentInputValue(newInputValue);
//                       setDepartmentSearch(newInputValue);
//                     }}
//                     getOptionLabel={(option) => option?.DepartmentName || ''}
//                     fullWidth
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Department"
//                         required
//                         error={!!fieldErrors.department}
//                         helperText={fieldErrors.department}
//                         size="small"
//                         placeholder="Select department"
//                         sx={{
//                           '& .MuiOutlinedInput-root': {
//                             borderRadius: 1
//                           }
//                         }}
//                         InputProps={{
//                           ...params.InputProps,
//                           endAdornment: (
//                             <>
//                               {departmentLoading ? <CircularProgress size={16} /> : null}
//                               {params.InputProps.endAdornment}
//                             </>
//                           ),
//                         }}
//                       />
//                     )}
//                     renderOption={(props, option) => (
//                       <MenuItem {...props} key={option._id} sx={{ py: 0.5 }}>
//                         <Typography variant="body2">{option.DepartmentName}</Typography>
//                       </MenuItem>
//                     )}
//                     ListboxProps={{ onScroll: handleDepartmentScroll, style: { maxHeight: 200 } }}
//                   />
//                 </Grid>

//                 {/* Second Row: Location, Position Title, No. of Positions */}
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Location"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     required
//                     error={!!fieldErrors.location}
//                     helperText={fieldErrors.location}
//                     placeholder="e.g., Plant Unit A"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 5 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Position Title"
//                     name="positionTitle"
//                     value={formData.positionTitle}
//                     onChange={handleChange}
//                     required
//                     error={!!fieldErrors.positionTitle}
//                     helperText={fieldErrors.positionTitle}
//                     placeholder="e.g., Machine Operator"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 3 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="No. of Positions"
//                     name="noOfPositions"
//                     value={formData.noOfPositions}
//                     onChange={handleNumberChange}
//                     required
//                     type="number"
//                     inputProps={{ min: 1 }}
//                     error={!!fieldErrors.noOfPositions}
//                     helperText={fieldErrors.noOfPositions}
//                     placeholder="e.g., 3"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Employment Details - Compact Grid */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Employment Details
//               </Typography>

//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
//                     <InputLabel>Employment Type *</InputLabel>
//                     <Select
//                       name="employmentType"
//                       value={formData.employmentType}
//                       onChange={handleChange}
//                       label="Employment Type *"
//                       required
//                       error={!!fieldErrors.employmentType}
//                     >
//                       <MenuItem value="Permanent">Permanent</MenuItem>
//                       <MenuItem value="Contract">Contract</MenuItem>
//                       <MenuItem value="Temporary">Temporary</MenuItem>
//                       <MenuItem value="Internship">Internship</MenuItem>
//                     </Select>
//                     {fieldErrors.employmentType && (
//                       <FormHelperText error>{fieldErrors.employmentType}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
//                     <InputLabel>Reason for Hire *</InputLabel>
//                     <Select
//                       name="reasonForHire"
//                       value={formData.reasonForHire}
//                       onChange={handleChange}
//                       label="Reason for Hire *"
//                       required
//                       error={!!fieldErrors.reasonForHire}
//                     >
//                       <MenuItem value="New Unit">New Unit</MenuItem>
//                       <MenuItem value="Replacement">Replacement</MenuItem>
//                       <MenuItem value="New Position">New Position</MenuItem>
//                       <MenuItem value="Project Based">Project Based</MenuItem>
//                       <MenuItem value="Others">Others</MenuItem>
//                     </Select>
//                     {fieldErrors.reasonForHire && (
//                       <FormHelperText error>{fieldErrors.reasonForHire}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Grade"
//                     name="grade"
//                     value={formData.grade}
//                     onChange={handleChange}
//                     required
//                     error={!!fieldErrors.grade}
//                     helperText={fieldErrors.grade}
//                     placeholder="e.g., Level 2"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
//                     <InputLabel>Priority *</InputLabel>
//                     <Select
//                       name="priority"
//                       value={formData.priority}
//                       onChange={handleChange}
//                       label="Priority *"
//                       required
//                     >
//                       {priorities.map(priority => (
//                         <MenuItem key={priority} value={priority}>{priority}</MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Budget & Additional */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Budget & Additional Info
//               </Typography>

//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Budget Min (₹)"
//                     name="budgetMin"
//                     value={formData.budgetMin}
//                     onChange={handleNumberChange}
//                     required
//                     type="number"
//                     error={!!fieldErrors.budgetMin}
//                     helperText={fieldErrors.budgetMin}
//                     placeholder="e.g., 18000"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Budget Max (₹)"
//                     name="budgetMax"
//                     value={formData.budgetMax}
//                     onChange={handleNumberChange}
//                     required
//                     type="number"
//                     error={!!fieldErrors.budgetMax}
//                     helperText={fieldErrors.budgetMax}
//                     placeholder="e.g., 28000"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Target Hire Date"
//                     name="targetHireDate"
//                     type="date"
//                     value={formData.targetHireDate}
//                     onChange={handleChange}
//                     required
//                     error={!!fieldErrors.targetHireDate}
//                     helperText={fieldErrors.targetHireDate}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Justification - Compact */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Justification
//               </Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 name="justification"
//                 value={formData.justification}
//                 onChange={handleChange}
//                 required
//                 multiline
//                 rows={2}
//                 error={!!fieldErrors.justification}
//                 helperText={fieldErrors.justification}
//                 placeholder="Brief justification..."
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={2}>
//             {/* Qualifications Section */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Qualifications
//               </Typography>

//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Education"
//                     name="education"
//                     value={formData.education}
//                     onChange={handleChange}
//                     required
//                     error={!!fieldErrors.education}
//                     helperText={fieldErrors.education}
//                     placeholder="e.g., Bachelor's Degree"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Experience"
//                     name="experienceYears"
//                     value={formData.experienceYears}
//                     onChange={handleTextChange} // Using text change handler
//                     type="text"
//                     error={!!fieldErrors.experienceYears}
//                     helperText={fieldErrors.experienceYears || 'Optional - e.g., 0, 1, 2'}
//                     placeholder="e.g., 0, 1, 2"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Box>
//                     <Typography variant="caption" sx={{ color: '#666', mb: 0.5, display: 'block' }}>
//                       Skills
//                     </Typography>
//                     <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
//                       <TextField
//                         size="small"
//                         value={skillInput}
//                         onChange={(e) => setSkillInput(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder="Add a skill and press Enter"
//                         sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                       />
//                       <Button
//                         variant="outlined"
//                         onClick={handleAddSkill}
//                         disabled={!skillInput.trim()}
//                         size="small"
//                         sx={{ borderRadius: 1 }}
//                       >
//                         Add
//                       </Button>
//                     </Box>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                       {formData.skills.map((skill) => (
//                         <Chip
//                           key={skill}
//                           label={skill}
//                           onDelete={() => handleRemoveSkill(skill)}
//                           size="small"
//                           sx={{
//                             backgroundColor: '#E3F2FD',
//                             color: '#1976D2',
//                             '& .MuiChip-deleteIcon': {
//                               color: '#1976D2',
//                               '&:hover': { color: '#1565C0' }
//                             }
//                           }}
//                         />
//                       ))}
//                       {formData.skills.length === 0 && (
//                         <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
//                           No skills added yet
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Review Your Requisition
//               </Typography>
              
//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Department</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                     {formData.department?.DepartmentName || formData.department || 'Not set'}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Location</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.location || 'Not set'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Position Title</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.positionTitle || 'Not set'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>No. of Positions</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.noOfPositions || '0'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Employment Type</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.employmentType || 'Not set'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Grade</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.grade || 'Not set'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Priority</Typography>
//                   <Chip 
//                     label={formData.priority} 
//                     size="small"
//                     sx={{ 
//                       backgroundColor: 
//                         formData.priority === 'High' ? '#FFEBEE' : 
//                         formData.priority === 'Medium' ? '#FFF3E0' : 
//                         formData.priority === 'Low' ? '#E8F5E9' : '#F3E5F5',
//                       color: 
//                         formData.priority === 'High' ? '#C62828' : 
//                         formData.priority === 'Medium' ? '#E65100' : 
//                         formData.priority === 'Low' ? '#2E7D32' : '#6A1B9A',
//                     }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Target Hire Date</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                     {formData.targetHireDate ? new Date(formData.targetHireDate).toLocaleDateString() : 'Not set'}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Divider sx={{ my: 1 }} />
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Education</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.education || 'Not set'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Experience</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.experienceYears || 'Not specified'}</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Budget Range</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                     ₹{formData.budgetMin || '0'} - ₹{formData.budgetMax || '0'}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Reason for Hire</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.reasonForHire || 'Not set'}</Typography>
//                 </Grid>
//                 {formData.skills.length > 0 && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>Skills</Typography>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                       {formData.skills.map(skill => (
//                         <Chip key={skill} label={skill} size="small" sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }} />
//                       ))}
//                     </Box>
//                   </Grid>
//                 )}
//                 <Grid size={{ xs: 12 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>Justification</Typography>
//                   <Paper sx={{ p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
//                     <Typography variant="body2" sx={{ color: '#333' }}>
//                       {formData.justification || 'No justification provided'}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </Paper>
            
//             <Alert severity="info" sx={{ borderRadius: 1 }}>
//               <Typography variant="body2">
//                 Please review all information before submitting. You can go back to make changes if needed.
//               </Typography>
//             </Alert>
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
//           borderRadius: 1.5,
//           maxHeight: '95vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         py: 1.5,
//         px: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, color: '#101010', mb: 1 }}>
//           Create New Requisition
//         </Typography>

//         {/* 🔥 Modern Stepper with Gradient Connector */}
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 1, mt: 1 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500} fontSize="0.85rem">{label}</Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2, overflow: 'auto' }}>
//         {renderStepContent(activeStep)}

//         {/* Display validation errors from backend */}
//         {validationErrors.length > 0 && (
//           <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>
//             <Typography variant="body2" fontWeight={600}>Please fix the following errors:</Typography>
//             <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
//               {validationErrors.map((err, index) => (
//                 <li key={index}>
//                   <Typography variant="caption">{err.message}</Typography>
//                 </li>
//               ))}
//             </ul>
//           </Alert>
//         )}

//         {error && !validationErrors.length && (
//           <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>{error}</Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2,
//         py: 1.5,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           size="small"
//           startIcon={<NavigateBeforeIcon />}
//           sx={{ color: '#666' }}
//         >
//           Back
//         </Button>
//         <Box>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             size="small"
//             sx={{ mr: 1, color: '#666' }}
//           >
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               size="small"
//               startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
//               sx={{
//                 backgroundColor: '#1976D2',
//                 '&:hover': { backgroundColor: '#1565C0' }
//               }}
//             >
//               {loading ? 'Creating...' : 'Create'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
//               size="small"
//               endIcon={<NavigateNextIcon />}
//               sx={{
//                 backgroundColor: '#1976D2',
//                 '&:hover': { backgroundColor: '#1565C0' }
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

// export default AddRequisition;


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  styled,
  StepConnector,
  stepConnectorClasses,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Paper,
  InputAdornment,
  Autocomplete,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon
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

// Custom Stepper Connector
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
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
}));

const steps = ["Basic Info", "Qualifications & Budget", "Review & Submit"];

const AddRequisition = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    department: null,
    location: '',
    positionTitle: '',
    noOfPositions: '',
    employmentType: '',
    reasonForHire: '',
    education: '',
    experienceYears: '',
    skills: [],
    budgetMin: '',
    budgetMax: '',
    grade: '',
    justification: '',
    priority: 'Medium',
    targetHireDate: ''
  });

  const [departments, setDepartments] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentInputValue, setDepartmentInputValue] = useState('');

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const fetchDepartments = async (search = '') => {
    setDepartmentLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: search, limit: 50 }
      });

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setDepartmentLoading(false);
    }
  };

  useEffect(() => {
    if (departmentOpen) {
      fetchDepartments(departmentSearch);
    }
  }, [departmentOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (departmentOpen) {
        fetchDepartments(departmentSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [departmentSearch, departmentOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!formData.department) errors.department = 'Department is required';
      if (!formData.location.trim()) errors.location = 'Location is required';
      if (!formData.positionTitle.trim()) errors.positionTitle = 'Position title is required';
      if (!formData.noOfPositions) errors.noOfPositions = 'Number of positions is required';
      else if (parseInt(formData.noOfPositions) < 1) errors.noOfPositions = 'Must be at least 1 position';
      if (!formData.employmentType) errors.employmentType = 'Employment type is required';
      if (!formData.reasonForHire) errors.reasonForHire = 'Reason for hire is required';
      if (!formData.grade.trim()) errors.grade = 'Grade is required';
    } else if (step === 1) {
      if (!formData.education.trim()) errors.education = 'Education requirement is required';
      if (!formData.budgetMin) errors.budgetMin = 'Minimum budget is required';
      if (!formData.budgetMax) errors.budgetMax = 'Maximum budget is required';
      if (formData.budgetMin && formData.budgetMax && 
          parseInt(formData.budgetMax) <= parseInt(formData.budgetMin)) {
        errors.budgetMax = 'Maximum budget must be greater than minimum budget';
      }
      if (!formData.justification.trim()) errors.justification = 'Justification is required';
      if (!formData.targetHireDate) errors.targetHireDate = 'Target hire date is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill in all required fields in this section');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const submitData = {
        department: formData.department?.DepartmentName || formData.department,
        location: formData.location,
        positionTitle: formData.positionTitle,
        noOfPositions: parseInt(formData.noOfPositions),
        employmentType: formData.employmentType,
        reasonForHire: formData.reasonForHire,
        education: formData.education,
        experienceYears: formData.experienceYears,
        skills: formData.skills,
        budgetMin: parseInt(formData.budgetMin),
        budgetMax: parseInt(formData.budgetMax),
        grade: formData.grade,
        justification: formData.justification,
        priority: formData.priority,
        targetHireDate: formData.targetHireDate
      };

      const response = await axios.post(`${BASE_URL}/api/requisitions`, submitData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create requisition');
      }
    } catch (err) {
      console.error('Error creating requisition:', err);
      setError(err.response?.data?.message || 'Failed to create requisition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      department: null,
      location: '',
      positionTitle: '',
      noOfPositions: '',
      employmentType: '',
      reasonForHire: '',
      education: '',
      experienceYears: '',
      skills: [],
      budgetMin: '',
      budgetMax: '',
      grade: '',
      justification: '',
      priority: 'Medium',
      targetHireDate: ''
    });
    setSkillInput('');
    setError('');
    setFieldErrors({});
    setActiveStep(0);
    setDepartmentSearch('');
    setDepartmentInputValue('');
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputStyle = {
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
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return {
      error: !!hasError,
      helperText: hasError || ''
    };
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BusinessIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Basic Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Department *</Typography>
                  <Autocomplete
                    size="small"
                    open={departmentOpen}
                    onOpen={() => setDepartmentOpen(true)}
                    onClose={() => setDepartmentOpen(false)}
                    options={departments}
                    loading={departmentLoading}
                    value={formData.department}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, department: newValue }));
                      if (fieldErrors.department) setFieldErrors(prev => ({ ...prev, department: '' }));
                    }}
                    onBlur={() => handleBlur({ target: { name: 'department' } })}
                    inputValue={departmentInputValue}
                    onInputChange={(event, newInputValue) => {
                      setDepartmentInputValue(newInputValue);
                      setDepartmentSearch(newInputValue);
                    }}
                    getOptionLabel={(option) => option?.DepartmentName || ''}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select department"
                        size="small"
                        error={touched.department && !!fieldErrors.department}
                        helperText={touched.department ? fieldErrors.department : ''}
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {departmentLoading ? <CircularProgress size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {option.DepartmentName}
                        </Typography>
                      </li>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={labelStyle}>Location *</Typography>
                  <TextField
                    fullWidth
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Plant Unit A"
                    {...getErrorProps('location')}
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Typography sx={labelStyle}>Position Title *</Typography>
                  <TextField
                    fullWidth
                    name="positionTitle"
                    value={formData.positionTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Machine Operator"
                    {...getErrorProps('positionTitle')}
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={labelStyle}>No. of Positions *</Typography>
                  <TextField
                    fullWidth
                    name="noOfPositions"
                    value={formData.noOfPositions}
                    onChange={handleNumberChange}
                    onBlur={handleBlur}
                    type="number"
                    inputProps={{ min: 1 }}
                    placeholder="e.g., 3"
                    {...getErrorProps('noOfPositions')}
                    sx={inputStyle}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Employment Type *</Typography>
                  <FormControl fullWidth size="small" error={touched.employmentType && !!fieldErrors.employmentType}>
                    <Select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      displayEmpty
                      sx={inputStyle}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select type</MenuItem>
                      <MenuItem value="Permanent" sx={{ fontSize: '0.75rem' }}>Permanent</MenuItem>
                      <MenuItem value="Contract" sx={{ fontSize: '0.75rem' }}>Contract</MenuItem>
                      <MenuItem value="Temporary" sx={{ fontSize: '0.75rem' }}>Temporary</MenuItem>
                      <MenuItem value="Internship" sx={{ fontSize: '0.75rem' }}>Internship</MenuItem>
                    </Select>
                    {touched.employmentType && fieldErrors.employmentType && (
                      <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.employmentType}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Reason for Hire *</Typography>
                  <FormControl fullWidth size="small" error={touched.reasonForHire && !!fieldErrors.reasonForHire}>
                    <Select
                      name="reasonForHire"
                      value={formData.reasonForHire}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      displayEmpty
                      sx={inputStyle}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select reason</MenuItem>
                      <MenuItem value="New Unit" sx={{ fontSize: '0.75rem' }}>New Unit</MenuItem>
                      <MenuItem value="Replacement" sx={{ fontSize: '0.75rem' }}>Replacement</MenuItem>
                      <MenuItem value="New Position" sx={{ fontSize: '0.75rem' }}>New Position</MenuItem>
                      <MenuItem value="Project Based" sx={{ fontSize: '0.75rem' }}>Project Based</MenuItem>
                      <MenuItem value="Others" sx={{ fontSize: '0.75rem' }}>Others</MenuItem>
                    </Select>
                    {touched.reasonForHire && fieldErrors.reasonForHire && (
                      <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.reasonForHire}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Grade *</Typography>
                  <TextField
                    fullWidth
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Level 2"
                    {...getErrorProps('grade')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Priority</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      sx={inputStyle}
                    >
                      {priorities.map(priority => (
                        <MenuItem key={priority} value={priority} sx={{ fontSize: '0.75rem' }}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Budget Min (₹) *</Typography>
                  <TextField
                    fullWidth
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleNumberChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="e.g., 18000"
                    {...getErrorProps('budgetMin')}
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Budget Max (₹) *</Typography>
                  <TextField
                    fullWidth
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleNumberChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="e.g., 28000"
                    {...getErrorProps('budgetMax')}
                    sx={inputStyle}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Target Hire Date *</Typography>
                  <TextField
                    fullWidth
                    name="targetHireDate"
                    type="date"
                    value={formData.targetHireDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    {...getErrorProps('targetHireDate')}
                    sx={inputStyle}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Justification *</Typography>
                  <TextField
                    fullWidth
                    name="justification"
                    value={formData.justification}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={3}
                    placeholder="Brief justification for this requisition..."
                    {...getErrorProps('justification')}
                    sx={inputStyle}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Qualifications
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Education *</Typography>
                  <TextField
                    fullWidth
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Bachelor's Degree"
                    {...getErrorProps('education')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Experience (Years)</Typography>
                  <TextField
                    fullWidth
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleTextChange}
                    placeholder="e.g., 0, 1, 2"
                    helperText="Optional"
                    sx={inputStyle}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Skills</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill and press Enter"
                      sx={inputStyle}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSkill}
                      disabled={!skillInput.trim()}
                      sx={{
                        height: 36,
                        px: 2,
                        borderRadius: 1.5,
                        bgcolor: COLORS.primary,
                        fontSize: '0.7rem',
                        textTransform: 'none',
                        '&:hover': { bgcolor: COLORS.primaryDark }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        size="small"
                        sx={{
                          bgcolor: COLORS.primaryLight,
                          color: COLORS.primaryDark,
                          fontSize: '0.65rem',
                          height: 28
                        }}
                      />
                    ))}
                    {formData.skills.length === 0 && (
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                        No skills added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InfoIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Review Your Requisition
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Department</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.department?.DepartmentName || formData.department || 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Location</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.location || 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Position Title</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.positionTitle || 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>No. of Positions</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.noOfPositions || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Employment Type</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.employmentType || 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Grade</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.grade || 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Priority</Typography>
                  <Chip 
                    label={formData.priority} 
                    size="small"
                    sx={{
                      bgcolor: formData.priority === 'High' ? COLORS.status.error :
                               formData.priority === 'Medium' ? COLORS.status.warning :
                               formData.priority === 'Low' ? COLORS.status.success : COLORS.status.info,
                      color: formData.priority === 'High' ? '#991B1B' :
                             formData.priority === 'Medium' ? '#92400E' :
                             formData.priority === 'Low' ? COLORS.primaryDark : COLORS.primaryDark,
                      fontSize: '0.65rem',
                      height: 24
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Target Hire Date</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.targetHireDate ? new Date(formData.targetHireDate).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ borderColor: COLORS.border }} />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Education</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.education || 'Not set'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Experience</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.experienceYears || 'Not specified'} years
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Budget Range</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    ₹{formData.budgetMin || '0'} - ₹{formData.budgetMax || '0'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={labelStyle}>Reason for Hire</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.reasonForHire || 'Not set'}
                  </Typography>
                </Grid>

                {formData.skills.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={labelStyle}>Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.skills.map(skill => (
                        <Chip 
                          key={skill} 
                          label={skill} 
                          size="small" 
                          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Justification</Typography>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formData.justification || 'No justification provided'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Please review all information before submitting. You can go back to make changes if needed.
            </Alert>
          </Stack>
        );

      default: return null;
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
          maxHeight: '90vh'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Create New Requisition
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
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
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
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
              '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
            }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? 'Creating...' : 'Create Requisition'}
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
                '&:hover': { bgcolor: COLORS.primaryDark }
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

export default AddRequisition;