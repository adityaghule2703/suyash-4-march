// // import React, { useState, useEffect } from 'react';
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Stack,
// //   Alert,
// //   MenuItem,
// //   Grid,
// //   CircularProgress,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Box,
// //   Typography,
// //   styled,
// //   StepConnector,
// //   Chip,
// //   OutlinedInput,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   FormHelperText,
// //   Checkbox,
// //   ListItemText,
// //   Divider,
// //   Paper,
// //   InputAdornment
// // } from '@mui/material';
// // import {
// //   Add as AddIcon,
// //   Work as WorkIcon,
// //   Business as BusinessIcon,
// //   LocationOn as LocationIcon,
// //   AttachMoney as AttachMoneyIcon,
// //   School as SchoolIcon,
// //   Build as BuildIcon,
// //   Info as InfoIcon,
// //   ArrowBack as ArrowBackIcon,
// //   ArrowForward as ArrowForwardIcon,
// //   Search as SearchIcon
// // } from '@mui/icons-material';
// // import axios from 'axios';
// // import BASE_URL from '../../../config/Config';

// // /* ------------------- Custom Stepper Styling ------------------- */
// // const ColorConnector = styled(StepConnector)(({ theme }) => ({
// //   '& .MuiStepConnector-line': {
// //     height: 4,
// //     border: 0,
// //     backgroundColor: '#e0e0e0',
// //     borderRadius: 10,
// //   },
// //   '&.Mui-active .MuiStepConnector-line': {
// //     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //   },
// //   '&.Mui-completed .MuiStepConnector-line': {
// //     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //   },
// // }));

// // // Custom styled Paper component for dropdown without scrollbars
// // const CustomPaper = styled(Paper)({
// //   maxHeight: 200,
// //   overflow: 'auto',
// //   '&::-webkit-scrollbar': {
// //     display: 'none'
// //   },
// //   scrollbarWidth: 'none',
// //   '-ms-overflow-style': 'none',
// //   '& .MuiAutocomplete-listbox': {
// //     '&::-webkit-scrollbar': {
// //       display: 'none'
// //     },
// //     scrollbarWidth: 'none',
// //     '-ms-overflow-style': 'none'
// //   }
// // });

// // // Custom styled MenuProps for Select components
// // const selectMenuProps = {
// //   PaperProps: {
// //     sx: {
// //       maxHeight: 200,
// //       overflow: 'auto',
// //       '&::-webkit-scrollbar': {
// //         display: 'none'
// //       },
// //       scrollbarWidth: 'none',
// //       '-ms-overflow-style': 'none'
// //     }
// //   }
// // };

// // const steps = ["Basic Information", "Job Details", "Publish Settings"];

// // // Available platforms for publishing
// // const publishPlatforms = [
// //   { value: 'careerPage', label: 'Career Page' },
// //   { value: 'naukri', label: 'Naukri.com' },
// //   { value: 'linkedin', label: 'LinkedIn' },
// //   { value: 'indeed', label: 'Indeed' },

// // ];

// // const AddJobOpening = ({ open, onClose, onAdd }) => {
// //   const [activeStep, setActiveStep] = useState(0);
// //   const [requisitions, setRequisitions] = useState([]);
// //   const [requisitionLoading, setRequisitionLoading] = useState(false);
// //   const [selectedRequisition, setSelectedRequisition] = useState(null);
// //   const [requisitionSearch, setRequisitionSearch] = useState('');

// //   const [formData, setFormData] = useState({
// //     requisitionId: '',
// //     description: '',
// //     companyIntro: '',
// //     requirements: [],
// //     responsibilities: [],
// //     publishTo: [],
// //     location: '',
// //     department: '',
// //     employmentType: 'Permanent',
// //     experienceRequired: {
// //       min: 0,
// //       max: 0
// //     },
// //     salaryRange: {
// //       min: 0,
// //       max: 0,
// //       currency: 'INR'
// //     },
// //     skills: [],
// //     education: []
// //   });

// //   // Temporary input fields for dynamic arrays
// //   const [requirementInput, setRequirementInput] = useState('');
// //   const [responsibilityInput, setResponsibilityInput] = useState('');
// //   const [skillInput, setSkillInput] = useState('');
// //   const [educationInput, setEducationInput] = useState('');

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [fieldErrors, setFieldErrors] = useState({});

// //   // Touched fields for validation
// //   const [touched, setTouched] = useState({});

// //   useEffect(() => {
// //     if (open) fetchRequisitions();
// //   }, [open]);

// //   const fetchRequisitions = async () => {
// //     try {
// //       setRequisitionLoading(true);
// //       const token = localStorage.getItem('token');
// //       const response = await axios.get(`${BASE_URL}/api/requisitions?status=approved`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (response.data.success) {
// //         setRequisitions(response.data.data || []);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching requisitions:', error);
// //     } finally {
// //       setRequisitionLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     // Handle nested objects
// //     if (name.includes('.')) {
// //       const [parent, child] = name.split('.');
// //       setFormData(prev => ({
// //         ...prev,
// //         [parent]: {
// //           ...prev[parent],
// //           [child]: value
// //         }
// //       }));
// //     } else {
// //       setFormData(prev => ({ ...prev, [name]: value }));
// //     }

// //     // Clear field error when user types
// //     if (fieldErrors[name]) {
// //       setFieldErrors(prev => ({ ...prev, [name]: '' }));
// //     }
// //   };

// //   const handleBlur = (e) => {
// //     const { name } = e.target;
// //     setTouched(prev => ({
// //       ...prev,
// //       [name]: true
// //     }));
// //   };

// //   const handleRequisitionChange = (e) => {
// //     const requisitionId = e.target.value;
// //     setFormData(prev => ({ ...prev, requisitionId }));

// //     // Auto-fill job details from selected requisition
// //     const selected = requisitions.find(req => req._id === requisitionId);
// //     if (selected) {
// //       setSelectedRequisition(selected);

// //       // Auto-populate fields from requisition
// //       setFormData(prev => ({
// //         ...prev,
// //         requisitionId: selected._id,
// //         location: selected.location || '',
// //         department: selected.department || '',
// //         employmentType: selected.employmentType || 'Permanent',
// //         experienceRequired: {
// //           min: selected.experienceYears || 0,
// //           max: (selected.experienceYears || 0) + 2
// //         },
// //         salaryRange: {
// //           min: selected.budgetMin || 0,
// //           max: selected.budgetMax || 0,
// //           currency: 'INR'
// //         },
// //         skills: selected.skills || [],
// //         education: selected.education ? [selected.education] : []
// //       }));
// //     }
// //   };

// //   // Handle requirements
// //   const handleAddRequirement = () => {
// //     if (requirementInput.trim()) {
// //       setFormData(prev => ({
// //         ...prev,
// //         requirements: [...prev.requirements, requirementInput.trim()]
// //       }));
// //       setRequirementInput('');
// //     }
// //   };

// //   const handleRemoveRequirement = (index) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       requirements: prev.requirements.filter((_, i) => i !== index)
// //     }));
// //   };

// //   // Handle responsibilities
// //   const handleAddResponsibility = () => {
// //     if (responsibilityInput.trim()) {
// //       setFormData(prev => ({
// //         ...prev,
// //         responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
// //       }));
// //       setResponsibilityInput('');
// //     }
// //   };

// //   const handleRemoveResponsibility = (index) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       responsibilities: prev.responsibilities.filter((_, i) => i !== index)
// //     }));
// //   };

// //   // Handle skills
// //   const handleAddSkill = () => {
// //     if (skillInput.trim()) {
// //       setFormData(prev => ({
// //         ...prev,
// //         skills: [...prev.skills, skillInput.trim()]
// //       }));
// //       setSkillInput('');
// //     }
// //   };

// //   const handleRemoveSkill = (index) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       skills: prev.skills.filter((_, i) => i !== index)
// //     }));
// //   };

// //   // Handle education
// //   const handleAddEducation = () => {
// //     if (educationInput.trim()) {
// //       setFormData(prev => ({
// //         ...prev,
// //         education: [...prev.education, educationInput.trim()]
// //       }));
// //       setEducationInput('');
// //     }
// //   };

// //   const handleRemoveEducation = (index) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       education: prev.education.filter((_, i) => i !== index)
// //     }));
// //   };

// //   // Handle publish platforms
// //   const handlePublishChange = (event) => {
// //     const { value } = event.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       publishTo: value
// //     }));
// //   };

// //   const handleNext = () => {
// //     if (validateStep()) {
// //       setActiveStep(prev => prev + 1);
// //     }
// //   };

// //   const handleBack = () => {
// //     setActiveStep(prev => prev - 1);
// //   };

// //   const validateStep = () => {
// //     const errors = {};
// //     let isValid = true;

// //     switch (activeStep) {
// //       case 0:
// //         if (!formData.requisitionId) {
// //           errors.requisitionId = 'Please select a requisition';
// //           isValid = false;
// //         }
// //         if (!formData.companyIntro?.trim()) {
// //           errors.companyIntro = 'Company introduction is required';
// //           isValid = false;
// //         }
// //         if (!formData.location?.trim()) {
// //           errors.location = 'Location is required';
// //           isValid = false;
// //         }
// //         if (!formData.department?.trim()) {
// //           errors.department = 'Department is required';
// //           isValid = false;
// //         }
// //         if (!formData.employmentType) {
// //           errors.employmentType = 'Employment type is required';
// //           isValid = false;
// //         }
// //         break;

// //       // case 1:
// //       //   if (!formData.description?.trim()) {
// //       //     errors.description = 'Job description is required';
// //       //     isValid = false;
// //       //   }
// //       //   if (formData.requirements.length === 0) {
// //       //     errors.requirements = 'Please add at least one requirement';
// //       //     isValid = false;
// //       //   }
// //       //   if (formData.responsibilities.length === 0) {
// //       //     errors.responsibilities = 'Please add at least one responsibility';
// //       //     isValid = false;
// //       //   }
// //       //   if (formData.experienceRequired.min < 0) {
// //       //     errors['experienceRequired.min'] = 'Minimum experience cannot be negative';
// //       //     isValid = false;
// //       //   }
// //       //   if (formData.experienceRequired.max < formData.experienceRequired.min) {
// //       //     errors['experienceRequired.max'] = 'Maximum experience must be greater than minimum';
// //       //     isValid = false;
// //       //   }
// //       //   if (formData.salaryRange.min < 0) {
// //       //     errors['salaryRange.min'] = 'Minimum salary cannot be negative';
// //       //     isValid = false;
// //       //   }
// //       //   if (formData.salaryRange.max < formData.salaryRange.min) {
// //       //     errors['salaryRange.max'] = 'Maximum salary must be greater than minimum';
// //       //     isValid = false;
// //       //   }
// //       //   break;

// //       case 1:
// //         return (
// //           <>
// //             <TextField
// //               fullWidth
// //               label="Job Description *"
// //               name="description"
// //               multiline
// //               rows={2}
// //               value={formData.description}
// //               onChange={handleChange}
// //               onBlur={handleBlur}
// //               error={touched.description && (!!fieldErrors.description || !formData.description)}
// //               helperText={
// //                 touched.description
// //                   ? (!formData.description ? 'Job description is required' : fieldErrors.description)
// //                   : 'Detailed description of the job role'
// //               }
// //               disabled={loading}
// //               size="medium"
// //               variant="outlined"
// //               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //             />

// //             {/* Requirements Section */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Requirements <span style={{ color: '#d32f2f' }}>*</span>
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={requirementInput}
// //                   onChange={(e) => setRequirementInput(e.target.value)}
// //                   placeholder="Add a requirement (e.g., Minimum 2 years experience)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddRequirement}
// //                   disabled={!requirementInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 },
// //                     minWidth: 80
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>

