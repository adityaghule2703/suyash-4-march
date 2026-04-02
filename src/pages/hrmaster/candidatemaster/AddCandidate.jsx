// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Alert,
//   Typography,
//   Paper,
//   Box,
//   IconButton,
//   TextField,
//   Chip,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
//   Stepper,
//   Step,
//   StepLabel,
//   styled,
//   StepConnector,
//   Divider,
//   CircularProgress,
//   Autocomplete,
//   FormHelperText
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Person as PersonIcon,
//   LocationOn as LocationIcon,
//   School as SchoolIcon,
//   Work as WorkIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   BusinessCenter as JobIcon,
//   Error as ErrorIcon,
//   CheckCircle as CheckCircleIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants
// const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';
// const PRIMARY_BLUE = '#00B4D8';
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = '#0f172a';

// // Custom Stepper Connector
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   '& .MuiStepConnector-line': {
//     height: 4,
//     border: 0,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//   },
//   '&.Mui-active .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
//   '&.Mui-completed .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
// }));

// const steps = ["Personal Information", "Address", "Education & Skills", "Experience"];

// const AddCandidate = ({ open, onClose, onAdd, jobId = '' }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [jobsLoading, setJobsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [jobs, setJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [touched, setTouched] = useState({});
//   const [fieldErrors, setFieldErrors] = useState({});

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       country: 'India',
//       pincode: ''
//     },
//     skills: [],
//     experience: [{
//       company: '',
//       position: '',
//       fromDate: '',
//       toDate: '',
//       current: false,
//       description: ''
//     }],
//     education: [{
//       degree: '',
//       institution: '',
//       yearOfPassing: '',
//       specialization: ''
//     }],
//     source: 'walkin',
//     jobId: jobId
//   });

//   const [skillInput, setSkillInput] = useState('');
//   const [skillInputError, setSkillInputError] = useState('');

//   // Validation rules
//   const validationRules = {
//     jobId: {
//       required: true,
//       message: 'Please select a job to apply for'
//     },
//     firstName: {
//       required: true,
//       minLength: 2,
//       maxLength: 50,
//       pattern: /^[A-Za-z\s]+$/,
//       message: 'First name should only contain letters and spaces'
//     },
//     lastName: {
//       required: true,
//       minLength: 2,
//       maxLength: 50,
//       pattern: /^[A-Za-z\s]+$/,
//       message: 'Last name should only contain letters and spaces'
//     },
//     email: {
//       required: true,
//       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//       message: 'Please enter a valid email address'
//     },
//     phone: {
//       required: true,
//       pattern: /^\d{10}$/,
//       message: 'Phone number must be exactly 10 digits'
//     },
//     dateOfBirth: {
//       required: false,
//       validate: (value) => {
//         if (!value) return true;
//         const dob = new Date(value);
//         const today = new Date();
//         const age = today.getFullYear() - dob.getFullYear();
//         return age >= 18 && age <= 70;
//       },
//       message: 'Age must be between 18 and 70 years'
//     },
//     'address.street': {
//       required: true,
//       minLength: 5,
//       maxLength: 200,
//       message: 'Street address must be at least 5 characters'
//     },
//     'address.city': {
//       required: true,
//       minLength: 2,
//       maxLength: 50,
//       pattern: /^[A-Za-z\s]+$/,
//       message: 'City should only contain letters and spaces'
//     },
//     'address.state': {
//       required: true,
//       minLength: 2,
//       maxLength: 50,
//       pattern: /^[A-Za-z\s]+$/,
//       message: 'State should only contain letters and spaces'
//     },
//     'address.pincode': {
//       required: true,
//       pattern: /^\d{6}$/,
//       message: 'Pincode must be exactly 6 digits'
//     }
//   };

//   // Validate a single field
//   const validateField = (fieldPath, value, allValues = formData) => {
//     const rules = getNestedRules(fieldPath);
//     if (!rules) return '';

//     if (rules.required && (!value || value.toString().trim() === '')) {
//       return `${getFieldLabel(fieldPath)} is required`;
//     }

//     if (value && rules.minLength && value.length < rules.minLength) {
//       return `${getFieldLabel(fieldPath)} must be at least ${rules.minLength} characters`;
//     }

//     if (value && rules.maxLength && value.length > rules.maxLength) {
//       return `${getFieldLabel(fieldPath)} must not exceed ${rules.maxLength} characters`;
//     }

//     if (value && rules.pattern && !rules.pattern.test(value)) {
//       return rules.message || `Invalid ${getFieldLabel(fieldPath).toLowerCase()}`;
//     }

//     if (rules.validate && !rules.validate(value, allValues)) {
//       return rules.message || `Invalid ${getFieldLabel(fieldPath).toLowerCase()}`;
//     }

//     return '';
//   };

//   const getNestedRules = (fieldPath) => {
//     if (fieldPath.includes('.')) {
//       return validationRules[fieldPath];
//     }
//     return validationRules[fieldPath];
//   };

//   const getFieldLabel = (fieldPath) => {
//     const labels = {
//       jobId: 'Job',
//       firstName: 'First name',
//       lastName: 'Last name',
//       email: 'Email',
//       phone: 'Phone number',
//       dateOfBirth: 'Date of birth',
//       'address.street': 'Street address',
//       'address.city': 'City',
//       'address.state': 'State',
//       'address.pincode': 'Pincode',
//       'address.country': 'Country'
//     };
//     return labels[fieldPath] || fieldPath;
//   };

//   // Validate all fields in current step
//   // Validate all fields in current step
//   const validateStep = () => {
//     const errors = {};
//     const stepFields = getStepFields(activeStep);
//     const newTouched = { ...touched };

//     stepFields.forEach(field => {
//       let value;
//       if (field.includes('.')) {
//         const [parent, child] = field.split('.');
//         value = formData[parent]?.[child];
//       } else {
//         value = formData[field];
//       }

//       const error = validateField(field, value);
//       if (error) {
//         errors[field] = error;
//       }

//       // Mark field as touched for validation
//       newTouched[field] = true;
//     });

//     // Additional validations
//     if (activeStep === 2) {
//       // Validate education entries
//       if (formData.education.length === 0 || !formData.education[0].degree) {
//         errors['education'] = 'At least one education entry is required';
//       } else {
//         formData.education.forEach((edu, index) => {
//           if (!edu.degree) {
//             errors[`education[${index}].degree`] = 'Degree is required';
//             newTouched[`education[${index}].degree`] = true;
//           }
//           if (!edu.institution) {
//             errors[`education[${index}].institution`] = 'Institution is required';
//             newTouched[`education[${index}].institution`] = true;
//           }
//           if (!edu.yearOfPassing) {
//             errors[`education[${index}].yearOfPassing`] = 'Year of passing is required';
//             newTouched[`education[${index}].yearOfPassing`] = true;
//           } else if (edu.yearOfPassing < 1900 || edu.yearOfPassing > new Date().getFullYear()) {
//             errors[`education[${index}].yearOfPassing`] = 'Please enter a valid year';
//             newTouched[`education[${index}].yearOfPassing`] = true;
//           }
//         });
//       }
//     }

//     if (activeStep === 3) {
//       // Validate experience entries
//       formData.experience.forEach((exp, index) => {
//         if (exp.company && (!exp.fromDate || !exp.position)) {
//           errors[`experience[${index}].details`] = 'Please fill all experience details';
//           newTouched[`experience[${index}].details`] = true;
//         }
//         if (exp.fromDate && exp.toDate && !exp.current) {
//           if (new Date(exp.toDate) < new Date(exp.fromDate)) {
//             errors[`experience[${index}].date`] = 'To date must be after from date';
//             newTouched[`experience[${index}].date`] = true;
//           }
//         }
//       });
//     }

//     setFieldErrors(errors);
//     setTouched(newTouched); // Update touched state

//     return Object.keys(errors).length === 0;
//   };

//   const getStepFields = (step) => {
//     switch (step) {
//       case 0: return ['jobId', 'firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
//       case 1: return ['address.street', 'address.city', 'address.state', 'address.pincode'];
//       case 2: return [];
//       case 3: return [];
//       default: return [];
//     }
//   };

//   // Handle field blur
//   const handleBlur = (field) => {
//     setTouched(prev => ({ ...prev, [field]: true }));

//     let value;
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       value = formData[parent]?.[child];
//     } else {
//       value = formData[field];
//     }

//     const error = validateField(field, value);
//     setFieldErrors(prev => ({ ...prev, [field]: error }));
//   };

//   // Fetch jobs when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchJobs();
//     }
//   }, [open]);

//   // Reset errors when step changes
//   useEffect(() => {
//     setFieldErrors({});
//     setError('');
//   }, [activeStep]);

//   // Set selected job if jobId is provided
//   useEffect(() => {
//     if (jobId && jobs.length > 0) {
//       const job = jobs.find(j => j._id === jobId);
//       setSelectedJob(job || null);
//       setFormData(prev => ({
//         ...prev,
//         jobId: jobId
//       }));
//     }
//   }, [jobId, jobs]);

//   const fetchJobs = async () => {
//     setJobsLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/jobs`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         params: {
//           status: 'published'
//         }
//       });

//       if (response.data.success) {
//         setJobs(response.data.data || []);
//       } else {
//         setError('Failed to fetch jobs');
//       }
//     } catch (err) {
//       console.error('Error fetching jobs:', err);
//       setError(err.response?.data?.message || 'Failed to fetch jobs');
//     } finally {
//       setJobsLoading(false);
//     }
//   };

//   const handleJobChange = (event, newValue) => {
//     setSelectedJob(newValue);
//     setFormData(prev => ({
//       ...prev,
//       jobId: newValue?._id || ''
//     }));
//     if (fieldErrors.jobId) {
//       setFieldErrors(prev => ({ ...prev, jobId: '' }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Clear error for this field
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     }
//     setError('');
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       address: {
//         ...prev.address,
//         [name]: value
//       }
//     }));

//     // Clear error for this field
//     const fieldPath = `address.${name}`;
//     if (fieldErrors[fieldPath]) {
//       setFieldErrors(prev => ({ ...prev, [fieldPath]: '' }));
//     }
//     setError('');
//   };

//   // Experience handlers
//   const handleExperienceChange = (index, field, value) => {
//     const updatedExperience = [...formData.experience];
//     updatedExperience[index][field] = value;

//     if (field === 'current' && value === true) {
//       updatedExperience[index].toDate = '';
//     }

//     setFormData(prev => ({
//       ...prev,
//       experience: updatedExperience
//     }));

//     // Clear related errors
//     const errorFields = [`experience[${index}].details`, `experience[${index}].date`];
//     setFieldErrors(prev => {
//       const newErrors = { ...prev };
//       errorFields.forEach(f => delete newErrors[f]);
//       return newErrors;
//     });
//   };

//   const addExperience = () => {
//     setFormData(prev => ({
//       ...prev,
//       experience: [
//         ...prev.experience,
//         {
//           company: '',
//           position: '',
//           fromDate: '',
//           toDate: '',
//           current: false,
//           description: ''
//         }
//       ]
//     }));
//   };

//   const removeExperience = (index) => {
//     if (formData.experience.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         experience: prev.experience.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   // Education handlers
//   const handleEducationChange = (index, field, value) => {
//     const updatedEducation = [...formData.education];
//     updatedEducation[index][field] = value;
//     setFormData(prev => ({
//       ...prev,
//       education: updatedEducation
//     }));

//     // Clear education errors
//     setFieldErrors(prev => {
//       const newErrors = { ...prev };
//       delete newErrors['education'];
//       delete newErrors[`education[${index}].degree`];
//       delete newErrors[`education[${index}].institution`];
//       delete newErrors[`education[${index}].yearOfPassing`];
//       return newErrors;
//     });
//   };

//   const addEducation = () => {
//     setFormData(prev => ({
//       ...prev,
//       education: [
//         ...prev.education,
//         {
//           degree: '',
//           institution: '',
//           yearOfPassing: '',
//           specialization: ''
//         }
//       ]
//     }));
//   };

//   const removeEducation = (index) => {
//     if (formData.education.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         education: prev.education.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   // Skills handlers
//   const handleAddSkill = () => {
//     setSkillInputError('');

//     if (!skillInput.trim()) {
//       setSkillInputError('Please enter a skill');
//       return;
//     }

//     if (formData.skills.includes(skillInput.trim())) {
//       setSkillInputError('This skill has already been added');
//       return;
//     }

//     if (skillInput.trim().length > 50) {
//       setSkillInputError('Skill name cannot exceed 50 characters');
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       skills: [...prev.skills, skillInput.trim()]
//     }));
//     setSkillInput('');
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

//   const handleNext = () => {
//     setError('');
//     if (validateStep()) {
//       setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
//     }
//   };

//   const handleBack = () => {
//     setError('');
//     setActiveStep((prev) => Math.max(prev - 1, 0));
//   };

//   const handleSubmit = async () => {
//     // Validate final step
//     if (!validateStep()) {
//       setError('Please fix all errors before submitting');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');

//       // Final validation before submission
//       if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
//         throw new Error('Please fill all required fields');
//       }

//       if (!/^\d{10}$/.test(formData.phone)) {
//         throw new Error('Please enter a valid 10-digit phone number');
//       }

//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         throw new Error('Please enter a valid email address');
//       }

//       const response = await axios.post(`${BASE_URL}/api/candidates`, formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setSuccess('Candidate added successfully!');
//         setTimeout(() => {
//           onAdd(response.data.data);
//           resetForm();
//           onClose();
//         }, 1500);
//       } else {
//         setError(response.data.message || 'Failed to add candidate');
//       }
//     } catch (err) {
//       console.error('Error adding candidate:', err);

//       // Handle specific error messages
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.message) {
//         setError(err.message);
//       } else {
//         setError('Failed to add candidate. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       dateOfBirth: '',
//       gender: '',
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         country: 'India',
//         pincode: ''
//       },
//       skills: [],
//       experience: [{
//         company: '',
//         position: '',
//         fromDate: '',
//         toDate: '',
//         current: false,
//         description: ''
//       }],
//       education: [{
//         degree: '',
//         institution: '',
//         yearOfPassing: '',
//         specialization: ''
//       }],
//       source: 'walkin',
//       jobId: jobId
//     });
//     setSelectedJob(null);
//     setActiveStep(0);
//     setError('');
//     setSuccess('');
//     setFieldErrors({});
//     setTouched({});
//     setSkillInput('');
//     setSkillInputError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Helper to get error props for TextField
//   const getErrorProps = (field) => {
//     const hasError = touched[field] && fieldErrors[field];
//     return {
//       error: !!hasError,
//       helperText: hasError || ''
//     };
//   };

//   // Render step content
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//               <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
//               Personal Information
//             </Typography>

//             {/* Job Selection Dropdown */}
//             <Paper sx={{ p: 2, bgcolor: '#F0F7FF', border: '1px solid #BBDEFB', borderRadius: 2 }}>
//               <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <JobIcon sx={{ color: '#1976D2' }} />
//                 Apply for Job *
//               </Typography>

//               {jobsLoading ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
//                   <CircularProgress size={24} />
//                 </Box>
//               ) : (
//                 <Autocomplete
//                   value={selectedJob}
//                   onChange={handleJobChange}
//                   onBlur={() => handleBlur('jobId')}
//                   options={jobs}
//                   getOptionLabel={(option) => `${option.title} (${option.jobId}) - ${option.location}`}
//                   isOptionEqualToValue={(option, value) => option._id === value._id}
//                   loading={jobsLoading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Job *"
//                       placeholder="Search by job title or ID"
//                       size="small"
//                       required
//                       error={touched.jobId && fieldErrors.jobId}
//                       helperText={touched.jobId && fieldErrors.jobId}
//                       InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                           <>
//                             {jobsLoading ? <CircularProgress color="inherit" size={20} /> : null}
//                             {params.InputProps.endAdornment}
//                           </>
//                         ),
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       <Box>
//                         <Typography variant="body2" fontWeight={500}>
//                           {option.title}
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           {option.jobId} • {option.location} • {option.department}
//                         </Typography>
//                         {option.status === 'published' && (
//                           <Chip
//                             label="Published"
//                             size="small"
//                             color="success"
//                             sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
//                           />
//                         )}
//                       </Box>
//                     </li>
//                   )}
//                   noOptionsText="No jobs found"
//                 />
//               )}

//               {selectedJob && (
//                 <Box sx={{ mt: 2, p: 1.5, bgcolor: '#E3F2FD', borderRadius: 1 }}>
//                   <Grid container spacing={1}>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="textSecondary">Job ID</Typography>
//                       <Typography variant="body2">{selectedJob.jobId}</Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="textSecondary">Location</Typography>
//                       <Typography variant="body2">{selectedJob.location}</Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="textSecondary">Department</Typography>
//                       <Typography variant="body2">{selectedJob.department}</Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="textSecondary">Employment Type</Typography>
//                       <Typography variant="body2">{selectedJob.employmentType}</Typography>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               )}
//             </Paper>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="First Name *"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('firstName')}
//                   size="small"
//                   sx={{ width: "250px" }}
//                   required
//                   {...getErrorProps('firstName')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Last Name *"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('lastName')}
//                   size="small"
//                   sx={{ width: "250px" }}
//                   required
//                   {...getErrorProps('lastName')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField

//                   label="Email *"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('email')}
//                   size="small"
//                   sx={{ width: "300px" }}
//                   required
//                   {...getErrorProps('email')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Phone *"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('phone')}
//                   size="small"
//                   required
//                   placeholder="10 digit number"
//                   {...getErrorProps('phone')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Date of Birth"
//                   name="dateOfBirth"
//                   type="date"
//                   value={formData.dateOfBirth}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('dateOfBirth')}
//                   size="small"
//                   sx={{ width: "250px" }}
//                   InputLabelProps={{ shrink: true }}
//                   {...getErrorProps('dateOfBirth')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl
//                   fullWidth
//                   size="small"
//                   error={touched.gender && fieldErrors.gender}
//                   sx={{
//                     minWidth: '200px',  // Ensures minimum width
//                     '& .MuiInputBase-root': {
//                       width: '100%'
//                     }
//                   }}
//                 >
//                   <InputLabel>Gender</InputLabel>
//                   <Select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     onBlur={() => handleBlur('gender')}
//                     label="Gender"
//                     MenuProps={{
//                       PaperProps: {
//                         sx: {
//                           maxHeight: 300,
//                           width: 'auto',
//                           minWidth: 200
//                         }
//                       }
//                     }}
//                     sx={{
//                       width: '100%',
//                       '& .MuiSelect-select': {
//                         whiteSpace: 'normal',  // Prevents text truncation
//                         overflow: 'visible'
//                       }
//                     }}
//                   >
//                     <MenuItem value="">Select Gender</MenuItem>
//                     <MenuItem value="M">Male</MenuItem>
//                     <MenuItem value="F">Female</MenuItem>
//                     <MenuItem value="O">Other</MenuItem>
//                   </Select>
//                   {touched.gender && fieldErrors.gender && (
//                     <FormHelperText>{fieldErrors.gender}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//               <LocationIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
//               Address Information
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Street *"
//                   name="street"
//                   value={formData.address.street}
//                   onChange={handleAddressChange}
//                   onBlur={() => handleBlur('address.street')}
//                   size="small"
//                   sx={{ width: "340px" }}
//                   required
//                   {...getErrorProps('address.street')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="City *"
//                   name="city"
//                   value={formData.address.city}
//                   onChange={handleAddressChange}
//                   onBlur={() => handleBlur('address.city')}
//                   size="small"
//                   sx={{ width: "240px" }}
//                   required
//                   {...getErrorProps('address.city')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="State *"
//                   name="state"
//                   value={formData.address.state}
//                   onChange={handleAddressChange}
//                   onBlur={() => handleBlur('address.state')}
//                   size="small"
//                   required
//                   {...getErrorProps('address.state')}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Country"
//                   name="country"
//                   value={formData.address.country}
//                   onChange={handleAddressChange}
//                   size="small"
//                   sx={{ width: "100px" }}
//                   InputProps={{ readOnly: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Pincode *"
//                   name="pincode"
//                   value={formData.address.pincode}
//                   onChange={handleAddressChange}
//                   onBlur={() => handleBlur('address.pincode')}
//                   size="small"
//                   required
//                   placeholder="6 digit pincode"
//                   {...getErrorProps('address.pincode')}
//                 />
//               </Grid>
//             </Grid>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={4}>
//             {/* Education Section */}
//             <Stack spacing={2}>
//               <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//                 <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
//                 Education
//               </Typography>

//               {fieldErrors.education && (
//                 <Alert severity="error" sx={{ borderRadius: 1 }}>
//                   {fieldErrors.education}
//                 </Alert>
//               )}

//               {formData.education.map((edu, index) => (
//                 <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 2 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//                     <Typography variant="subtitle2" fontWeight={600}>
//                       Education #{index + 1}
//                     </Typography>
//                     {formData.education.length > 1 && (
//                       <IconButton size="small" onClick={() => removeEducation(index)} color="error">
//                         <DeleteIcon />
//                       </IconButton>
//                     )}
//                   </Box>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Degree *"
//                         value={edu.degree}
//                         onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
//                         onBlur={() => handleBlur(`education[${index}].degree`)}
//                         size="small"
//                         required={index === 0}
//                         error={!!fieldErrors[`education[${index}].degree`]}
//                         helperText={fieldErrors[`education[${index}].degree`] || ''}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Institution *"
//                         value={edu.institution}
//                         onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
//                         onBlur={() => handleBlur(`education[${index}].institution`)}
//                         size="small"
//                         required={index === 0}
//                         error={!!fieldErrors[`education[${index}].institution`]}
//                         helperText={fieldErrors[`education[${index}].institution`] || ''}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Year of Passing *"
//                         type="number"
//                         value={edu.yearOfPassing}
//                         onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)}
//                         onBlur={() => handleBlur(`education[${index}].yearOfPassing`)}
//                         size="small"
//                         required={index === 0}
//                         error={!!fieldErrors[`education[${index}].yearOfPassing`]}
//                         helperText={fieldErrors[`education[${index}].yearOfPassing`] || ''}
//                         inputProps={{ min: 1900, max: new Date().getFullYear() }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Specialization"
//                         value={edu.specialization}
//                         onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
//                         size="small"
//                       />
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               ))}