// //               {/* Dynamic Requirements List */}
// //               {formData.requirements.length > 0 && (
// //                 <Box
// //                   sx={{
// //                     display: 'flex',
// //                     flexWrap: 'wrap',
// //                     gap: 1,
// //                     mb: 1,
// //                     p: 1,
// //                     backgroundColor: '#f5f5f5',
// //                     borderRadius: 1,
// //                     minHeight: formData.requirements.length > 0 ? 'auto' : 0
// //                   }}
// //                 >
// //                   {formData.requirements.map((req, index) => (
// //                     <Chip
// //                       key={index}
// //                       label={req}
// //                       onDelete={() => handleRemoveRequirement(index)}
// //                       color="primary"
// //                       variant="outlined"
// //                       size="small"
// //                       sx={{ borderRadius: 1 }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}

// //               {touched.requirements && fieldErrors.requirements && (
// //                 <FormHelperText error>{fieldErrors.requirements}</FormHelperText>
// //               )}
// //             </Box>

// //             {/* Responsibilities Section */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Responsibilities <span style={{ color: '#d32f2f' }}>*</span>
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={responsibilityInput}
// //                   onChange={(e) => setResponsibilityInput(e.target.value)}
// //                   placeholder="Add a responsibility (e.g., Operate production machinery)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddResponsibility}
// //                   disabled={!responsibilityInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 },
// //                     minWidth: 80
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>

// //               {/* Dynamic Responsibilities List */}
// //               {formData.responsibilities.length > 0 && (
// //                 <Box
// //                   sx={{
// //                     display: 'flex',
// //                     flexWrap: 'wrap',
// //                     gap: 1,
// //                     mb: 1,
// //                     p: 1,
// //                     backgroundColor: '#f5f5f5',
// //                     borderRadius: 1,
// //                     minHeight: formData.responsibilities.length > 0 ? 'auto' : 0
// //                   }}
// //                 >
// //                   {formData.responsibilities.map((resp, index) => (
// //                     <Chip
// //                       key={index}
// //                       label={resp}
// //                       onDelete={() => handleRemoveResponsibility(index)}
// //                       color="secondary"
// //                       variant="outlined"
// //                       size="small"
// //                       sx={{ borderRadius: 1 }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}

// //               {touched.responsibilities && fieldErrors.responsibilities && (
// //                 <FormHelperText error>{fieldErrors.responsibilities}</FormHelperText>
// //               )}
// //             </Box>

// //             {/* Experience Range */}
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} md={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Min Experience (years)"
// //                   name="experienceRequired.min"
// //                   type="number"
// //                   value={formData.experienceRequired.min}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['experienceRequired.min'] && !!fieldErrors['experienceRequired.min']}
// //                   helperText={touched['experienceRequired.min'] ? fieldErrors['experienceRequired.min'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: 0 }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Max Experience (years)"
// //                   name="experienceRequired.max"
// //                   type="number"
// //                   value={formData.experienceRequired.max}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['experienceRequired.max'] && !!fieldErrors['experienceRequired.max']}
// //                   helperText={touched['experienceRequired.max'] ? fieldErrors['experienceRequired.max'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: formData.experienceRequired.min }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //             </Grid>

// //             {/* Salary Range */}
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} md={4}>
// //                 <TextField
// //                   fullWidth
// //                   label="Min Salary"
// //                   name="salaryRange.min"
// //                   type="number"
// //                   value={formData.salaryRange.min}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['salaryRange.min'] && !!fieldErrors['salaryRange.min']}
// //                   helperText={touched['salaryRange.min'] ? fieldErrors['salaryRange.min'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: 0 }}
// //                   InputProps={{
// //                     startAdornment: (
// //                       <InputAdornment position="start">
// //                         <AttachMoneyIcon sx={{ color: '#64748b' }} />
// //                       </InputAdornment>
// //                     ),
// //                   }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={4}>
// //                 <TextField
// //                   fullWidth
// //                   label="Max Salary"
// //                   name="salaryRange.max"
// //                   type="number"
// //                   value={formData.salaryRange.max}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['salaryRange.max'] && !!fieldErrors['salaryRange.max']}
// //                   helperText={touched['salaryRange.max'] ? fieldErrors['salaryRange.max'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: formData.salaryRange.min }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={4}>
// //                 <FormControl fullWidth>
// //                   <InputLabel>Currency</InputLabel>
// //                   <Select
// //                     name="salaryRange.currency"
// //                     value={formData.salaryRange.currency}
// //                     onChange={handleChange}
// //                     label="Currency"
// //                     disabled={loading}
// //                     sx={{ borderRadius: 1 }}
// //                     MenuProps={selectMenuProps}
// //                   >
// //                     <MenuItem value="INR">INR</MenuItem>
// //                     <MenuItem value="USD">USD</MenuItem>
// //                     <MenuItem value="EUR">EUR</MenuItem>
// //                     <MenuItem value="GBP">GBP</MenuItem>
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //             </Grid>

// //             {/* Skills */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Required Skills
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={skillInput}
// //                   onChange={(e) => setSkillInput(e.target.value)}
// //                   placeholder="Add a skill (e.g., Lathe operation)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddSkill}
// //                   disabled={!skillInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 },
// //                     minWidth: 80
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>

// //               {/* Dynamic Skills List */}
// //               {formData.skills.length > 0 && (
// //                 <Box
// //                   sx={{
// //                     display: 'flex',
// //                     flexWrap: 'wrap',
// //                     gap: 1,
// //                     p: 1,
// //                     backgroundColor: '#f5f5f5',
// //                     borderRadius: 1
// //                   }}
// //                 >
// //                   {formData.skills.map((skill, index) => (
// //                     <Chip
// //                       key={index}
// //                       label={skill}
// //                       onDelete={() => handleRemoveSkill(index)}
// //                       icon={<BuildIcon />}
// //                       variant="outlined"
// //                       size="small"
// //                       sx={{ borderRadius: 1 }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}
// //             </Box>

// //             {/* Education */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Education Requirements
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={educationInput}
// //                   onChange={(e) => setEducationInput(e.target.value)}
// //                   placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddEducation}
// //                   disabled={!educationInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 },
// //                     minWidth: 80
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>

// //               {/* Dynamic Education List */}
// //               {formData.education.length > 0 && (
// //                 <Box
// //                   sx={{
// //                     display: 'flex',
// //                     flexWrap: 'wrap',
// //                     gap: 1,
// //                     p: 1,
// //                     backgroundColor: '#f5f5f5',
// //                     borderRadius: 1
// //                   }}
// //                 >
// //                   {formData.education.map((edu, index) => (
// //                     <Chip
// //                       key={index}
// //                       label={edu}
// //                       onDelete={() => handleRemoveEducation(index)}
// //                       icon={<SchoolIcon />}
// //                       variant="outlined"
// //                       size="small"
// //                       sx={{ borderRadius: 1 }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}
// //             </Box>
// //           </>
// //         );

// //       case 2:
// //         if (formData.publishTo.length === 0) {
// //           errors.publishTo = 'Please select at least one platform to publish';
// //           isValid = false;
// //         }
// //         break;

// //       default:
// //         break;
// //     }

// //     setFieldErrors(errors);
// //     if (!isValid) {
// //       setError('Please fill in all required fields correctly');
// //     } else {
// //       setError('');
// //     }
// //     return isValid;
// //   };

// //   const handleSubmit = async () => {
// //     if (!validateStep()) return;

// //     setLoading(true);
// //     setError('');
// //     setFieldErrors({});

// //     if (!formData.requisitionId) {
// //       setError('Please select a requisition');
// //       setLoading(false);
// //       return;
// //     }

// //     const payload = {
// //       requisitionId: formData.requisitionId,
// //       description: formData.description || '',
// //       companyIntro: formData.companyIntro || '',
// //       requirements: formData.requirements.length > 0 ? formData.requirements : ['Minimum experience required'],
// //       responsibilities: formData.responsibilities.length > 0 ? formData.responsibilities : ['Perform assigned duties'],
// //       publishTo: formData.publishTo,
// //       location: formData.location || 'Not specified',
// //       department: formData.department || 'Not specified',
// //       employmentType: formData.employmentType || 'Permanent',
// //       experienceRequired: {
// //         min: Number(formData.experienceRequired.min) || 0,
// //         max: Number(formData.experienceRequired.max) || 0
// //       },
// //       salaryRange: {
// //         min: Number(formData.salaryRange.min) || 0,
// //         max: Number(formData.salaryRange.max) || 0,
// //         currency: formData.salaryRange.currency || 'INR'
// //       },
// //       skills: formData.skills.length > 0 ? formData.skills : [],
// //       education: formData.education.length > 0 ? formData.education : []
// //     };

// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await axios.post(`${BASE_URL}/api/jobs`, payload, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       if (response.data.success) {
// //         onAdd(response.data.data);
// //         onClose();
// //         // Reset form
// //         setActiveStep(0);
// //         setFormData({
// //           requisitionId: '',
// //           description: '',
// //           companyIntro: '',
// //           requirements: [],
// //           responsibilities: [],
// //           publishTo: [],
// //           location: '',
// //           department: '',
// //           employmentType: 'Permanent',
// //           experienceRequired: { min: 0, max: 0 },
// //           salaryRange: { min: 0, max: 0, currency: 'INR' },
// //           skills: [],
// //           education: []
// //         });
// //         setSelectedRequisition(null);
// //         setError('');
// //         setTouched({});
// //       }
// //     } catch (err) {
// //       console.error('Error creating job:', err);

// //       if (err.response) {
// //         if (err.response.status === 400) {
// //           const serverError = err.response.data;
// //           if (serverError.message?.includes('Duplicate') ||
// //             serverError.message?.includes('duplicate') ||
// //             serverError.message?.includes('already exists')) {
// //             setError('Duplicate job ID. Please try again.');
// //           } else if (serverError.errors) {
// //             const serverFieldErrors = {};
// //             Object.keys(serverError.errors).forEach(key => {
// //               serverFieldErrors[key] = serverError.errors[key].message;
// //             });
// //             setFieldErrors(serverFieldErrors);
// //             setError('Please check the form for errors');
// //           } else if (serverError.message) {
// //             setError(serverError.message);
// //           } else {
// //             setError('Failed to create job opening. Please check all fields and try again.');
// //           }
// //         }
// //       } else if (err.request) {
// //         setError('No response from server. Please check your network connection.');
// //       } else {
// //         setError('Failed to create job opening. Please try again.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetForm = () => {
// //     setActiveStep(0);
// //     setFormData({
// //       requisitionId: '',
// //       description: '',
// //       companyIntro: '',
// //       requirements: [],
// //       responsibilities: [],
// //       publishTo: [],
// //       location: '',
// //       department: '',
// //       employmentType: 'Permanent',
// //       experienceRequired: { min: 0, max: 0 },
// //       salaryRange: { min: 0, max: 0, currency: 'INR' },
// //       skills: [],
// //       education: []
// //     });
// //     setSelectedRequisition(null);
// //     setError('');
// //     setFieldErrors({});
// //     setTouched({});
// //     setRequisitionSearch('');
// //   };

// //   const handleClose = () => {
// //     resetForm();
// //     onClose();
// //   };