//               <Button
//                 startIcon={<AddIcon />}
//                 onClick={addEducation}
//                 variant="outlined"
//                 size="small"
//                 sx={{ alignSelf: 'flex-start', borderRadius: 1.5 }}
//               >
//                 Add Another Education
//               </Button>
//             </Stack>

//             {/* Skills Section */}
//             <Stack spacing={2}>
//               <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//                 Skills
//               </Typography>

//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <TextField
//                   fullWidth
//                   placeholder="Enter a skill"
//                   value={skillInput}
//                   onChange={(e) => {
//                     setSkillInput(e.target.value);
//                     setSkillInputError('');
//                   }}
//                   onKeyPress={handleKeyPress}
//                   size="small"
//                   error={!!skillInputError}
//                   helperText={skillInputError}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleAddSkill}
//                   disabled={!skillInput.trim()}
//                   sx={{
//                     borderRadius: 1.5,
//                     textTransform: 'none',
//                     background: 'linear-gradient(135deg, #164e63, #00B4D8)', // Simplified gradient without stops
//                     color: '#FFFFFF',
//                     '&:hover': {
//                       background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                       opacity: 0.9
//                     },
//                     '&.Mui-disabled': {
//                       background: '#e0e0e0',
//                       color: '#9e9e9e'
//                     }
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Box>

//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                 {formData.skills.map((skill, index) => (
//                   <Chip
//                     key={index}
//                     label={skill}
//                     onDelete={() => handleRemoveSkill(skill)}
//                     sx={{
//                       bgcolor: '#E3F2FD',
//                       color: '#1976D2',
//                       '& .MuiChip-deleteIcon': { color: '#1976D2' }
//                     }}
//                   />
//                 ))}
//                 {formData.skills.length === 0 && (
//                   <Typography variant="caption" color="textSecondary">
//                     No skills added yet
//                   </Typography>
//                 )}
//               </Box>
//             </Stack>
//           </Stack>
//         );

//       case 3:
//         return (
//           <Stack spacing={3}>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//               <WorkIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
//               Work Experience
//             </Typography>

//             {formData.experience.map((exp, index) => (
//               <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//                   <Typography variant="subtitle2" fontWeight={600}>
//                     Experience #{index + 1}
//                   </Typography>
//                   {formData.experience.length > 1 && (
//                     <IconButton size="small" onClick={() => removeExperience(index)} color="error">
//                       <DeleteIcon />
//                     </IconButton>
//                   )}
//                 </Box>
//                 {fieldErrors[`experience[${index}].details`] && (
//                   <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
//                     {fieldErrors[`experience[${index}].details`]}
//                   </Alert>
//                 )}
//                 {fieldErrors[`experience[${index}].date`] && (
//                   <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
//                     {fieldErrors[`experience[${index}].date`]}
//                   </Alert>
//                 )}
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Company"
//                       value={exp.company}
//                       onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Position"
//                       value={exp.position}
//                       onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={5}>
//                     <TextField
//                       fullWidth
//                       label="From Date"
//                       type="date"
//                       value={exp.fromDate}
//                       onChange={(e) => handleExperienceChange(index, 'fromDate', e.target.value)}
//                       size="small"
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={5}>
//                     <TextField
//                       fullWidth
//                       label="To Date"
//                       type="date"
//                       value={exp.toDate}
//                       onChange={(e) => handleExperienceChange(index, 'toDate', e.target.value)}
//                       size="small"
//                       InputLabelProps={{ shrink: true }}
//                       disabled={exp.current}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={2}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={exp.current}
//                           onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
//                         />
//                       }
//                       label="Current"
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Description"
//                       value={exp.description}
//                       onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
//                       multiline
//                       rows={2}
//                       size="small"
//                     />
//                   </Grid>
//                 </Grid>
//               </Paper>
//             ))}

//             <Button
//               startIcon={<AddIcon />}
//               onClick={addExperience}
//               variant="outlined"
//               size="small"
//               sx={{ alignSelf: 'flex-start', borderRadius: 1.5 }}
//             >
//               Add Another Experience
//             </Button>

//             {/* Source Selection */}
//             <Box sx={{ mt: 2 }}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Source</InputLabel>
//                 <Select
//                   name="source"
//                   value={formData.source}
//                   onChange={handleInputChange}
//                   label="Source"
//                 >
//                   <MenuItem value="walkin">Walk-in</MenuItem>
//                   <MenuItem value="portal">Job Portal</MenuItem>
//                   <MenuItem value="referral">Referral</MenuItem>
//                   <MenuItem value="consultant">Consultant</MenuItem>
//                   <MenuItem value="other">Other</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
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
//           borderRadius: 2,
//           maxHeight: '90vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         pb: 2,
//         background: HEADER_GRADIENT, // Changed from backgroundColor to background and applied gradient
//         color: TEXT_COLOR_HEADER,
//         position: 'sticky',
//         top: 0,
//         zIndex: 2
//       }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6" fontWeight={600}  >
//             <AddIcon sx={{ mr: 1, verticalAlign: 'middle', color: TEXT_COLOR_HEADER }} />
//             Add New Candidate
//           </Typography>
//           <IconButton onClick={handleClose} size="small">
//             <CloseIcon sx={{ color: TEXT_COLOR_HEADER, }} />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 1 }}>
//         <Stack spacing={2}>
//           {/* Stepper */}
//           <Stepper
//             activeStep={activeStep}
//             alternativeLabel
//             connector={<ColorConnector />}
//             sx={{ mb: 1, pt: 2 }}
//           >
//             {steps.map((label, index) => (
//               <Step key={label}>
//                 <StepLabel>
//                   <Typography variant="body2" fontWeight={500}>
//                     {label}
//                   </Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>