// //   // Render step content
// //   const renderStepContent = () => {
// //     switch (activeStep) {
// //       case 0:
// //         return (
// //           <>
// //             <FormControl fullWidth>
// //               <InputLabel>Select Requisition *</InputLabel>
// //               <Select
// //                 value={formData.requisitionId}
// //                 onChange={handleRequisitionChange}
// //                 onBlur={handleBlur}
// //                 label="Select Requisition *"
// //                 error={touched.requisitionId && !!fieldErrors.requisitionId}
// //                 disabled={loading || requisitionLoading}
// //                 sx={{ borderRadius: 1 }}
// //                 MenuProps={selectMenuProps}
// //               >
// //                 {requisitionLoading ? (
// //                   <MenuItem disabled>
// //                     <CircularProgress size={18} sx={{ mr: 1 }} />
// //                     Loading...
// //                   </MenuItem>
// //                 ) : requisitions.length > 0 ? (
// //                   requisitions.map(req => (
// //                     <MenuItem key={req._id} value={req._id}>
// //                       {req.requisitionId} - {req.positionTitle || req.jobTitle} ({req.department})
// //                     </MenuItem>
// //                   ))
// //                 ) : (
// //                   <MenuItem disabled>No requisitions found</MenuItem>
// //                 )}
// //               </Select>
// //               {touched.requisitionId && fieldErrors.requisitionId && (
// //                 <FormHelperText error>{fieldErrors.requisitionId}</FormHelperText>
// //               )}
// //             </FormControl>

// //             <TextField
// //               fullWidth
// //               label="Company Introduction *"
// //               name="companyIntro"
// //               multiline
// //               rows={2}
// //               value={formData.companyIntro}
// //               onChange={handleChange}
// //               onBlur={handleBlur}
// //               error={touched.companyIntro && (!!fieldErrors.companyIntro || !formData.companyIntro)}
// //               helperText={
// //                 touched.companyIntro
// //                   ? (!formData.companyIntro ? 'Company introduction is required' : fieldErrors.companyIntro)
// //                   : 'Brief introduction about your company'
// //               }
// //               disabled={loading}
// //               size="medium"
// //               variant="outlined"
// //               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //             />