//           <Divider />

//           {/* Step Content */}
//           {renderStepContent(activeStep)}

//           {/* Error/Success Messages */}
//           {error && (
//             <Alert
//               severity="error"
//               sx={{ borderRadius: 1 }}
//               icon={<ErrorIcon />}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert
//               severity="success"
//               sx={{ borderRadius: 1 }}
//               icon={<CheckCircleIcon />}
//             >
//               {success}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2,
//         py: 1,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         position: 'sticky',
//         bottom: 0,
//         zIndex: 1,
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           sx={{ borderRadius: 1.5, textTransform: 'none' }}
//         >
//           Back
//         </Button>

//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             sx={{ borderRadius: 1.5, textTransform: 'none' }}
//           >
//             Cancel
//           </Button>

//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || Object.keys(fieldErrors).length > 0}
//               sx={{
//                 borderRadius: 1.5,
//                 textTransform: 'none',
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': { opacity: 0.9 },
//                 '&.Mui-disabled': {
//                   background: '#E0E0E0'
//                 }
//               }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Candidate'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               sx={{
//                 borderRadius: 1.5,
//                 textTransform: 'none',
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': { opacity: 0.9 }
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

// export default AddCandidate;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Typography,
  Paper,
  Box,
  IconButton,
  TextField,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  Divider,
  CircularProgress,
  Autocomplete,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  BusinessCenter as JobIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon
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
  '& .MuiStepConnector-line': {
    height: 2,
    border: 0,
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
  '&.Mui-active .MuiStepConnector-line': {
    backgroundColor: COLORS.primary,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    backgroundColor: COLORS.primary,
  },
}));

const steps = ["Personal Information", "Address", "Education & Skills", "Experience"];

const AddCandidate = ({ open, onClose, onAdd, jobId = '' }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    skills: [],
    experience: [{
      company: '',
      position: '',
      fromDate: '',
      toDate: '',
      current: false,
      description: ''
    }],
    education: [{
      degree: '',
      institution: '',
      yearOfPassing: '',
      specialization: ''
    }],
    source: 'walkin',
    jobId: jobId
  });

  const [skillInput, setSkillInput] = useState('');
  const [skillInputError, setSkillInputError] = useState('');

  // Validation rules
  const validationRules = {
    jobId: { required: true, message: 'Please select a job to apply for' },
    firstName: { required: true, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'First name should only contain letters and spaces' },
    lastName: { required: true, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'Last name should only contain letters and spaces' },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
    phone: { required: true, pattern: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' },
    dateOfBirth: { required: false, validate: (value) => { if (!value) return true; const dob = new Date(value); const today = new Date(); const age = today.getFullYear() - dob.getFullYear(); return age >= 18 && age <= 70; }, message: 'Age must be between 18 and 70 years' },
    'address.street': { required: true, minLength: 5, maxLength: 200, message: 'Street address must be at least 5 characters' },
    'address.city': { required: true, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'City should only contain letters and spaces' },
    'address.state': { required: true, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'State should only contain letters and spaces' },
    'address.pincode': { required: true, pattern: /^\d{6}$/, message: 'Pincode must be exactly 6 digits' }
  };

  const validateField = (fieldPath, value, allValues = formData) => {
    const rules = getNestedRules(fieldPath);
    if (!rules) return '';

    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${getFieldLabel(fieldPath)} is required`;
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      return `${getFieldLabel(fieldPath)} must be at least ${rules.minLength} characters`;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return `${getFieldLabel(fieldPath)} must not exceed ${rules.maxLength} characters`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return rules.message || `Invalid ${getFieldLabel(fieldPath).toLowerCase()}`;
    }

    if (rules.validate && !rules.validate(value, allValues)) {
      return rules.message || `Invalid ${getFieldLabel(fieldPath).toLowerCase()}`;
    }

    return '';
  };

  const getNestedRules = (fieldPath) => {
    if (fieldPath.includes('.')) return validationRules[fieldPath];
    return validationRules[fieldPath];
  };

  const getFieldLabel = (fieldPath) => {
    const labels = {
      jobId: 'Job', firstName: 'First name', lastName: 'Last name', email: 'Email',
      phone: 'Phone number', dateOfBirth: 'Date of birth', 'address.street': 'Street address',
      'address.city': 'City', 'address.state': 'State', 'address.pincode': 'Pincode', 'address.country': 'Country'
    };
    return labels[fieldPath] || fieldPath;
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0: return ['jobId', 'firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
      case 1: return ['address.street', 'address.city', 'address.state', 'address.pincode'];
      case 2: return [];
      case 3: return [];
      default: return [];
    }
  };

  const validateStep = () => {
    const errors = {};
    const stepFields = getStepFields(activeStep);
    const newTouched = { ...touched };

    stepFields.forEach(field => {
      let value;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        value = formData[parent]?.[child];
      } else {
        value = formData[field];
      }

      const error = validateField(field, value);
      if (error) errors[field] = error;
      newTouched[field] = true;
    });

    if (activeStep === 2) {
      if (formData.education.length === 0 || !formData.education[0].degree) {
        errors['education'] = 'At least one education entry is required';
      } else {
        formData.education.forEach((edu, index) => {
          if (!edu.degree) errors[`education[${index}].degree`] = 'Degree is required';
          if (!edu.institution) errors[`education[${index}].institution`] = 'Institution is required';
          if (!edu.yearOfPassing) errors[`education[${index}].yearOfPassing`] = 'Year of passing is required';
          else if (edu.yearOfPassing < 1900 || edu.yearOfPassing > new Date().getFullYear()) {
            errors[`education[${index}].yearOfPassing`] = 'Please enter a valid year';
          }
        });
      }
    }

    if (activeStep === 3) {
      formData.experience.forEach((exp, index) => {
        if (exp.company && (!exp.fromDate || !exp.position)) {
          errors[`experience[${index}].details`] = 'Please fill all experience details';
        }
        if (exp.fromDate && exp.toDate && !exp.current) {
          if (new Date(exp.toDate) < new Date(exp.fromDate)) {
            errors[`experience[${index}].date`] = 'To date must be after from date';
          }
        }
      });
    }

    setFieldErrors(errors);
    setTouched(newTouched);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let value;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      value = formData[parent]?.[child];
    } else {
      value = formData[field];
    }
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  useEffect(() => {
    if (open) fetchJobs();
  }, [open]);

  useEffect(() => {
    setFieldErrors({});
    setError('');
  }, [activeStep]);

  useEffect(() => {
    if (jobId && jobs.length > 0) {
      const job = jobs.find(j => j._id === jobId);
      setSelectedJob(job || null);
      setFormData(prev => ({ ...prev, jobId: jobId }));
    }
  }, [jobId, jobs]);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { status: 'published' }
      });

      if (response.data.success) setJobs(response.data.data || []);
      else setError('Failed to fetch jobs');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const handleJobChange = (event, newValue) => {
    setSelectedJob(newValue);
    setFormData(prev => ({ ...prev, jobId: newValue?._id || '' }));
    if (fieldErrors.jobId) setFieldErrors(prev => ({ ...prev, jobId: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    const fieldPath = `address.${name}`;
    if (fieldErrors[fieldPath]) setFieldErrors(prev => ({ ...prev, [fieldPath]: '' }));
    setError('');
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    if (field === 'current' && value === true) updatedExperience[index].toDate = '';
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`experience[${index}].details`];
      delete newErrors[`experience[${index}].date`];
      return newErrors;
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', fromDate: '', toDate: '', current: false, description: '' }]
    }));
  };

  const removeExperience = (index) => {
    if (formData.experience.length > 1) {
      setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({ ...prev, education: updatedEducation }));
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['education'];
      delete newErrors[`education[${index}].degree`];
      delete newErrors[`education[${index}].institution`];
      delete newErrors[`education[${index}].yearOfPassing`];
      return newErrors;
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', yearOfPassing: '', specialization: '' }]
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
    }
  };

  const handleAddSkill = () => {
    setSkillInputError('');
    if (!skillInput.trim()) { setSkillInputError('Please enter a skill'); return; }
    if (formData.skills.includes(skillInput.trim())) { setSkillInputError('This skill has already been added'); return; }
    if (skillInput.trim().length > 50) { setSkillInputError('Skill name cannot exceed 50 characters'); return; }
    setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) { e.preventDefault(); handleAddSkill(); }
  };

  const handleNext = () => {
    setError('');
    if (validateStep()) setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) { setError('Please fix all errors before submitting'); return; }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error('Please fill all required fields');
      }
      if (!/^\d{10}$/.test(formData.phone)) throw new Error('Please enter a valid 10-digit phone number');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) throw new Error('Please enter a valid email address');

      const response = await axios.post(`${BASE_URL}/api/candidates`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setSuccess('Candidate added successfully!');
        setTimeout(() => {
          onAdd(response.data.data);
          resetForm();
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to add candidate');
      }
    } catch (err) {
      console.error('Error adding candidate:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '',
      address: { street: '', city: '', state: '', country: 'India', pincode: '' },
      skills: [],
      experience: [{ company: '', position: '', fromDate: '', toDate: '', current: false, description: '' }],
      education: [{ degree: '', institution: '', yearOfPassing: '', specialization: '' }],
      source: 'walkin', jobId: jobId
    });
    setSelectedJob(null);
    setActiveStep(0);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setTouched({});
    setSkillInput('');
    setSkillInputError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return { error: !!hasError, helperText: hasError || '' };
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            <Box sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <JobIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Apply for Job *
                </Typography>
              </Box>

              {jobsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} sx={{ color: COLORS.primary }} />
                </Box>
              ) : (
                <Autocomplete
                  value={selectedJob}
                  onChange={handleJobChange}
                  onBlur={() => handleBlur('jobId')}
                  options={jobs}
                  getOptionLabel={(option) => `${option.title} (${option.jobId})`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search by job title or ID"
                      size="small"
                      required
                      error={touched.jobId && fieldErrors.jobId}
                      helperText={touched.jobId && fieldErrors.jobId}
                      sx={inputStyle}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {jobsLoading ? <CircularProgress size={16} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {option.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {option.jobId} • {option.location} • {option.department}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              )}

              {selectedJob && (
                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Job ID</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{selectedJob.jobId}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Location</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{selectedJob.location}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Department</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{selectedJob.department}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Employment Type</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{selectedJob.employmentType}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Personal Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>First Name *</Typography>
                  <TextField
                    fullWidth
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('firstName')}
                    size="small"
                    placeholder="Enter first name"
                    {...getErrorProps('firstName')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Last Name *</Typography>
                  <TextField
                    fullWidth
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('lastName')}
                    size="small"
                    placeholder="Enter last name"
                    {...getErrorProps('lastName')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Email *</Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    size="small"
                    placeholder="example@email.com"
                    {...getErrorProps('email')}
                    sx={inputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Phone *</Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('phone')}
                    size="small"
                    placeholder="10 digit mobile number"
                    {...getErrorProps('phone')}
                    sx={inputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Date of Birth</Typography>
                  <TextField
                    fullWidth
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('dateOfBirth')}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    {...getErrorProps('dateOfBirth')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Gender</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('gender')}
                      displayEmpty
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select Gender</MenuItem>
                      <MenuItem value="M" sx={{ fontSize: '0.75rem' }}>Male</MenuItem>
                      <MenuItem value="F" sx={{ fontSize: '0.75rem' }}>Female</MenuItem>
                      <MenuItem value="O" sx={{ fontSize: '0.75rem' }}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Box sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Address Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Street *</Typography>
                  <TextField
                    fullWidth
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    onBlur={() => handleBlur('address.street')}
                    size="small"
                    placeholder="House/Flat No., Building Name, Area"
                    {...getErrorProps('address.street')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>City *</Typography>
                  <TextField
                    fullWidth
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    onBlur={() => handleBlur('address.city')}
                    size="small"
                    placeholder="Enter city"
                    {...getErrorProps('address.city')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>State *</Typography>
                  <TextField
                    fullWidth
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    onBlur={() => handleBlur('address.state')}
                    size="small"
                    placeholder="Enter state"
                    {...getErrorProps('address.state')}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Country</Typography>
                  <TextField
                    fullWidth
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>Pincode *</Typography>
                  <TextField
                    fullWidth
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    onBlur={() => handleBlur('address.pincode')}
                    size="small"
                    placeholder="6 digit pincode"
                    {...getErrorProps('address.pincode')}
                    sx={inputStyle}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            <Box sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Education
                </Typography>
              </Box>

              {fieldErrors.education && <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{fieldErrors.education}</Alert>}

              {formData.education.map((edu, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Education #{index + 1}</Typography>
                    {formData.education.length > 1 && (
                      <IconButton size="small" onClick={() => removeEducation(index)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Degree *</Typography>
                      <TextField
                        fullWidth
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        size="small"
                        placeholder="e.g., Bachelor of Technology"
                        error={!!fieldErrors[`education[${index}].degree`]}
                        helperText={fieldErrors[`education[${index}].degree`]}
                        sx={inputStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Institution *</Typography>
                      <TextField
                        fullWidth
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        size="small"
                        placeholder="University/College name"
                        error={!!fieldErrors[`education[${index}].institution`]}
                        helperText={fieldErrors[`education[${index}].institution`]}
                        sx={inputStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Year of Passing *</Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={edu.yearOfPassing}
                        onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)}
                        size="small"
                        placeholder="YYYY"
                        error={!!fieldErrors[`education[${index}].yearOfPassing`]}
                        helperText={fieldErrors[`education[${index}].yearOfPassing`]}
                        sx={inputStyle}
                        inputProps={{ min: 1900, max: new Date().getFullYear() }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Specialization</Typography>
                      <TextField
                        fullWidth
                        value={edu.specialization}
                        onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
                        size="small"
                        placeholder="e.g., Computer Science"
                        sx={inputStyle}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
                onClick={addEducation}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  borderColor: COLORS.border,
                  color: COLORS.primary,
                  '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
                }}
              >
                Add Another Education
              </Button>
            </Box>

            <Box sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Skills
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Enter a skill (e.g., JavaScript, React)"
                  value={skillInput}
                  onChange={(e) => { setSkillInput(e.target.value); setSkillInputError(''); }}
                  onKeyPress={handleKeyPress}
                  size="small"
                  error={!!skillInputError}
                  helperText={skillInputError}
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

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primaryDark,
                      fontSize: '0.65rem',
                      height: 28,
                      '& .MuiChip-deleteIcon': { color: COLORS.primaryDark, fontSize: '0.7rem' }
                    }}
                  />
                ))}
                {formData.skills.length === 0 && (
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                    No skills added yet
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2.5}>
            <Box sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WorkIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Work Experience
                </Typography>
              </Box>

              {formData.experience.map((exp, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Experience #{index + 1}</Typography>
                    {formData.experience.length > 1 && (
                      <IconButton size="small" onClick={() => removeExperience(index)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                      </IconButton>
                    )}
                  </Box>

                  {fieldErrors[`experience[${index}].details`] && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{fieldErrors[`experience[${index}].details`]}</Alert>
                  )}
                  {fieldErrors[`experience[${index}].date`] && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{fieldErrors[`experience[${index}].date`]}</Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Company</Typography>
                      <TextField
                        fullWidth
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        size="small"
                        placeholder="Company name"
                        sx={inputStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Position</Typography>
                      <TextField
                        fullWidth
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        size="small"
                        placeholder="Job title"
                        sx={inputStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Typography sx={labelStyle}>From Date</Typography>
                      <TextField
                        fullWidth
                        type="date"
                        value={exp.fromDate}
                        onChange={(e) => handleExperienceChange(index, 'fromDate', e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={inputStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Typography sx={labelStyle}>To Date</Typography>
                      <TextField
                        fullWidth
                        type="date"
                        value={exp.toDate}
                        onChange={(e) => handleExperienceChange(index, 'toDate', e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        disabled={exp.current}
                        sx={inputStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={exp.current}
                            onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                            sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.7rem' }}>Current</Typography>}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>Description</Typography>
                      <TextField
                        fullWidth
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        multiline
                        rows={2}
                        size="small"
                        placeholder="Brief description of responsibilities and achievements"
                        sx={inputStyle}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
                onClick={addExperience}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  borderColor: COLORS.border,
                  color: COLORS.primary,
                  '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
                }}
              >
                Add Another Experience
              </Button>
            </Box>

            <Box sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={labelStyle}>Source</Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.75rem' }
                  }}
                >
                  <MenuItem value="naukri" sx={{ fontSize: '0.75rem' }}>Naukri</MenuItem>
                  <MenuItem value="linkedin" sx={{ fontSize: '0.75rem' }}>LinkedIn</MenuItem>
                  <MenuItem value="indeed" sx={{ fontSize: '0.75rem' }}>Indeed</MenuItem>
                  <MenuItem value="walkin" sx={{ fontSize: '0.75rem' }}>Walk-in</MenuItem>
                  <MenuItem value="reference" sx={{ fontSize: '0.75rem' }}>Reference</MenuItem>
                  <MenuItem value="careerPage" sx={{ fontSize: '0.75rem' }}>Career Page</MenuItem>
                  <MenuItem value="other" sx={{ fontSize: '0.75rem' }}>Other</MenuItem>
                  </Select>
              </FormControl>
            </Box>
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle', color: COLORS.primary }} />
          Add New Candidate
        </Typography>
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white, overflowY: 'auto' }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {success}
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
              disabled={loading || Object.keys(fieldErrors).length > 0}
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
              {loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : 'Add Candidate'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
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
  );
};

export default AddCandidate;