// //             <Grid container spacing={2}>
// //               <Grid item xs={12} md={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Location *"
// //                   name="location"
// //                   value={formData.location}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched.location && (!!fieldErrors.location || !formData.location)}
// //                   helperText={
// //                     touched.location
// //                       ? (!formData.location ? 'Location is required' : fieldErrors.location)
// //                       : 'e.g., Plant Unit A'
// //                   }
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   InputProps={{
// //                     startAdornment: (
// //                       <InputAdornment position="start">
// //                         <LocationIcon sx={{ color: '#64748b' }} />
// //                       </InputAdornment>
// //                     ),
// //                   }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Department *"
// //                   name="department"
// //                   value={formData.department}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched.department && (!!fieldErrors.department || !formData.department)}
// //                   helperText={
// //                     touched.department
// //                       ? (!formData.department ? 'Department is required' : fieldErrors.department)
// //                       : 'e.g., Production'
// //                   }
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   InputProps={{
// //                     startAdornment: (
// //                       <InputAdornment position="start">
// //                         <BusinessIcon sx={{ color: '#64748b' }} />
// //                       </InputAdornment>
// //                     ),
// //                   }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid>

// //                 <FormControl error={touched.employmentType && !!fieldErrors.employmentType} sx={{ width: "250px" }}>
// //                   <InputLabel>Employment Type *</InputLabel>
// //                   <Select
// //                     name="employmentType"
// //                     value={formData.employmentType}
// //                     onChange={handleChange}
// //                     onBlur={handleBlur}
// //                     label="Employment Type *"
// //                     disabled={loading}
// //                     sx={{ borderRadius: 1 }}
// //                     MenuProps={selectMenuProps}
// //                   >
// //                     <MenuItem value="Permanent">Permanent</MenuItem>
// //                     <MenuItem value="Contract">Contract</MenuItem>
// //                     <MenuItem value="Temporary">Temporary</MenuItem>
// //                     <MenuItem value="Internship">Internship</MenuItem>

// //                   </Select>
// //                   {touched.employmentType && fieldErrors.employmentType && (
// //                     <FormHelperText>{fieldErrors.employmentType}</FormHelperText>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //             </Grid>

// //           </>
// //         );

// //       case 1:
// //         return (
// //           <>
// //             <TextField
// //               fullWidth
// //               label="Job Description *"
// //               name="description"
// //               multiline
// //               rows={2}
// //               value={formData.description}
// //               onChange={handleChange}
// //               onBlur={handleBlur}
// //               error={touched.description && (!!fieldErrors.description || !formData.description)}
// //               helperText={
// //                 touched.description
// //                   ? (!formData.description ? 'Job description is required' : fieldErrors.description)
// //                   : 'Detailed description of the job role'
// //               }
// //               disabled={loading}
// //               size="medium"
// //               variant="outlined"
// //               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //             />

// //             {/* Requirements Section */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Requirements <span style={{ color: '#d32f2f' }}>*</span>
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={requirementInput}
// //                   onChange={(e) => setRequirementInput(e.target.value)}
// //                   placeholder="Add a requirement (e.g., Minimum 2 years experience)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddRequirement}
// //                   disabled={!requirementInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     color: '#fff !important', 
// //                     '&:hover': { opacity: 0.9 },

// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>
// //               {formData.requirements.length > 0 && (
// //                 <Box sx={{
// //                   display: 'flex',
// //                   flexWrap: 'wrap',
// //                   gap: 1,
// //                   // minHeight: 50,
// //                   mb: 1
// //                 }}>
// //                   {formData.requirements.map((req, index) => (
// //                     <Chip
// //                       key={index}
// //                       label={req}
// //                       onDelete={() => handleRemoveRequirement(index)}
// //                       color="primary"
// //                       variant="outlined"
// //                       size="small"
// //                       sx={{ borderRadius: 1 }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}
// //               {touched.requirements && fieldErrors.requirements && (
// //                 <FormHelperText error>{fieldErrors.requirements}</FormHelperText>
// //               )}
// //             </Box>

// //             {/* Responsibilities Section */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Responsibilities <span style={{ color: '#d32f2f' }}>*</span>
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={responsibilityInput}
// //                   onChange={(e) => setResponsibilityInput(e.target.value)}
// //                   placeholder="Add a responsibility (e.g., Operate production machinery)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddResponsibility}
// //                   disabled={!responsibilityInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                      color: '#fff !important', 
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 }
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>
// //               {formData.requirements.length > 0 && (
// //                 <Box sx={{
// //                   display: 'flex',
// //                   flexWrap: 'wrap',
// //                   gap: 1,
// //                   // minHeight: 50,
// //                   mb: 1
// //                 }}>
// //                   {formData.responsibilities.map((resp, index) => (
// //                     <Chip
// //                       key={index}
// //                       label={resp}
// //                       onDelete={() => handleRemoveResponsibility(index)}
// //                       color="secondary"
// //                       variant="outlined"
// //                       size="small"
// //                       sx={{ borderRadius: 1 }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}
// //               {touched.responsibilities && fieldErrors.responsibilities && (
// //                 <FormHelperText error>{fieldErrors.responsibilities}</FormHelperText>
// //               )}
// //             </Box>

// //             {/* Experience Range */}
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} md={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Min Experience (years)"
// //                   name="experienceRequired.min"
// //                   type="number"
// //                   value={formData.experienceRequired.min}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['experienceRequired.min'] && !!fieldErrors['experienceRequired.min']}
// //                   helperText={touched['experienceRequired.min'] ? fieldErrors['experienceRequired.min'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: 0 }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Max Experience (years)"
// //                   name="experienceRequired.max"
// //                   type="number"
// //                   value={formData.experienceRequired.max}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['experienceRequired.max'] && !!fieldErrors['experienceRequired.max']}
// //                   helperText={touched['experienceRequired.max'] ? fieldErrors['experienceRequired.max'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: formData.experienceRequired.min }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //             </Grid>

// //             {/* Salary Range */}
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} md={4}>
// //                 <TextField
// //                   fullWidth
// //                   label="Min Salary"
// //                   name="salaryRange.min"
// //                   type="number"
// //                   value={formData.salaryRange.min}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['salaryRange.min'] && !!fieldErrors['salaryRange.min']}
// //                   helperText={touched['salaryRange.min'] ? fieldErrors['salaryRange.min'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: 0 }}
// //                   InputProps={{
// //                     startAdornment: (
// //                       <InputAdornment position="start">
// //                         <AttachMoneyIcon sx={{ color: '#64748b' }} />
// //                       </InputAdornment>
// //                     ),
// //                   }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={4}>
// //                 <TextField
// //                   fullWidth
// //                   label="Max Salary"
// //                   name="salaryRange.max"
// //                   type="number"
// //                   value={formData.salaryRange.max}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched['salaryRange.max'] && !!fieldErrors['salaryRange.max']}
// //                   helperText={touched['salaryRange.max'] ? fieldErrors['salaryRange.max'] : ''}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   inputProps={{ min: formData.salaryRange.min }}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12} md={4}>
// //                 <FormControl fullWidth>
// //                   <InputLabel>Currency</InputLabel>
// //                   <Select
// //                     name="salaryRange.currency"
// //                     value={formData.salaryRange.currency}
// //                     onChange={handleChange}
// //                     label="Currency"
// //                     disabled={loading}
// //                     sx={{ borderRadius: 1 }}
// //                     MenuProps={selectMenuProps}
// //                   >
// //                     <MenuItem value="INR">INR</MenuItem>
// //                     <MenuItem value="USD">USD</MenuItem>
// //                     <MenuItem value="EUR">EUR</MenuItem>
// //                     <MenuItem value="GBP">GBP</MenuItem>
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //             </Grid>

// //             {/* Skills */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Required Skills
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={skillInput}
// //                   onChange={(e) => setSkillInput(e.target.value)}
// //                   placeholder="Add a skill (e.g., Lathe operation)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddSkill}
// //                   disabled={!skillInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                      color: '#fff !important', 
// //                      background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 }
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>
// //               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
// //                 {formData.skills.map((skill, index) => (
// //                   <Chip
// //                     key={index}
// //                     label={skill}
// //                     onDelete={() => handleRemoveSkill(index)}
// //                     icon={<BuildIcon />}
// //                     variant="outlined"
// //                     size="small"
// //                     sx={{ borderRadius: 1 }}
// //                   />
// //                 ))}
// //               </Box>
// //             </Box>

// //             {/* Education */}
// //             <Box>
// //               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
// //                 Education Requirements
// //               </Typography>
// //               <Stack direction="row" spacing={1} mb={1}>
// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   value={educationInput}
// //                   onChange={(e) => setEducationInput(e.target.value)}
// //                   placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
// //                   disabled={loading}
// //                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
// //                 />
// //                 <Button
// //                   variant="contained"
// //                   onClick={handleAddEducation}
// //                   disabled={!educationInput.trim() || loading}
// //                   sx={{
// //                     borderRadius: 1,
// //                     textTransform: 'none',
// //                     color:'#fff !important',
// //                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                     '&:hover': { opacity: 0.9 }
// //                   }}
// //                 >
// //                   Add
// //                 </Button>
// //               </Stack>
// //               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
// //                 {formData.education.map((edu, index) => (
// //                   <Chip
// //                     key={index}
// //                     label={edu}
// //                     onDelete={() => handleRemoveEducation(index)}
// //                     icon={<SchoolIcon />}
// //                     variant="outlined"
// //                     size="small"
// //                     sx={{ borderRadius: 1 }}
// //                   />
// //                 ))}
// //               </Box>
// //             </Box>
// //           </>
// //         );

// //       case 2:
// //         return (
// //           <>
// //             <FormControl fullWidth error={touched.publishTo && !!fieldErrors.publishTo}>
// //               <InputLabel>Publish To *</InputLabel>
// //               <Select
// //                 multiple
// //                 value={formData.publishTo}
// //                 onChange={handlePublishChange}
// //                 onBlur={handleBlur}
// //                 input={<OutlinedInput label="Publish To *" />}
// //                 disabled={loading}
// //                 sx={{ borderRadius: 1 }}
// //                 MenuProps={selectMenuProps}
// //                 renderValue={(selected) => (
// //                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
// //                     {selected.map((value) => (
// //                       <Chip
// //                         key={value}
// //                         label={publishPlatforms.find(p => p.value === value)?.label || value}
// //                         size="small"
// //                         sx={{ borderRadius: 1 }}
// //                       />
// //                     ))}
// //                   </Box>
// //                 )}
// //               >
// //                 {publishPlatforms.map((platform) => (
// //                   <MenuItem key={platform.value} value={platform.value}>
// //                     <Checkbox checked={formData.publishTo.indexOf(platform.value) > -1} />
// //                     <ListItemText primary={platform.label} />
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //               {touched.publishTo && fieldErrors.publishTo && (
// //                 <FormHelperText>{fieldErrors.publishTo}</FormHelperText>
// //               )}
// //               <FormHelperText>Select where to publish this job opening</FormHelperText>
// //             </FormControl>

// //             <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
// //               <Stack spacing={1}>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                   <InfoIcon sx={{ color: '#0288d1', fontSize: 18 }} />
// //                   <Typography variant="body2" fontWeight={500} sx={{ color: '#0288d1' }}>
// //                     Note:
// //                   </Typography>
// //                 </Box>
// //                 <Typography variant="body2" sx={{ color: '#475569', pl: 3.5 }}>
// //                   The job will be created in draft status first. You can review and publish it later from the job listings page.
// //                 </Typography>
// //               </Stack>
// //             </Paper>
// //           </>
// //         );

// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <Dialog
// //       open={open}
// //       onClose={handleClose}
// //       maxWidth="md"
// //       fullWidth
// //       PaperProps={{
// //         sx: { borderRadius: 2, maxHeight: '90vh' }
// //       }}
// //     >
// //       {/* Attractive Header */}
// //       <DialogTitle sx={{
// //         borderBottom: '1px solid #E0E0E0',
// //         pb: 2,
// //         background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //         color: '#fff'
// //       }}>
// //         <Stack direction="row" alignItems="center" spacing={1}>
// //           <WorkIcon />
// //           <Typography variant="h6" fontWeight={600}>
// //             Add Job Opening
// //           </Typography>
// //         </Stack>
// //       </DialogTitle>

// //       <DialogContent sx={{ pt: 3, overflowY: 'auto' }}>
// //         <Stack spacing={3}>
// //           {/* Stepper */}
// //           <Box sx={{ width: '100%', mb: 2, pt: 2 }}>
// //             <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
// //               {steps.map((label) => (
// //                 <Step key={label}>
// //                   <StepLabel>
// //                     <Typography variant="caption" fontWeight={500}>
// //                       {label}
// //                     </Typography>
// //                   </StepLabel>
// //                 </Step>
// //               ))}
// //             </Stepper>
// //           </Box>

// //           {/* Step Content */}
// //           <Paper elevation={0} sx={{ p: 3, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
// //             <Stack spacing={3}>
// //               {renderStepContent()}

// //               {error && (
// //                 <Alert
// //                   severity="error"
// //                   sx={{
// //                     borderRadius: 1,
// //                     '& .MuiAlert-icon': {
// //                       alignItems: 'center'
// //                     }
// //                   }}
// //                 >
// //                   {error}
// //                 </Alert>
// //               )}
// //             </Stack>
// //           </Paper>
// //         </Stack>
// //       </DialogContent>

// //       <DialogActions sx={{
// //         px: 2,
// //         // pb: 3,
// //         borderTop: '1px solid #E0E0E0',
// //         // pt: 2,
// //         backgroundColor: '#F8FAFC',
// //         justifyContent: 'space-between'
// //       }}>
// //         <Button
// //           onClick={handleClose}
// //           disabled={loading}
// //           sx={{
// //             borderRadius: 1,
// //             px: 3,
// //             py: 1,
// //             textTransform: 'none',
// //             fontWeight: 500,
// //             border: '1px solid #cbd5e1',
// //             color: '#475569'
// //           }}
// //         >
// //           Cancel
// //         </Button>

// //         <Stack direction="row" spacing={2}>
// //           {activeStep > 0 && (
// //             <Button
// //               onClick={handleBack}
// //               disabled={loading || requisitionLoading}
// //               startIcon={<ArrowBackIcon />}
// //               sx={{
// //                 borderRadius: 1,
// //                 px: 3,
// //                 py: 1,
// //                 textTransform: 'none',
// //                 fontWeight: 500
// //               }}
// //             >
// //               Back
// //             </Button>
// //           )}

// //           {activeStep < steps.length - 1 ? (
// //             <Button
// //               variant="contained"
// //               onClick={handleNext}
// //               disabled={loading || requisitionLoading}
// //               endIcon={<ArrowForwardIcon />}
// //               sx={{
// //                 borderRadius: 1,
// //                 px: 3,
// //                 py: 1,
// //                 textTransform: 'none',
// //                 fontWeight: 500,
// //                 background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                 '&:hover': {
// //                   opacity: 0.9
// //                 }
// //               }}
// //             >
// //               Next
// //             </Button>
// //           ) : (
// //             <Button
// //               variant="contained"
// //               onClick={handleSubmit}
// //               disabled={loading || requisitionLoading}
// //               startIcon={loading ? null : <AddIcon />}
// //               sx={{
// //                 borderRadius: 1,
// //                 px: 3,
// //                 py: 1,
// //                 textTransform: 'none',
// //                 fontWeight: 500,
// //                 background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
// //                 '&:hover': {
// //                   opacity: 0.9
// //                 }
// //               }}
// //             >
// //               {loading ? 'Creating...' : 'Create Job Opening'}
// //             </Button>
// //           )}
// //         </Stack>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default AddJobOpening;
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
//   MenuItem,
//   Grid,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Typography,
//   styled,
//   StepConnector,
//   Chip,
//   OutlinedInput,
//   FormControl,
//   InputLabel,
//   Select,
//   FormHelperText,
//   Checkbox,
//   ListItemText,
//   Divider,
//   Paper,
//   InputAdornment
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Work as WorkIcon,
//   Business as BusinessIcon,
//   LocationOn as LocationIcon,
//   AttachMoney as AttachMoneyIcon,
//   School as SchoolIcon,
//   Build as BuildIcon,
//   Info as InfoIcon,
//   ArrowBack as ArrowBackIcon,
//   ArrowForward as ArrowForwardIcon,
//   Search as SearchIcon,
//   Error as ErrorIcon,
//   Warning as WarningIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// /* ------------------- Custom Stepper Styling ------------------- */
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   '& .MuiStepConnector-line': {
//     height: 4,
//     border: 0,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//   },
//   '&.Mui-active .MuiStepConnector-line': {
//     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//   },
//   '&.Mui-completed .MuiStepConnector-line': {
//     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//   },
// }));

// // Custom styled Paper component for dropdown without scrollbars
// const CustomPaper = styled(Paper)({
//   maxHeight: 200,
//   overflow: 'auto',
//   '&::-webkit-scrollbar': {
//     display: 'none'
//   },
//   scrollbarWidth: 'none',
//   '-ms-overflow-style': 'none',
//   '& .MuiAutocomplete-listbox': {
//     '&::-webkit-scrollbar': {
//       display: 'none'
//     },
//     scrollbarWidth: 'none',
//     '-ms-overflow-style': 'none'
//   }
// });

// // Custom styled MenuProps for Select components
// const selectMenuProps = {
//   PaperProps: {
//     sx: {
//       maxHeight: 200,
//       overflow: 'auto',
//       '&::-webkit-scrollbar': {
//         display: 'none'
//       },
//       scrollbarWidth: 'none',
//       '-ms-overflow-style': 'none'
//     }
//   }
// };

// const steps = ["Basic Information", "Job Details", "Publish Settings"];

// // Available platforms for publishing
// const publishPlatforms = [
//   { value: 'careerPage', label: 'Career Page' },
//   { value: 'naukri', label: 'Naukri.com' },
//   { value: 'linkedin', label: 'LinkedIn' },
//   { value: 'indeed', label: 'Indeed' },
// ];

// const AddJobOpening = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [requisitions, setRequisitions] = useState([]);
//   const [requisitionLoading, setRequisitionLoading] = useState(false);
//   const [selectedRequisition, setSelectedRequisition] = useState(null);
//   const [requisitionSearch, setRequisitionSearch] = useState('');

//   const [formData, setFormData] = useState({
//     requisitionId: '',
//     description: '',
//     companyIntro: '',
//     requirements: [],
//     responsibilities: [],
//     publishTo: [],
//     location: '',
//     department: '',
//     employmentType: 'Permanent',
//     experienceRequired: {
//       min: 0,
//       max: 0
//     },
//     salaryRange: {
//       min: 0,
//       max: 0,
//       currency: 'INR'
//     },
//     skills: [],
//     education: []
//   });

//   // Temporary input fields for dynamic arrays
//   const [requirementInput, setRequirementInput] = useState('');
//   const [responsibilityInput, setResponsibilityInput] = useState('');
//   const [skillInput, setSkillInput] = useState('');
//   const [educationInput, setEducationInput] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [stepErrors, setStepErrors] = useState({});

//   const [departments, setDepartments] = useState([]);
//   const [departmentsLoading, setDepartmentsLoading] = useState(false);

//   // Touched fields for validation
//   const [touched, setTouched] = useState({});

//   useEffect(() => {
//     if (open) fetchRequisitions();
//     fetchDepartments();
//   }, [open]);

//   const fetchRequisitions = async () => {
//     try {
//       setRequisitionLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/requisitions?status=approved`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setRequisitions(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching requisitions:', error);
//     } finally {
//       setRequisitionLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       setDepartmentsLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/departments`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       if (response.data.success) {
//         setDepartments(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching departments: ', error);
//     } finally {
//       setDepartmentsLoading(false);
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Handle nested objects
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     // Clear field error when user types
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({
//       ...prev,
//       [name]: true
//     }));

//     // Validate field on blur
//     validateField(name, formData[name]);
//   };

//   const validateField = (fieldName, value) => {
//     let error = '';

//     switch (fieldName) {
//       case 'requisitionId':
//         if (!value) error = 'Please select a requisition';
//         break;
//       case 'companyIntro':
//         if (!value?.trim()) error = 'Company introduction is required';
//         break;
//       case 'location':
//         if (!value?.trim()) error = 'Location is required';
//         break;
//       case 'department':
//         if (!value?.trim()) error = 'Department is required';
//         break;
//       case 'employmentType':
//         if (!value) error = 'Employment type is required';
//         break;
//       case 'description':
//         if (!value?.trim()) error = 'Job description is required';
//         break;
//       case 'experienceRequired.min':
//         if (value < 0) error = 'Minimum experience cannot be negative';
//         break;
//       case 'experienceRequired.max':
//         if (value < formData.experienceRequired.min) error = 'Maximum experience must be greater than or equal to minimum';
//         break;
//       case 'salaryRange.min':
//         if (value < 0) error = 'Minimum salary cannot be negative';
//         break;
//       case 'salaryRange.max':
//         if (value < formData.salaryRange.min) error = 'Maximum salary must be greater than or equal to minimum';
//         break;
//       default:
//         break;
//     }

//     setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
//     return error;
//   };

//   const handleRequisitionChange = (e) => {
//     const requisitionId = e.target.value;
//     setFormData(prev => ({ ...prev, requisitionId }));

//     // Auto-fill job details from selected requisition
//     const selected = requisitions.find(req => req._id === requisitionId);
//     if (selected) {
//       setSelectedRequisition(selected);

//       // Auto-populate fields from requisition
//       setFormData(prev => ({
//         ...prev,
//         requisitionId: selected._id,
//         location: selected.location || '',
//         department: selected.department || '',
//         employmentType: selected.employmentType || 'Permanent',
//         experienceRequired: {
//           min: selected.experienceYears || 0,
//           max: (selected.experienceYears || 0) + 2
//         },
//         salaryRange: {
//           min: selected.budgetMin || 0,
//           max: selected.budgetMax || 0,
//           currency: 'INR'
//         },
//         skills: selected.skills || [],
//         education: selected.education ? [selected.education] : []
//       }));
//     }

//     // Clear field error
//     if (fieldErrors.requisitionId) {
//       setFieldErrors(prev => ({ ...prev, requisitionId: '' }));
//     }
//   };

//   // Handle requirements
//   const handleAddRequirement = () => {
//     if (requirementInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         requirements: [...prev.requirements, requirementInput.trim()]
//       }));
//       setRequirementInput('');
//       // Clear requirement error if exists
//       if (fieldErrors.requirements) {
//         setFieldErrors(prev => ({ ...prev, requirements: '' }));
//       }
//     }
//   };

//   const handleRemoveRequirement = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       requirements: prev.requirements.filter((_, i) => i !== index)
//     }));

//     // Add error if requirements become empty
//     if (formData.requirements.length === 1) {
//       setFieldErrors(prev => ({ ...prev, requirements: 'Please add at least one requirement' }));
//     }
//   };

//   // Handle responsibilities
//   const handleAddResponsibility = () => {
//     if (responsibilityInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
//       }));
//       setResponsibilityInput('');
//       // Clear responsibility error if exists
//       if (fieldErrors.responsibilities) {
//         setFieldErrors(prev => ({ ...prev, responsibilities: '' }));
//       }
//     }
//   };

//   const handleRemoveResponsibility = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       responsibilities: prev.responsibilities.filter((_, i) => i !== index)
//     }));

//     // Add error if responsibilities become empty
//     if (formData.responsibilities.length === 1) {
//       setFieldErrors(prev => ({ ...prev, responsibilities: 'Please add at least one responsibility' }));
//     }
//   };

//   // Handle skills
//   const handleAddSkill = () => {
//     if (skillInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, skillInput.trim()]
//       }));
//       setSkillInput('');
//     }
//   };

//   const handleRemoveSkill = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle education
//   const handleAddEducation = () => {
//     if (educationInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         education: [...prev.education, educationInput.trim()]
//       }));
//       setEducationInput('');
//     }
//   };

//   const handleRemoveEducation = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle publish platforms
//   const handlePublishChange = (event) => {
//     const { value } = event.target;
//     setFormData(prev => ({
//       ...prev,
//       publishTo: value
//     }));
//     // Clear publish error if exists
//     if (fieldErrors.publishTo) {
//       setFieldErrors(prev => ({ ...prev, publishTo: '' }));
//     }
//   };

//   // Validation functions for each step
//   const validateStep0 = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.requisitionId) {
//       errors.requisitionId = 'Please select a requisition';
//       isValid = false;
//     }
//     if (!formData.companyIntro?.trim()) {
//       errors.companyIntro = 'Company introduction is required';
//       isValid = false;
//     }
//     if (!formData.location?.trim()) {
//       errors.location = 'Location is required';
//       isValid = false;
//     }
//     if (!formData.department?.trim()) {
//       errors.department = 'Department is required';
//       isValid = false;
//     }
//     if (!formData.employmentType) {
//       errors.employmentType = 'Employment type is required';
//       isValid = false;
//     }

//     setFieldErrors(prev => ({ ...prev, ...errors }));

//     if (!isValid) {
//       setStepErrors(prev => ({
//         ...prev,
//         [activeStep]: 'Please fill in all required fields correctly'
//       }));
//     } else {
//       setStepErrors(prev => ({ ...prev, [activeStep]: '' }));
//     }

//     return isValid;
//   };

//   const validateStep1 = () => {
//     const errors = {};
//     let isValid = true;

//     // Job Description validation
//     if (!formData.description?.trim()) {
//       errors.description = 'Job description is required';
//       isValid = false;
//     }

//     // Requirements validation
//     if (formData.requirements.length === 0) {
//       errors.requirements = 'Please add at least one requirement';
//       isValid = false;
//     }

//     // Responsibilities validation
//     if (formData.responsibilities.length === 0) {
//       errors.responsibilities = 'Please add at least one responsibility';
//       isValid = false;
//     }

//     // Experience validation
//     if (formData.experienceRequired.min < 0) {
//       errors['experienceRequired.min'] = 'Minimum experience cannot be negative';
//       isValid = false;
//     }
//     if (formData.experienceRequired.max < formData.experienceRequired.min) {
//       errors['experienceRequired.max'] = 'Maximum experience must be greater than or equal to minimum';
//       isValid = false;
//     }

//     // Salary validation
//     if (formData.salaryRange.min < 0) {
//       errors['salaryRange.min'] = 'Minimum salary cannot be negative';
//       isValid = false;
//     }
//     if (formData.salaryRange.max < formData.salaryRange.min) {
//       errors['salaryRange.max'] = 'Maximum salary must be greater than or equal to minimum';
//       isValid = false;
//     }

//     setFieldErrors(prev => ({ ...prev, ...errors }));

//     if (!isValid) {
//       setStepErrors(prev => ({
//         ...prev,
//         [activeStep]: 'Please fill in all required fields correctly'
//       }));
//     } else {
//       setStepErrors(prev => ({ ...prev, [activeStep]: '' }));
//     }

//     return isValid;
//   };

//   const validateStep2 = () => {
//     const errors = {};
//     let isValid = true;

//     if (formData.publishTo.length === 0) {
//       errors.publishTo = 'Please select at least one platform to publish';
//       isValid = false;
//     }

//     setFieldErrors(prev => ({ ...prev, ...errors }));

//     if (!isValid) {
//       setStepErrors(prev => ({
//         ...prev,
//         [activeStep]: 'Please select at least one publishing platform'
//       }));
//     } else {
//       setStepErrors(prev => ({ ...prev, [activeStep]: '' }));
//     }

//     return isValid;
//   };

//   const handleNext = () => {
//     let isValid = false;

//     switch (activeStep) {
//       case 0:
//         isValid = validateStep0();
//         break;
//       case 1:
//         isValid = validateStep1();
//         break;
//       case 2:
//         isValid = validateStep2();
//         break;
//       default:
//         isValid = true;
//     }

//     if (isValid) {
//       setActiveStep(prev => prev + 1);
//       setError('');
//     }
//   };

//   const handleBack = () => {
//     setActiveStep(prev => prev - 1);
//     setError('');
//     setStepErrors(prev => ({ ...prev, [activeStep - 1]: '' }));
//   };

//   const handleSubmit = async () => {
//     // Validate all steps before submission
//     const isStep0Valid = validateStep0();
//     const isStep1Valid = validateStep1();
//     const isStep2Valid = validateStep2();

//     if (!isStep0Valid || !isStep1Valid || !isStep2Valid) {
//       setError('Please complete all steps correctly before submitting');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setFieldErrors({});

//     const payload = {
//       requisitionId: formData.requisitionId,
//       description: formData.description || '',
//       companyIntro: formData.companyIntro || '',
//       requirements: formData.requirements.length > 0 ? formData.requirements : ['Minimum experience required'],
//       responsibilities: formData.responsibilities.length > 0 ? formData.responsibilities : ['Perform assigned duties'],
//       publishTo: formData.publishTo,
//       location: formData.location || 'Not specified',
//       department: formData.department || 'Not specified',
//       employmentType: formData.employmentType || 'Permanent',
//       experienceRequired: {
//         min: Number(formData.experienceRequired.min) || 0,
//         max: Number(formData.experienceRequired.max) || 0
//       },
//       salaryRange: {
//         min: Number(formData.salaryRange.min) || 0,
//         max: Number(formData.salaryRange.max) || 0,
//         currency: formData.salaryRange.currency || 'INR'
//       },
//       skills: formData.skills.length > 0 ? formData.skills : [],
//       education: formData.education.length > 0 ? formData.education : []
//     };

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${BASE_URL}/api/jobs`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onAdd(response.data.data);
//         onClose();
//         // Reset form
//         setActiveStep(0);
//         setFormData({
//           requisitionId: '',
//           description: '',
//           companyIntro: '',
//           requirements: [],
//           responsibilities: [],
//           publishTo: [],
//           location: '',
//           department: '',
//           employmentType: 'Permanent',
//           experienceRequired: { min: 0, max: 0 },
//           salaryRange: { min: 0, max: 0, currency: 'INR' },
//           skills: [],
//           education: []
//         });
//         setSelectedRequisition(null);
//         setError('');
//         setFieldErrors({});
//         setStepErrors({});
//         setTouched({});
//       }
//     } catch (err) {
//       console.error('Error creating job:', err);

//       if (err.response) {
//         if (err.response.status === 400) {
//           const serverError = err.response.data;
//           if (serverError.message?.includes('Duplicate') ||
//             serverError.message?.includes('duplicate') ||
//             serverError.message?.includes('already exists')) {
//             setError('Duplicate job ID. Please try again.');
//           } else if (serverError.errors) {
//             const serverFieldErrors = {};
//             Object.keys(serverError.errors).forEach(key => {
//               serverFieldErrors[key] = serverError.errors[key].message;
//             });
//             setFieldErrors(serverFieldErrors);
//             setError('Please check the form for errors');
//           } else if (serverError.message) {
//             setError(serverError.message);
//           } else {
//             setError('Failed to create job opening. Please check all fields and try again.');
//           }
//         } else if (err.response.status === 500) {
//           setError('Server error. Please try again later or contact support.');
//         }
//       } else if (err.request) {
//         setError('No response from server. Please check your network connection.');
//       } else {
//         setError('Failed to create job opening. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setActiveStep(0);
//     setFormData({
//       requisitionId: '',
//       description: '',
//       companyIntro: '',
//       requirements: [],
//       responsibilities: [],
//       publishTo: [],
//       location: '',
//       department: '',
//       employmentType: 'Permanent',
//       experienceRequired: { min: 0, max: 0 },
//       salaryRange: { min: 0, max: 0, currency: 'INR' },
//       skills: [],
//       education: []
//     });
//     setSelectedRequisition(null);
//     setError('');
//     setFieldErrors({});
//     setStepErrors({});
//     setTouched({});
//     setRequisitionSearch('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Render step content
//   const renderStepContent = () => {
//     switch (activeStep) {
//       case 0:
//         return (
//           <>
//             <FormControl fullWidth error={touched.requisitionId && !!fieldErrors.requisitionId}>
//               <InputLabel>Select Requisition *</InputLabel>
//               <Select
//                 value={formData.requisitionId}
//                 onChange={handleRequisitionChange}
//                 onBlur={handleBlur}
//                 label="Select Requisition *"
//                 error={touched.requisitionId && !!fieldErrors.requisitionId}
//                 disabled={loading || requisitionLoading}
//                 sx={{ borderRadius: 1 }}
//                 MenuProps={selectMenuProps}
//               >
//                 {requisitionLoading ? (
//                   <MenuItem disabled>
//                     <CircularProgress size={18} sx={{ mr: 1 }} />
//                     Loading...
//                   </MenuItem>
//                 ) : requisitions.length > 0 ? (
//                   requisitions.map(req => (
//                     <MenuItem key={req._id} value={req._id}>
//                       {req.requisitionId} - {req.positionTitle || req.jobTitle} ({req.department})
//                     </MenuItem>
//                   ))
//                 ) : (
//                   <MenuItem disabled>No requisitions found</MenuItem>
//                 )}
//               </Select>
//               {touched.requisitionId && fieldErrors.requisitionId && (
//                 <FormHelperText error>{fieldErrors.requisitionId}</FormHelperText>
//               )}
//             </FormControl>

//             <TextField
//               fullWidth
//               label="Company Introduction *"
//               name="companyIntro"
//               multiline
//               rows={2}
//               value={formData.companyIntro}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.companyIntro && !!fieldErrors.companyIntro}
//               helperText={touched.companyIntro ? fieldErrors.companyIntro || 'Brief introduction about your company' : 'Brief introduction about your company'}
//               disabled={loading}
//               size="medium"
//               variant="outlined"
//               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//             />

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Location *"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.location && !!fieldErrors.location}
//                   helperText={touched.location ? fieldErrors.location || 'e.g., Plant Unit A' : 'e.g., Plant Unit A'}
//                   disabled={loading}
//                   size="medium"
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LocationIcon sx={{ color: '#64748b' }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth error={touched.department && !!fieldErrors.department}>
//                   <InputLabel>Department *</InputLabel>
//                   <Select
//                     name="department"
//                     value={formData.department}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     label="Department *"
//                     disabled={loading || departmentsLoading}
//                     sx={{ borderRadius: 1, width: 250 }}
//                     MenuProps={selectMenuProps}
//                   >
//                     {departmentsLoading ? (
//                       <MenuItem disabled>
//                         <CircularProgress size={18} sx={{ mr: 1 }} />
//                         Loading...
//                       </MenuItem>
//                     ) : departments.length > 0 ? (
//                       departments.map(dept => (
//                         <MenuItem key={dept._id} value={dept.DepartmentName}>
//                           {dept.DepartmentName}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>No departments found</MenuItem>
//                     )}
//                   </Select>
//                   {touched.department && fieldErrors.department && (
//                     <FormHelperText error>{fieldErrors.department}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControl fullWidth error={touched.employmentType && !!fieldErrors.employmentType}>
//                   <InputLabel>Employment Type *</InputLabel>
//                   <Select
//                     name="employmentType"
//                     value={formData.employmentType}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     label="Employment Type *"
//                     disabled={loading}
//                     sx={{ borderRadius: 1 }}
//                     MenuProps={selectMenuProps}
//                   >
//                     <MenuItem value="Permanent">Permanent</MenuItem>
//                     <MenuItem value="Contract">Contract</MenuItem>
//                     <MenuItem value="Temporary">Temporary</MenuItem>
//                     <MenuItem value="Internship">Internship</MenuItem>
//                   </Select>
//                   {touched.employmentType && fieldErrors.employmentType && (
//                     <FormHelperText>{fieldErrors.employmentType}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </>
//         );

//       case 1:
//         return (
//           <>
//             <TextField
//               fullWidth
//               label="Job Description *"
//               name="description"
//               multiline
//               rows={2}
//               value={formData.description}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.description && !!fieldErrors.description}
//               helperText={touched.description ? fieldErrors.description || 'Detailed description of the job role' : 'Detailed description of the job role'}
//               disabled={loading}
//               size="medium"
//               variant="outlined"
//               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//             />

//             {/* Requirements Section */}
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
//                 Requirements <span style={{ color: '#d32f2f' }}>*</span>
//               </Typography>
//               <Stack direction="row" spacing={1} mb={1}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={requirementInput}
//                   onChange={(e) => setRequirementInput(e.target.value)}
//                   placeholder="Add a requirement (e.g., Minimum 2 years experience)"
//                   disabled={loading}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleAddRequirement}
//                   disabled={!requirementInput.trim() || loading}
//                   sx={{
//                     borderRadius: 1,
//                     textTransform: 'none',
//                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                     color: '#fff !important',
//                     '&:hover': { opacity: 0.9 },
//                     minWidth: 80
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               {/* Dynamic Requirements List */}
//               {formData.requirements.length > 0 && (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: 1,
//                     mb: 2,
//                     p: 1,
//                     backgroundColor: '#f5f5f5',
//                     borderRadius: 1
//                   }}
//                 >
//                   {formData.requirements.map((req, index) => (
//                     <Chip
//                       key={index}
//                       label={req}
//                       onDelete={() => handleRemoveRequirement(index)}
//                       color="primary"
//                       variant="outlined"
//                       size="small"
//                       sx={{ borderRadius: 1 }}
//                     />
//                   ))}
//                 </Box>
//               )}

//               {fieldErrors.requirements && (
//                 <FormHelperText error sx={{ mt: 0.5 }}>{fieldErrors.requirements}</FormHelperText>
//               )}
//             </Box>

//             {/* Responsibilities Section */}
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
//                 Responsibilities <span style={{ color: '#d32f2f' }}>*</span>
//               </Typography>
//               <Stack direction="row" spacing={1} mb={1}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={responsibilityInput}
//                   onChange={(e) => setResponsibilityInput(e.target.value)}
//                   placeholder="Add a responsibility (e.g., Operate production machinery)"
//                   disabled={loading}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleAddResponsibility}
//                   disabled={!responsibilityInput.trim() || loading}
//                   sx={{
//                     borderRadius: 1,
//                     textTransform: 'none',
//                     color: '#fff !important',
//                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                     '&:hover': { opacity: 0.9 },
//                     minWidth: 80
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               {/* Dynamic Responsibilities List */}
//               {formData.responsibilities.length > 0 && (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: 1,
//                     mb: 2,
//                     p: 1,
//                     backgroundColor: '#f5f5f5',
//                     borderRadius: 1
//                   }}
//                 >
//                   {formData.responsibilities.map((resp, index) => (
//                     <Chip
//                       key={index}
//                       label={resp}
//                       onDelete={() => handleRemoveResponsibility(index)}
//                       color="secondary"
//                       variant="outlined"
//                       size="small"
//                       sx={{ borderRadius: 1 }}
//                     />
//                   ))}
//                 </Box>
//               )}

//               {fieldErrors.responsibilities && (
//                 <FormHelperText error sx={{ mt: 0.5 }}>{fieldErrors.responsibilities}</FormHelperText>
//               )}
//             </Box>

//             {/* Experience Range */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Min Experience (years)"
//                   name="experienceRequired.min"
//                   type="number"
//                   value={formData.experienceRequired.min}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched['experienceRequired.min'] && !!fieldErrors['experienceRequired.min']}
//                   helperText={touched['experienceRequired.min'] ? fieldErrors['experienceRequired.min'] || '' : ''}
//                   disabled={loading}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ min: 0 }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Max Experience (years)"
//                   name="experienceRequired.max"
//                   type="number"
//                   value={formData.experienceRequired.max}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched['experienceRequired.max'] && !!fieldErrors['experienceRequired.max']}
//                   helperText={touched['experienceRequired.max'] ? fieldErrors['experienceRequired.max'] || '' : ''}
//                   disabled={loading}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ min: formData.experienceRequired.min }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Salary Range */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Min Salary"
//                   name="salaryRange.min"
//                   type="number"
//                   value={formData.salaryRange.min}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched['salaryRange.min'] && !!fieldErrors['salaryRange.min']}
//                   helperText={touched['salaryRange.min'] ? fieldErrors['salaryRange.min'] || '' : ''}
//                   disabled={loading}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ min: 0 }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <AttachMoneyIcon sx={{ color: '#64748b' }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Max Salary"
//                   name="salaryRange.max"
//                   type="number"
//                   value={formData.salaryRange.max}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched['salaryRange.max'] && !!fieldErrors['salaryRange.max']}
//                   helperText={touched['salaryRange.max'] ? fieldErrors['salaryRange.max'] || '' : ''}
//                   disabled={loading}
//                   size="medium"
//                   variant="outlined"
//                   inputProps={{ min: formData.salaryRange.min }}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Currency</InputLabel>
//                   <Select
//                     name="salaryRange.currency"
//                     value={formData.salaryRange.currency}
//                     onChange={handleChange}
//                     label="Currency"
//                     disabled={loading}
//                     sx={{ borderRadius: 1 }}
//                     MenuProps={selectMenuProps}
//                   >
//                     <MenuItem value="INR">INR</MenuItem>
//                     <MenuItem value="USD">USD</MenuItem>
//                     <MenuItem value="EUR">EUR</MenuItem>
//                     <MenuItem value="GBP">GBP</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             {/* Skills */}
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
//                 Required Skills
//               </Typography>
//               <Stack direction="row" spacing={1} mb={1}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={skillInput}
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   placeholder="Add a skill (e.g., Lathe operation)"
//                   disabled={loading}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleAddSkill}
//                   disabled={!skillInput.trim() || loading}
//                   sx={{
//                     borderRadius: 1,
//                     textTransform: 'none',
//                     color: '#fff !important',
//                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                     '&:hover': { opacity: 0.9 },
//                     minWidth: 80
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               {/* Dynamic Skills List */}
//               {formData.skills.length > 0 && (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: 1,
//                     p: 1,
//                     backgroundColor: '#f5f5f5',
//                     borderRadius: 1
//                   }}
//                 >
//                   {formData.skills.map((skill, index) => (
//                     <Chip
//                       key={index}
//                       label={skill}
//                       onDelete={() => handleRemoveSkill(index)}
//                       icon={<BuildIcon />}
//                       variant="outlined"
//                       size="small"
//                       sx={{ borderRadius: 1 }}
//                     />
//                   ))}
//                 </Box>
//               )}
//             </Box>

//             {/* Education */}
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e293b', fontWeight: 600 }}>
//                 Education Requirements
//               </Typography>
//               <Stack direction="row" spacing={1} mb={1}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={educationInput}
//                   onChange={(e) => setEducationInput(e.target.value)}
//                   placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
//                   disabled={loading}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleAddEducation}
//                   disabled={!educationInput.trim() || loading}
//                   sx={{
//                     borderRadius: 1,
//                     textTransform: 'none',
//                     color: '#fff !important',
//                     background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                     '&:hover': { opacity: 0.9 },
//                     minWidth: 80
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Stack>

//               {/* Dynamic Education List */}
//               {formData.education.length > 0 && (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: 1,
//                     p: 1,
//                     backgroundColor: '#f5f5f5',
//                     borderRadius: 1
//                   }}
//                 >
//                   {formData.education.map((edu, index) => (
//                     <Chip
//                       key={index}
//                       label={edu}
//                       onDelete={() => handleRemoveEducation(index)}
//                       icon={<SchoolIcon />}
//                       variant="outlined"
//                       size="small"
//                       sx={{ borderRadius: 1 }}
//                     />
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           </>
//         );

//       case 2:
//         return (
//           <>
//             <FormControl fullWidth error={touched.publishTo && !!fieldErrors.publishTo}>
//               <InputLabel>Publish To *</InputLabel>
//               <Select
//                 multiple
//                 value={formData.publishTo}
//                 onChange={handlePublishChange}
//                 onBlur={handleBlur}
//                 input={<OutlinedInput label="Publish To *" />}
//                 disabled={loading}
//                 sx={{ borderRadius: 1 }}
//                 MenuProps={selectMenuProps}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                     {selected.map((value) => (
//                       <Chip
//                         key={value}
//                         label={publishPlatforms.find(p => p.value === value)?.label || value}
//                         size="small"
//                         sx={{ borderRadius: 1 }}
//                       />
//                     ))}
//                   </Box>
//                 )}
//               >
//                 {publishPlatforms.map((platform) => (
//                   <MenuItem key={platform.value} value={platform.value}>
//                     <Checkbox checked={formData.publishTo.indexOf(platform.value) > -1} />
//                     <ListItemText primary={platform.label} />
//                   </MenuItem>
//                 ))}
//               </Select>
//               {touched.publishTo && fieldErrors.publishTo && (
//                 <FormHelperText error>{fieldErrors.publishTo}</FormHelperText>
//               )}
//               <FormHelperText>Select where to publish this job opening</FormHelperText>
//             </FormControl>

//             <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
//               <Stack spacing={1}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <InfoIcon sx={{ color: '#0288d1', fontSize: 18 }} />
//                   <Typography variant="body2" fontWeight={500} sx={{ color: '#0288d1' }}>
//                     Note:
//                   </Typography>
//                 </Box>
//                 <Typography variant="body2" sx={{ color: '#475569', pl: 3.5 }}>
//                   The job will be created in draft status first. You can review and publish it later from the job listings page.
//                 </Typography>
//               </Stack>
//             </Paper>
//           </>
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
//         sx: { borderRadius: 2, maxHeight: '90vh' }
//       }}
//     >
//       {/* Attractive Header */}
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         pb: 2,
//         background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//         color: '#fff'
//       }}>
//         <Stack direction="row" alignItems="center" spacing={1}>
//           <WorkIcon />
//           <Typography variant="h6" fontWeight={600}>
//             Add Job Opening
//           </Typography>
//         </Stack>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3, overflowY: 'auto' }}>
//         <Stack spacing={3}>
//           {/* Stepper */}
//           <Box sx={{ width: '100%', mb: 2, pt: 2 }}>
//             <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
//               {steps.map((label, index) => (
//                 <Step key={label}>
//                   <StepLabel
//                     StepIconProps={{
//                       error: stepErrors[index] ? true : false
//                     }}
//                   >
//                     <Typography variant="caption" fontWeight={500}>
//                       {label}
//                     </Typography>
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>
//           </Box>

//           {/* Step Content */}
//           <Paper elevation={0} sx={{ p: 3, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//             <Stack spacing={3}>
//               {renderStepContent()}

//               {/* Step Error Display */}
//               {stepErrors[activeStep] && (
//                 <Alert
//                   severity="warning"
//                   icon={<WarningIcon />}
//                   sx={{
//                     borderRadius: 1,
//                     '& .MuiAlert-icon': {
//                       alignItems: 'center'
//                     }
//                   }}
//                 >
//                   {stepErrors[activeStep]}
//                 </Alert>
//               )}

//               {/* General Error Display */}
//               {error && (
//                 <Alert
//                   severity="error"
//                   sx={{
//                     borderRadius: 1,
//                     '& .MuiAlert-icon': {
//                       alignItems: 'center'
//                     }
//                   }}
//                 >
//                   {error}
//                 </Alert>
//               )}
//             </Stack>
//           </Paper>
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleClose}
//           disabled={loading}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500,
//             border: '1px solid #cbd5e1',
//             color: '#475569'
//           }}
//         >
//           Cancel
//         </Button>

//         <Stack direction="row" spacing={2}>
//           {activeStep > 0 && (
//             <Button
//               onClick={handleBack}
//               disabled={loading || requisitionLoading}
//               startIcon={<ArrowBackIcon />}
//               sx={{
//                 borderRadius: 1,
//                 px: 3,
//                 py: 1,
//                 textTransform: 'none',
//                 fontWeight: 500
//               }}
//             >
//               Back
//             </Button>
//           )}

//           {activeStep < steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading || requisitionLoading}
//               endIcon={<ArrowForwardIcon />}
//               sx={{
//                 borderRadius: 1,
//                 px: 3,
//                 py: 1,
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                 '&:hover': {
//                   opacity: 0.9
//                 }
//               }}
//             >
//               Next
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || requisitionLoading}
//               startIcon={loading ? null : <AddIcon />}
//               sx={{
//                 borderRadius: 1,
//                 px: 3,
//                 py: 1,
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//                 '&:hover': {
//                   opacity: 0.9
//                 }
//               }}
//             >
//               {loading ? 'Creating...' : 'Create Job Opening'}
//             </Button>
//           )}
//         </Stack>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddJobOpening;

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
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Checkbox,
  ListItemText,
  Divider,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Description as DescriptionIcon
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

// Custom styled MenuProps for Select components
const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 200,
      overflow: 'auto',
      '&::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none'
    }
  }
};

const steps = ["Basic Information", "Job Details", "Publish Settings"];

// Available platforms for publishing
const publishPlatforms = [
  { value: 'careerPage', label: 'Career Page' },
  { value: 'naukri', label: 'Naukri.com' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
];

const AddJobOpening = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [requisitions, setRequisitions] = useState([]);
  const [requisitionLoading, setRequisitionLoading] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [formData, setFormData] = useState({
    requisitionId: '',
    description: '',
    companyIntro: '',
    requirements: [],
    responsibilities: [],
    publishTo: [],
    location: '',
    department: '',
    employmentType: 'Permanent',
    experienceRequired: { min: 0, max: 0 },
    salaryRange: { min: 0, max: 0, currency: 'INR' },
    skills: [],
    education: []
  });

  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [educationInput, setEducationInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [stepErrors, setStepErrors] = useState({});

  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) fetchRequisitions();
    fetchDepartments();
  }, [open]);

  const fetchRequisitions = async () => {
    try {
      setRequisitionLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/requisitions?status=approved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRequisitions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      setRequisitionLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments: ', error);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateField = (fieldName, value) => {
    let error = '';
    switch (fieldName) {
      case 'requisitionId':
        if (!value) error = 'Please select a requisition';
        break;
      case 'companyIntro':
        if (!value?.trim()) error = 'Company introduction is required';
        break;
      case 'location':
        if (!value?.trim()) error = 'Location is required';
        break;
      case 'department':
        if (!value?.trim()) error = 'Department is required';
        break;
      case 'employmentType':
        if (!value) error = 'Employment type is required';
        break;
      case 'description':
        if (!value?.trim()) error = 'Job description is required';
        break;
      case 'experienceRequired.min':
        if (value < 0) error = 'Minimum experience cannot be negative';
        break;
      case 'experienceRequired.max':
        if (value < formData.experienceRequired.min) error = 'Maximum experience must be greater than or equal to minimum';
        break;
      case 'salaryRange.min':
        if (value < 0) error = 'Minimum salary cannot be negative';
        break;
      case 'salaryRange.max':
        if (value < formData.salaryRange.min) error = 'Maximum salary must be greater than or equal to minimum';
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const handleRequisitionChange = (e) => {
    const requisitionId = e.target.value;
    setFormData(prev => ({ ...prev, requisitionId }));
    const selected = requisitions.find(req => req._id === requisitionId);
    if (selected) {
      setSelectedRequisition(selected);
      setFormData(prev => ({
        ...prev,
        requisitionId: selected._id,
        location: selected.location || '',
        department: selected.department || '',
        employmentType: selected.employmentType || 'Permanent',
        experienceRequired: {
          min: selected.experienceYears || 0,
          max: (selected.experienceYears || 0) + 2
        },
        salaryRange: {
          min: selected.budgetMin || 0,
          max: selected.budgetMax || 0,
          currency: 'INR'
        },
        skills: selected.skills || [],
        education: selected.education ? [selected.education] : []
      }));
    }
    if (fieldErrors.requisitionId) {
      setFieldErrors(prev => ({ ...prev, requisitionId: '' }));
    }
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
      if (fieldErrors.requirements) {
        setFieldErrors(prev => ({ ...prev, requirements: '' }));
      }
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
    if (formData.requirements.length === 1) {
      setFieldErrors(prev => ({ ...prev, requirements: 'Please add at least one requirement' }));
    }
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }));
      setResponsibilityInput('');
      if (fieldErrors.responsibilities) {
        setFieldErrors(prev => ({ ...prev, responsibilities: '' }));
      }
    }
  };

  const handleRemoveResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
    if (formData.responsibilities.length === 1) {
      setFieldErrors(prev => ({ ...prev, responsibilities: 'Please add at least one responsibility' }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    if (educationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, educationInput.trim()]
      }));
      setEducationInput('');
    }
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handlePublishChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, publishTo: value }));
    if (fieldErrors.publishTo) {
      setFieldErrors(prev => ({ ...prev, publishTo: '' }));
    }
  };

  const validateStep0 = () => {
    const errors = {};
    let isValid = true;
    if (!formData.requisitionId) { errors.requisitionId = 'Please select a requisition'; isValid = false; }
    if (!formData.companyIntro?.trim()) { errors.companyIntro = 'Company introduction is required'; isValid = false; }
    if (!formData.location?.trim()) { errors.location = 'Location is required'; isValid = false; }
    if (!formData.department?.trim()) { errors.department = 'Department is required'; isValid = false; }
    if (!formData.employmentType) { errors.employmentType = 'Employment type is required'; isValid = false; }
    setFieldErrors(prev => ({ ...prev, ...errors }));
    setStepErrors(prev => ({ ...prev, [activeStep]: isValid ? '' : 'Please fill in all required fields correctly' }));
    return isValid;
  };

  const validateStep1 = () => {
    const errors = {};
    let isValid = true;
    if (!formData.description?.trim()) { errors.description = 'Job description is required'; isValid = false; }
    if (formData.requirements.length === 0) { errors.requirements = 'Please add at least one requirement'; isValid = false; }
    if (formData.responsibilities.length === 0) { errors.responsibilities = 'Please add at least one responsibility'; isValid = false; }
    if (formData.experienceRequired.min < 0) { errors['experienceRequired.min'] = 'Minimum experience cannot be negative'; isValid = false; }
    if (formData.experienceRequired.max < formData.experienceRequired.min) { errors['experienceRequired.max'] = 'Maximum experience must be greater than or equal to minimum'; isValid = false; }
    if (formData.salaryRange.min < 0) { errors['salaryRange.min'] = 'Minimum salary cannot be negative'; isValid = false; }
    if (formData.salaryRange.max < formData.salaryRange.min) { errors['salaryRange.max'] = 'Maximum salary must be greater than or equal to minimum'; isValid = false; }
    setFieldErrors(prev => ({ ...prev, ...errors }));
    setStepErrors(prev => ({ ...prev, [activeStep]: isValid ? '' : 'Please fill in all required fields correctly' }));
    return isValid;
  };

  const validateStep2 = () => {
    const errors = {};
    let isValid = true;
    if (formData.publishTo.length === 0) { errors.publishTo = 'Please select at least one platform to publish'; isValid = false; }
    setFieldErrors(prev => ({ ...prev, ...errors }));
    setStepErrors(prev => ({ ...prev, [activeStep]: isValid ? '' : 'Please select at least one publishing platform' }));
    return isValid;
  };

  const handleNext = () => {
    let isValid = false;
    switch (activeStep) {
      case 0: isValid = validateStep0(); break;
      case 1: isValid = validateStep1(); break;
      case 2: isValid = validateStep2(); break;
      default: isValid = true;
    }
    if (isValid) { setActiveStep(prev => prev + 1); setError(''); }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
    setStepErrors(prev => ({ ...prev, [activeStep - 1]: '' }));
  };

  const handleSubmit = async () => {
    const isStep0Valid = validateStep0();
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();

    if (!isStep0Valid || !isStep1Valid || !isStep2Valid) {
      setError('Please complete all steps correctly before submitting');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      requisitionId: formData.requisitionId,
      description: formData.description || '',
      companyIntro: formData.companyIntro || '',
      requirements: formData.requirements.length > 0 ? formData.requirements : ['Minimum experience required'],
      responsibilities: formData.responsibilities.length > 0 ? formData.responsibilities : ['Perform assigned duties'],
      publishTo: formData.publishTo,
      location: formData.location || 'Not specified',
      department: formData.department || 'Not specified',
      employmentType: formData.employmentType || 'Permanent',
      experienceRequired: {
        min: Number(formData.experienceRequired.min) || 0,
        max: Number(formData.experienceRequired.max) || 0
      },
      salaryRange: {
        min: Number(formData.salaryRange.min) || 0,
        max: Number(formData.salaryRange.max) || 0,
        currency: formData.salaryRange.currency || 'INR'
      },
      skills: formData.skills.length > 0 ? formData.skills : [],
      education: formData.education.length > 0 ? formData.education : []
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        onClose();
        resetForm();
      }
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.message || 'Failed to create job opening. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      requisitionId: '',
      description: '',
      companyIntro: '',
      requirements: [],
      responsibilities: [],
      publishTo: [],
      location: '',
      department: '',
      employmentType: 'Permanent',
      experienceRequired: { min: 0, max: 0 },
      salaryRange: { min: 0, max: 0, currency: 'INR' },
      skills: [],
      education: []
    });
    setSelectedRequisition(null);
    setError('');
    setFieldErrors({});
    setStepErrors({});
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={labelStyle}>Select Requisition *</Typography>
              <FormControl fullWidth size="small" error={touched.requisitionId && !!fieldErrors.requisitionId}>
                <Select
                  value={formData.requisitionId}
                  onChange={handleRequisitionChange}
                  onBlur={handleBlur}
                  displayEmpty
                  disabled={loading || requisitionLoading}
                  sx={inputStyle}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                    <em>Select a requisition</em>
                  </MenuItem>
                  {requisitionLoading ? (
                    <MenuItem disabled><CircularProgress size={16} /> Loading...</MenuItem>
                  ) : requisitions.map(req => (
                    <MenuItem key={req._id} value={req._id} sx={{ fontSize: '0.75rem' }}>
                      {req.requisitionId} - {req.positionTitle || req.jobTitle}
                    </MenuItem>
                  ))}
                </Select>
                {touched.requisitionId && fieldErrors.requisitionId && (
                  <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.requisitionId}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box>
              <Typography sx={labelStyle}>Company Introduction *</Typography>
              <TextField
                fullWidth
                name="companyIntro"
                multiline
                rows={3}
                value={formData.companyIntro}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.companyIntro && !!fieldErrors.companyIntro}
                helperText={touched.companyIntro ? fieldErrors.companyIntro : 'Brief introduction about your company'}
                disabled={loading}
                sx={inputStyle}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography sx={labelStyle}>Location *</Typography>
                  <TextField
                    fullWidth
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.location && !!fieldErrors.location}
                    helperText={touched.location ? fieldErrors.location : 'e.g., Plant Unit A'}
                    disabled={loading}
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography sx={labelStyle}>Department *</Typography>
                  <FormControl fullWidth size="small" error={touched.department && !!fieldErrors.department}>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      displayEmpty
                      disabled={loading || departmentsLoading}
                      sx={inputStyle}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select department</MenuItem>
                      {departmentsLoading ? (
                        <MenuItem disabled><CircularProgress size={16} /> Loading...</MenuItem>
                      ) : departments.map(dept => (
                        <MenuItem key={dept._id} value={dept.DepartmentName} sx={{ fontSize: '0.75rem' }}>
                          {dept.DepartmentName}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.department && fieldErrors.department && (
                      <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.department}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography sx={labelStyle}>Employment Type *</Typography>
                  <FormControl fullWidth size="small" error={touched.employmentType && !!fieldErrors.employmentType}>
                    <Select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={inputStyle}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="Permanent" sx={{ fontSize: '0.75rem' }}>Permanent</MenuItem>
                      <MenuItem value="Contract" sx={{ fontSize: '0.75rem' }}>Contract</MenuItem>
                      <MenuItem value="Temporary" sx={{ fontSize: '0.75rem' }}>Temporary</MenuItem>
                      <MenuItem value="Internship" sx={{ fontSize: '0.75rem' }}>Internship</MenuItem>
                    </Select>
                    {touched.employmentType && fieldErrors.employmentType && (
                      <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.employmentType}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={labelStyle}>Job Description *</Typography>
              <TextField
                fullWidth
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && !!fieldErrors.description}
                helperText={touched.description ? fieldErrors.description : 'Detailed description of the job role'}
                disabled={loading}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography sx={labelStyle}>Requirements *</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  placeholder="Add a requirement (e.g., Minimum 2 years experience)"
                  disabled={loading}
                  sx={inputStyle}
                />
                <Button
                  variant="contained"
                  onClick={handleAddRequirement}
                  disabled={!requirementInput.trim() || loading}
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
              </Stack>
              {formData.requirements.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  {formData.requirements.map((req, index) => (
                    <Chip
                      key={index}
                      label={req}
                      onDelete={() => handleRemoveRequirement(index)}
                      size="small"
                      sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                    />
                  ))}
                </Box>
              )}
              {fieldErrors.requirements && (
                <FormHelperText error sx={{ fontSize: '0.65rem' }}>{fieldErrors.requirements}</FormHelperText>
              )}
            </Box>

            <Box>
              <Typography sx={labelStyle}>Responsibilities *</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  placeholder="Add a responsibility (e.g., Operate production machinery)"
                  disabled={loading}
                  sx={inputStyle}
                />
                <Button
                  variant="contained"
                  onClick={handleAddResponsibility}
                  disabled={!responsibilityInput.trim() || loading}
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
              </Stack>
              {formData.responsibilities.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  {formData.responsibilities.map((resp, index) => (
                    <Chip
                      key={index}
                      label={resp}
                      onDelete={() => handleRemoveResponsibility(index)}
                      size="small"
                      sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                    />
                  ))}
                </Box>
              )}
              {fieldErrors.responsibilities && (
                <FormHelperText error sx={{ fontSize: '0.65rem' }}>{fieldErrors.responsibilities}</FormHelperText>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography sx={labelStyle}>Min Experience (years)</Typography>
                  <TextField
                    fullWidth
                    name="experienceRequired.min"
                    type="number"
                    value={formData.experienceRequired.min}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched['experienceRequired.min'] && !!fieldErrors['experienceRequired.min']}
                    helperText={touched['experienceRequired.min'] ? fieldErrors['experienceRequired.min'] : ''}
                    disabled={loading}
                    inputProps={{ min: 0 }}
                    sx={inputStyle}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography sx={labelStyle}>Max Experience (years)</Typography>
                  <TextField
                    fullWidth
                    name="experienceRequired.max"
                    type="number"
                    value={formData.experienceRequired.max}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched['experienceRequired.max'] && !!fieldErrors['experienceRequired.max']}
                    helperText={touched['experienceRequired.max'] ? fieldErrors['experienceRequired.max'] : ''}
                    disabled={loading}
                    inputProps={{ min: formData.experienceRequired.min }}
                    sx={inputStyle}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography sx={labelStyle}>Min Salary</Typography>
                  <TextField
                    fullWidth
                    name="salaryRange.min"
                    type="number"
                    value={formData.salaryRange.min}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched['salaryRange.min'] && !!fieldErrors['salaryRange.min']}
                    helperText={touched['salaryRange.min'] ? fieldErrors['salaryRange.min'] : ''}
                    disabled={loading}
                    inputProps={{ min: 0 }}
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography sx={labelStyle}>Max Salary</Typography>
                  <TextField
                    fullWidth
                    name="salaryRange.max"
                    type="number"
                    value={formData.salaryRange.max}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched['salaryRange.max'] && !!fieldErrors['salaryRange.max']}
                    helperText={touched['salaryRange.max'] ? fieldErrors['salaryRange.max'] : ''}
                    disabled={loading}
                    inputProps={{ min: formData.salaryRange.min }}
                    sx={inputStyle}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography sx={labelStyle}>Currency</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="salaryRange.currency"
                      value={formData.salaryRange.currency}
                      onChange={handleChange}
                      disabled={loading}
                      sx={inputStyle}
                    >
                      <MenuItem value="INR" sx={{ fontSize: '0.75rem' }}>INR</MenuItem>
                      <MenuItem value="USD" sx={{ fontSize: '0.75rem' }}>USD</MenuItem>
                      <MenuItem value="EUR" sx={{ fontSize: '0.75rem' }}>EUR</MenuItem>
                      <MenuItem value="GBP" sx={{ fontSize: '0.75rem' }}>GBP</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Box>
              <Typography sx={labelStyle}>Required Skills</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill (e.g., Lathe operation)"
                  disabled={loading}
                  sx={inputStyle}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim() || loading}
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
              </Stack>
              {formData.skills.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(index)}
                      size="small"
                      icon={<BuildIcon sx={{ fontSize: '0.7rem' }} />}
                      sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Box>
              <Typography sx={labelStyle}>Education Requirements</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={educationInput}
                  onChange={(e) => setEducationInput(e.target.value)}
                  placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
                  disabled={loading}
                  sx={inputStyle}
                />
                <Button
                  variant="contained"
                  onClick={handleAddEducation}
                  disabled={!educationInput.trim() || loading}
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
              </Stack>
              {formData.education.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  {formData.education.map((edu, index) => (
                    <Chip
                      key={index}
                      label={edu}
                      onDelete={() => handleRemoveEducation(index)}
                      size="small"
                      icon={<SchoolIcon sx={{ fontSize: '0.7rem' }} />}
                      sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 28 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={labelStyle}>Publish To *</Typography>
              <FormControl fullWidth size="small" error={!!fieldErrors.publishTo}>
                <Select
                  multiple
                  value={formData.publishTo}
                  onChange={handlePublishChange}
                  onBlur={handleBlur}
                  input={<OutlinedInput label="Publish To *" />}
                  disabled={loading}
                  sx={inputStyle}
                  MenuProps={selectMenuProps}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={publishPlatforms.find(p => p.value === value)?.label || value}
                          size="small"
                          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {publishPlatforms.map((platform) => (
                    <MenuItem key={platform.value} value={platform.value} sx={{ fontSize: '0.75rem' }}>
                      <Checkbox checked={formData.publishTo.indexOf(platform.value) > -1} />
                      <ListItemText primary={platform.label} />
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.publishTo && (
                  <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.publishTo}</FormHelperText>
                )}
                <FormHelperText sx={{ fontSize: '0.65rem' }}>Select where to publish this job opening</FormHelperText>
              </FormControl>
            </Box>

            <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primaryDark }}>Note:</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary, pl: 3.5 }}>
                  The job will be created in draft status first. You can review and publish it later from the job listings page.
                </Typography>
              </Stack>
            </Paper>
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
        bgcolor: COLORS.background.tableHeader,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.light }}>
            Add Job Opening
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
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
        {renderStepContent()}

        {stepErrors[activeStep] && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {stepErrors[activeStep]}
          </Alert>
        )}

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

        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              disabled={loading}
              startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
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
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
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
          ) : (
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
              {loading ? 'Creating...' : 'Create Job Opening'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobOpening;