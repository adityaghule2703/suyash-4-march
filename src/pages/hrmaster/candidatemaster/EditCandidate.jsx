// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Chip,
//   Divider,
//   Grid,
//   Box,
//   Paper,
//   Avatar,
//   IconButton,
//   CircularProgress,
//   Alert,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Stepper,
//   Step,
//   StepLabel,
//   InputAdornment,
//   FormHelperText,
//   Checkbox,
//   FormControlLabel,
//   Autocomplete
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   LocationOn as LocationIcon,
//   CalendarToday as CalendarIcon,
//   Save as SaveIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   LinkedIn as LinkedInIcon,
//   Language as LanguageIcon,
//   Business as BusinessIcon,
//   People as PeopleIcon,
//   CloudUpload as CloudUploadIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
//   Pending as PendingIcon,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   Badge as BadgeIcon,
//   Edit as EditIcon,
//   ArrowBack as ArrowBackIcon,
//   ArrowForward as ArrowForwardIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { StarIcon } from 'lucide-react';

// // Status options based on backend enum
// const STATUS_OPTIONS = [
//   { value: 'new', label: 'New', color: '#1976D2', bg: '#E3F2FD', icon: <PendingIcon /> },
//   { value: 'contacted', label: 'Contacted', color: '#7B1FA2', bg: '#F3E5F5', icon: <PersonIcon /> },
//   { value: 'shortlisted', label: 'Shortlisted', color: '#2E7D32', bg: '#E8F5E8', icon: <ThumbUpIcon /> },
//   { value: 'interviewed', label: 'Interviewed', color: '#0288D1', bg: '#E1F5FE', icon: <PersonIcon /> },
//   { value: 'selected', label: 'Selected', color: '#2E7D32', bg: '#E8F5E8', icon: <CheckCircleIcon /> },
//   { value: 'rejected', label: 'Rejected', color: '#C62828', bg: '#FFEBEE', icon: <ThumbDownIcon /> },
//   { value: 'onHold', label: 'On Hold', color: '#FF8F00', bg: '#FFF8E1', icon: <PendingIcon /> },
//   { value: 'joined', label: 'Joined', color: '#1B5E20', bg: '#E8F5E8', icon: <CheckCircleIcon /> }
// ];

// // Source options based on backend enum
// const SOURCE_OPTIONS = [
//   { value: 'naukri', label: 'Naukri', icon: <LanguageIcon />, color: '#FF5722' },
//   { value: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
//   { value: 'indeed', label: 'Indeed', icon: <WorkIcon />, color: '#003A9B' },
//   { value: 'walkin', label: 'Walk-in', icon: <PersonIcon />, color: '#4CAF50' },
//   { value: 'reference', label: 'Reference', icon: <PeopleIcon />, color: '#9C27B0' },
//   { value: 'careerPage', label: 'Career Page', icon: <BusinessIcon />, color: '#FF9800' },
//   { value: 'upload', label: 'Upload', icon: <CloudUploadIcon />, color: '#00BCD4' },
//   { value: 'other', label: 'Other', icon: <PersonIcon />, color: '#9E9E9E' }
// ];

// const EditCandidate = ({ open, onClose, onUpdate, candidateId, candidateData }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [candidate, setCandidate] = useState(candidateData || null);
//   const [availableJobs, setAvailableJobs] = useState([]);
//   const [jobsLoading, setJobsLoading] = useState(false);
//   const [touched, setTouched] = useState({});
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [skillInput, setSkillInput] = useState('');
//   const [skillInputError, setSkillInputError] = useState('');
//   const [tagInput, setTagInput] = useState('');
//   const [tagInputError, setTagInputError] = useState('');

//   // Validation rules (copied from AddCandidate)
//   const validationRules = {
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
//     alternativePhone: {
//       required: false,
//       pattern: /^\d{10}$/,
//       message: 'Alternative phone number must be exactly 10 digits'
//     },
//     dateOfBirth: {
//       required: false,
//       validate: (value) => {
//         if (!value) return true;
//         const dob = new Date(value);
//         const today = new Date();
//         const age = today.getFullYear() - dob.getFullYear();
//         const monthDiff = today.getMonth() - dob.getMonth();
//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//           return age - 1 >= 18 && age - 1 <= 70;
//         }
//         return age >= 18 && age <= 70;
//       },
//       message: 'Age must be between 18 and 70 years'
//     },
//     'address.street': {
//       required: false,
//       minLength: 5,
//       maxLength: 200,
//       message: 'Street address must be at least 5 characters'
//     },
//     'address.city': {
//       required: false,
//       minLength: 2,
//       maxLength: 50,
//       pattern: /^[A-Za-z\s]+$/,
//       message: 'City should only contain letters and spaces'
//     },
//     'address.state': {
//       required: false,
//       minLength: 2,
//       maxLength: 50,
//       pattern: /^[A-Za-z\s]+$/,
//       message: 'State should only contain letters and spaces'
//     },
//     'address.pincode': {
//       required: false,
//       pattern: /^\d{6}$/,
//       message: 'Pincode must be exactly 6 digits'
//     },
//     source: {
//       required: true,
//       message: 'Source is required'
//     }
//   };

//   // Form data state
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     alternativePhone: '',
//     dateOfBirth: '',
//     gender: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       country: 'India',
//       pincode: ''
//     },
//     education: [],
//     experience: [],
//     skills: [],
//     source: 'other',
//     sourceUrl: '',
//     referredBy: '',
//     tags: [],
//     status: 'new',
//     jobId: ''
//   });

//   // New item states for dynamic arrays
//   const [newEducation, setNewEducation] = useState({
//     degree: '',
//     institution: '',
//     yearOfPassing: '',
//     percentage: '',
//     specialization: ''
//   });
//   const [newEducationErrors, setNewEducationErrors] = useState({});

//   const [newExperience, setNewExperience] = useState({
//     company: '',
//     position: '',
//     fromDate: '',
//     toDate: '',
//     current: false,
//     description: ''
//   });
//   const [newExperienceErrors, setNewExperienceErrors] = useState({});

//   const steps = [
//     'Personal Info',
//     'Address',
//     'Education',
//     'Experience',
//     'Skills & Source',
//     'Status & Job'
//   ];

//   // Validation helper functions
//   const getFieldLabel = (fieldPath) => {
//     const labels = {
//       firstName: 'First name',
//       lastName: 'Last name',
//       email: 'Email',
//       phone: 'Phone number',
//       alternativePhone: 'Alternative phone',
//       dateOfBirth: 'Date of birth',
//       'address.street': 'Street address',
//       'address.city': 'City',
//       'address.state': 'State',
//       'address.pincode': 'Pincode',
//       source: 'Source'
//     };
//     return labels[fieldPath] || fieldPath;
//   };

//   const validateField = (fieldPath, value, allValues = formData) => {
//     const rules = validationRules[fieldPath];
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

//   const getStepFields = (step) => {
//     switch (step) {
//       case 0: return ['firstName', 'lastName', 'email', 'phone', 'alternativePhone', 'dateOfBirth'];
//       case 1: return ['address.street', 'address.city', 'address.state', 'address.pincode'];
//       case 2: return [];
//       case 3: return [];
//       case 4: return ['source'];
//       case 5: return [];
//       default: return [];
//     }
//   };

//   const validateStep = () => {
//     const errors = {};
//     const stepFields = getStepFields(activeStep);

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
//     });

//     // Additional validations for specific steps
//     if (activeStep === 2) {
//       // Validate existing education entries
//       if (formData.education.length === 0) {
//         errors['education'] = 'At least one education entry is recommended';
//       } else {
//         formData.education.forEach((edu, index) => {
//           if (!edu.degree) errors[`education[${index}].degree`] = 'Degree is required';
//           if (!edu.institution) errors[`education[${index}].institution`] = 'Institution is required';
//           if (edu.yearOfPassing) {
//             const year = parseInt(edu.yearOfPassing);
//             if (year < 1900 || year > new Date().getFullYear()) {
//               errors[`education[${index}].yearOfPassing`] = 'Please enter a valid year';
//             }
//           }
//         });
//       }
//     }

//     if (activeStep === 3) {
//       // Validate existing experience entries
//       formData.experience.forEach((exp, index) => {
//         if (exp.company && (!exp.fromDate || !exp.position)) {
//           errors[`experience[${index}].details`] = 'Please fill all experience details';
//         }
//         if (exp.fromDate && exp.toDate && !exp.current) {
//           if (new Date(exp.toDate) < new Date(exp.fromDate)) {
//             errors[`experience[${index}].date`] = 'To date must be after from date';
//           }
//         }
//       });
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

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

//   const getErrorProps = (field) => {
//     const hasError = touched[field] && fieldErrors[field];
//     return {
//       error: !!hasError,
//       helperText: hasError || ''
//     };
//   };

//   // Reset errors when step changes
//   useEffect(() => {
//     setFieldErrors({});
//     setError('');
//   }, [activeStep]);

//   // Fetch candidate details if not provided
//   useEffect(() => {
//     if (open) {
//       fetchJobs();
//       if (candidateData) {
//         setCandidate(candidateData);
//         populateFormData(candidateData);
//       } else if (candidateId) {
//         fetchCandidateDetails();
//       }
//     }
//   }, [open, candidateData, candidateId]);

//   // Set selected job when jobs are loaded
//   useEffect(() => {
//     if (formData.jobId && availableJobs.length > 0) {
//       const job = availableJobs.find(j => j._id === formData.jobId);
//       setSelectedJob(job || null);
//     }
//   }, [formData.jobId, availableJobs]);

//   const fetchCandidateDetails = async () => {
//     setFetchLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         const candidateData = response.data.data;
//         setCandidate(candidateData);
//         populateFormData(candidateData);
//       } else {
//         setError(response.data.message || 'Failed to fetch candidate details');
//       }
//     } catch (err) {
//       console.error('Error fetching candidate details:', err);
//       setError(err.response?.data?.message || 'Failed to fetch candidate details');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     setJobsLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/jobs?status=published`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setAvailableJobs(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching jobs:', err);
//     } finally {
//       setJobsLoading(false);
//     }
//   };

//   const populateFormData = (data) => {
//     setFormData({
//       firstName: data.firstName || '',
//       lastName: data.lastName || '',
//       email: data.email || '',
//       phone: data.phone || '',
//       alternativePhone: data.alternativePhone || '',
//       dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
//       gender: data.gender || '',
//       address: {
//         street: data.address?.street || '',
//         city: data.address?.city || '',
//         state: data.address?.state || '',
//         country: data.address?.country || 'India',
//         pincode: data.address?.pincode || ''
//       },
//       education: data.education || [],
//       experience: data.experience || [],
//       skills: data.skills || [],
//       source: data.source || 'other',
//       sourceUrl: data.sourceUrl || '',
//       referredBy: data.referredBy || '',
//       tags: data.tags || [],
//       status: data.status || 'new',
//       jobId: data.jobId || data.latestApplication?.jobId?._id || ''
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
      
//       // Clear error for this field
//       const fieldPath = `${parent}.${child}`;
//       if (fieldErrors[fieldPath]) {
//         setFieldErrors(prev => ({ ...prev, [fieldPath]: '' }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
      
//       // Clear error for this field
//       if (fieldErrors[name]) {
//         setFieldErrors(prev => ({ ...prev, [name]: '' }));
//       }
//     }
//     setError('');
//   };

//   const handleJobChange = (event, newValue) => {
//     setSelectedJob(newValue);
//     setFormData(prev => ({
//       ...prev,
//       jobId: newValue?._id || ''
//     }));
//   };

//   // Education handlers with validation
//   const validateNewEducation = () => {
//     const errors = {};
//     if (!newEducation.degree) errors.degree = 'Degree is required';
//     if (!newEducation.institution) errors.institution = 'Institution is required';
//     if (newEducation.yearOfPassing) {
//       const year = parseInt(newEducation.yearOfPassing);
//       if (year < 1900 || year > new Date().getFullYear()) {
//         errors.yearOfPassing = 'Please enter a valid year (1900-current year)';
//       }
//     }
//     if (newEducation.percentage && (newEducation.percentage < 0 || newEducation.percentage > 100)) {
//       errors.percentage = 'Percentage must be between 0 and 100';
//     }
//     return errors;
//   };

//   const handleAddEducation = () => {
//     const errors = validateNewEducation();
//     setNewEducationErrors(errors);

//     if (Object.keys(errors).length === 0 && newEducation.degree && newEducation.institution) {
//       setFormData(prev => ({
//         ...prev,
//         education: [...prev.education, { ...newEducation, _id: Date.now().toString() }]
//       }));
//       setNewEducation({
//         degree: '',
//         institution: '',
//         yearOfPassing: '',
//         percentage: '',
//         specialization: ''
//       });
//       setNewEducationErrors({});
      
//       // Clear education error
//       if (fieldErrors.education) {
//         setFieldErrors(prev => ({ ...prev, education: '' }));
//       }
//     }
//   };

//   const handleRemoveEducation = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index)
//     }));
//   };

//   // Experience handlers with validation
//   const validateNewExperience = () => {
//     const errors = {};
//     if (!newExperience.company) errors.company = 'Company is required';
//     if (!newExperience.position) errors.position = 'Position is required';
    
//     if (newExperience.fromDate && newExperience.toDate && !newExperience.current) {
//       if (new Date(newExperience.toDate) < new Date(newExperience.fromDate)) {
//         errors.date = 'To date must be after from date';
//       }
//     }
//     return errors;
//   };

//   const handleAddExperience = () => {
//     const errors = validateNewExperience();
//     setNewExperienceErrors(errors);

//     if (Object.keys(errors).length === 0 && newExperience.company && newExperience.position) {
//       setFormData(prev => ({
//         ...prev,
//         experience: [...prev.experience, { ...newExperience, _id: Date.now().toString() }]
//       }));
//       setNewExperience({
//         company: '',
//         position: '',
//         fromDate: '',
//         toDate: '',
//         current: false,
//         description: ''
//       });
//       setNewExperienceErrors({});
//     }
//   };

//   const handleRemoveExperience = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       experience: prev.experience.filter((_, i) => i !== index)
//     }));
//   };

//   const handleExperienceChange = (field, value) => {
//     setNewExperience(prev => {
//       const updated = { ...prev, [field]: value };
      
//       // Handle current checkbox
//       if (field === 'current' && value === true) {
//         updated.toDate = '';
//       }
      
//       return updated;
//     });

//     // Clear specific errors
//     if (field === 'company' || field === 'position') {
//       setNewExperienceErrors(prev => ({ ...prev, [field]: '', date: '' }));
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

//   const handleRemoveSkill = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter((_, i) => i !== index)
//     }));
//   };

//   // Tags handlers
//   const handleAddTag = () => {
//     setTagInputError('');

//     if (!tagInput.trim()) {
//       setTagInputError('Please enter a tag');
//       return;
//     }

//     if (formData.tags.includes(tagInput.trim())) {
//       setTagInputError('This tag has already been added');
//       return;
//     }

//     if (tagInput.trim().length > 30) {
//       setTagInputError('Tag cannot exceed 30 characters');
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       tags: [...prev.tags, tagInput.trim()]
//     }));
//     setTagInput('');
//   };

//   const handleRemoveTag = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter((_, i) => i !== index)
//     }));
//   };

//   const validateForm = () => {
//     // Validate all required fields
//     const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'source'];
//     for (const field of requiredFields) {
//       if (!formData[field]) {
//         return `${getFieldLabel(field)} is required`;
//       }
//     }

//     // Validate email format
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       return 'Please enter a valid email address';
//     }

//     // Validate phone format
//     if (!/^\d{10}$/.test(formData.phone)) {
//       return 'Phone number must be exactly 10 digits';
//     }

//     // Validate alternative phone if provided
//     if (formData.alternativePhone && !/^\d{10}$/.test(formData.alternativePhone)) {
//       return 'Alternative phone number must be exactly 10 digits';
//     }

//     // Validate date of birth if provided
//     if (formData.dateOfBirth) {
//       const dob = new Date(formData.dateOfBirth);
//       const today = new Date();
//       const age = today.getFullYear() - dob.getFullYear();
//       if (age < 18 || age > 70) {
//         return 'Age must be between 18 and 70 years';
//       }
//     }

//     return null;
//   };

//   const handleSubmit = async () => {
//     // Validate final step
//     if (!validateStep()) {
//       setError('Please fix all errors before submitting');
//       return;
//     }

//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const token = localStorage.getItem('token');
//       const candidateIdToUpdate = candidate?._id || candidateId;

//       const response = await axios.put(
//         `${BASE_URL}/api/candidates/${candidateIdToUpdate}`,
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setSuccess('Candidate updated successfully!');
//         setTimeout(() => {
//           onUpdate(response.data.data);
//           handleClose();
//         }, 1500);
//       } else {
//         setError(response.data.message || 'Failed to update candidate');
//       }
//     } catch (err) {
//       console.error('Error updating candidate:', err);
//       setError(err.response?.data?.message || 'Failed to update candidate. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (!loading && !fetchLoading) {
//       setActiveStep(0);
//       setError('');
//       setSuccess(false);
//       setTouched({});
//       setFieldErrors({});
//       setSkillInput('');
//       setSkillInputError('');
//       setTagInput('');
//       setTagInputError('');
//       setNewEducationErrors({});
//       setNewExperienceErrors({});
//       onClose();
//     }
//   };

//   const handleNext = () => {
//     setError('');
//     if (validateStep()) {
//       setActiveStep((prev) => prev + 1);
//     } else {
//       setError('Please fill all fields correctly');
//     }
//   };

//   const handleBack = () => {
//     setError('');
//     setActiveStep((prev) => prev - 1);
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//             <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <PersonIcon sx={{ color: '#1976D2' }} />
//               Personal Information
//             </Typography>
            
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="First Name *"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('firstName')}
//                   required
//                   variant="outlined"
//                   {...getErrorProps('firstName')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Last Name *"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('lastName')}
//                   required
//                   {...getErrorProps('lastName')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Email *"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('email')}
//                   required
//                   {...getErrorProps('email')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Phone *"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('phone')}
//                   required
//                   placeholder="10 digit number"
//                   {...getErrorProps('phone')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Alternative Phone"
//                   name="alternativePhone"
//                   value={formData.alternativePhone}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('alternativePhone')}
//                   placeholder="10 digit number"
//                   {...getErrorProps('alternativePhone')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Date of Birth"
//                   name="dateOfBirth"
//                   type="date"
//                   value={formData.dateOfBirth}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('dateOfBirth')}
//                   InputLabelProps={{ shrink: true }}
//                   {...getErrorProps('dateOfBirth')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Gender</InputLabel>
//                   <Select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     label="Gender"
//                   >
//                     <MenuItem value="">Select Gender</MenuItem>
//                     <MenuItem value="M">Male</MenuItem>
//                     <MenuItem value="F">Female</MenuItem>
//                     <MenuItem value="O">Other</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </Paper>
//         );

//       case 1:
//         return (
//           <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//             <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <LocationIcon sx={{ color: '#1976D2' }} />
//               Address Information
//             </Typography>
            
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Street"
//                   name="address.street"
//                   value={formData.address.street}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('address.street')}
//                   {...getErrorProps('address.street')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="City"
//                   name="address.city"
//                   value={formData.address.city}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('address.city')}
//                   {...getErrorProps('address.city')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="State"
//                   name="address.state"
//                   value={formData.address.state}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('address.state')}
//                   {...getErrorProps('address.state')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Pincode"
//                   name="address.pincode"
//                   value={formData.address.pincode}
//                   onChange={handleInputChange}
//                   onBlur={() => handleBlur('address.pincode')}
//                   placeholder="6 digit pincode"
//                   {...getErrorProps('address.pincode')}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Country"
//                   name="address.country"
//                   value={formData.address.country}
//                   onChange={handleInputChange}
//                   InputProps={{ readOnly: true }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         );

//       case 2:
//         return (
//           <Stack spacing={2}>
//             {/* Add New Education */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <SchoolIcon sx={{ color: '#1976D2' }} />
//                 Add Education
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Degree *"
//                     value={newEducation.degree}
//                     onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
//                     error={!!newEducationErrors.degree}
//                     helperText={newEducationErrors.degree}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Institution *"
//                     value={newEducation.institution}
//                     onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
//                     error={!!newEducationErrors.institution}
//                     helperText={newEducationErrors.institution}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Year"
//                     type="number"
//                     value={newEducation.yearOfPassing}
//                     onChange={(e) => setNewEducation({ ...newEducation, yearOfPassing: e.target.value })}
//                     inputProps={{ min: 1900, max: new Date().getFullYear() }}
//                     error={!!newEducationErrors.yearOfPassing}
//                     helperText={newEducationErrors.yearOfPassing}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Percentage"
//                     type="number"
//                     value={newEducation.percentage}
//                     onChange={(e) => setNewEducation({ ...newEducation, percentage: e.target.value })}
//                     inputProps={{ min: 0, max: 100, step: 0.01 }}
//                     error={!!newEducationErrors.percentage}
//                     helperText={newEducationErrors.percentage}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Specialization"
//                     value={newEducation.specialization}
//                     onChange={(e) => setNewEducation({ ...newEducation, specialization: e.target.value })}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={handleAddEducation}
//                     sx={{ borderRadius: 1.5, textTransform: 'none' }}
//                   >
//                     Add Education
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Education List */}
//             {formData.education.length > 0 && (
//               <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//                 <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                   Education History
//                 </Typography>
//                 {fieldErrors.education && (
//                   <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
//                     {fieldErrors.education}
//                   </Alert>
//                 )}
//                 {formData.education.map((edu, index) => (
//                   <Paper key={edu._id || index} sx={{ p: 2, bgcolor: '#F8FAFC', mb: 2, position: 'relative' }}>
//                     <IconButton
//                       size="small"
//                       onClick={() => handleRemoveEducation(index)}
//                       sx={{ position: 'absolute', top: 8, right: 8 }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} md={4}>
//                         <Typography variant="caption" color="textSecondary">Degree</Typography>
//                         <Typography variant="body2">{edu.degree}</Typography>
//                         {fieldErrors[`education[${index}].degree`] && (
//                           <Typography variant="caption" color="error">
//                             {fieldErrors[`education[${index}].degree`]}
//                           </Typography>
//                         )}
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <Typography variant="caption" color="textSecondary">Institution</Typography>
//                         <Typography variant="body2">{edu.institution}</Typography>
//                         {fieldErrors[`education[${index}].institution`] && (
//                           <Typography variant="caption" color="error">
//                             {fieldErrors[`education[${index}].institution`]}
//                           </Typography>
//                         )}
//                       </Grid>
//                       <Grid item xs={12} md={2}>
//                         <Typography variant="caption" color="textSecondary">Year</Typography>
//                         <Typography variant="body2">{edu.yearOfPassing}</Typography>
//                         {fieldErrors[`education[${index}].yearOfPassing`] && (
//                           <Typography variant="caption" color="error">
//                             {fieldErrors[`education[${index}].yearOfPassing`]}
//                           </Typography>
//                         )}
//                       </Grid>
//                       <Grid item xs={12} md={2}>
//                         <Typography variant="caption" color="textSecondary">Percentage</Typography>
//                         <Typography variant="body2">{edu.percentage}%</Typography>
//                       </Grid>
//                       {edu.specialization && (
//                         <Grid item xs={12}>
//                           <Typography variant="caption" color="textSecondary">Specialization</Typography>
//                           <Typography variant="body2">{edu.specialization}</Typography>
//                         </Grid>
//                       )}
//                     </Grid>
//                   </Paper>
//                 ))}
//               </Paper>
//             )}
//           </Stack>
//         );

//       case 3:
//         return (
//           <Stack spacing={2}>
//             {/* Add New Experience */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <WorkIcon sx={{ color: '#1976D2' }} />
//                 Add Experience
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Company *"
//                     value={newExperience.company}
//                     onChange={(e) => handleExperienceChange('company', e.target.value)}
//                     error={!!newExperienceErrors.company}
//                     helperText={newExperienceErrors.company}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Position *"
//                     value={newExperience.position}
//                     onChange={(e) => handleExperienceChange('position', e.target.value)}
//                     error={!!newExperienceErrors.position}
//                     helperText={newExperienceErrors.position}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={5}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="From Date"
//                     type="date"
//                     value={newExperience.fromDate}
//                     onChange={(e) => handleExperienceChange('fromDate', e.target.value)}
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={5}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="To Date"
//                     type="date"
//                     value={newExperience.toDate}
//                     onChange={(e) => handleExperienceChange('toDate', e.target.value)}
//                     InputLabelProps={{ shrink: true }}
//                     disabled={newExperience.current}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={2}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newExperience.current}
//                         onChange={(e) => handleExperienceChange('current', e.target.checked)}
//                       />
//                     }
//                     label="Current"
//                   />
//                 </Grid>
//                 {newExperienceErrors.date && (
//                   <Grid item xs={12}>
//                     <FormHelperText error>{newExperienceErrors.date}</FormHelperText>
//                   </Grid>
//                 )}
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Description"
//                     multiline
//                     rows={2}
//                     value={newExperience.description}
//                     onChange={(e) => handleExperienceChange('description', e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={handleAddExperience}
//                     sx={{ borderRadius: 1.5, textTransform: 'none' }}
//                   >
//                     Add Experience
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Experience List */}
//             {formData.experience.length > 0 && (
//               <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//                 <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                   Experience History
//                 </Typography>
//                 {formData.experience.map((exp, index) => (
//                   <Paper key={exp._id || index} sx={{ p: 2, bgcolor: '#F8FAFC', mb: 2, position: 'relative' }}>
//                     <IconButton
//                       size="small"
//                       onClick={() => handleRemoveExperience(index)}
//                       sx={{ position: 'absolute', top: 8, right: 8 }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} md={4}>
//                         <Typography variant="caption" color="textSecondary">Company</Typography>
//                         <Typography variant="body2">{exp.company}</Typography>
//                         {fieldErrors[`experience[${index}].details`] && (
//                           <Typography variant="caption" color="error">
//                             {fieldErrors[`experience[${index}].details`]}
//                           </Typography>
//                         )}
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <Typography variant="caption" color="textSecondary">Position</Typography>
//                         <Typography variant="body2">{exp.position}</Typography>
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <Typography variant="caption" color="textSecondary">Duration</Typography>
//                         <Typography variant="body2">
//                           {exp.fromDate ? new Date(exp.fromDate).toLocaleDateString() : 'N/A'} - 
//                           {exp.current ? 'Present' : (exp.toDate ? new Date(exp.toDate).toLocaleDateString() : 'N/A')}
//                         </Typography>
//                         {fieldErrors[`experience[${index}].date`] && (
//                           <Typography variant="caption" color="error">
//                             {fieldErrors[`experience[${index}].date`]}
//                           </Typography>
//                         )}
//                       </Grid>
//                       {exp.description && (
//                         <Grid item xs={12}>
//                           <Typography variant="caption" color="textSecondary">Description</Typography>
//                           <Typography variant="body2">{exp.description}</Typography>
//                         </Grid>
//                       )}
//                     </Grid>
//                   </Paper>
//                 ))}
//               </Paper>
//             )}
//           </Stack>
//         );

//       case 4:
//         return (
//           <Stack spacing={2}>
//             {/* Skills Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <StarIcon sx={{ color: '#1976D2' }} />
//                 Skills
//               </Typography>

//               {/* Add New Skill */}
//               <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//                 <TextField
//                   size="small"
//                   value={skillInput}
//                   onChange={(e) => {
//                     setSkillInput(e.target.value);
//                     setSkillInputError('');
//                   }}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
//                   placeholder="Add a skill"
//                   error={!!skillInputError}
//                   helperText={skillInputError}
//                   sx={{ flex: 1 }}
//                 />
//                 <Button
//                   variant="outlined"
//                   onClick={handleAddSkill}
//                   disabled={!skillInput.trim()}
//                   sx={{ borderRadius: 1.5, textTransform: 'none' }}
//                 >
//                   Add
//                 </Button>
//               </Box>

//               {/* Skills List */}
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                 {formData.skills.map((skill, index) => (
//                   <Chip
//                     key={index}
//                     label={skill}
//                     onDelete={() => handleRemoveSkill(index)}
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
//             </Paper>

//             {/* Source Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <LanguageIcon sx={{ color: '#1976D2' }} />
//                 Source Information
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth size="small" required error={touched.source && !!fieldErrors.source}>
//                     <InputLabel>Source *</InputLabel>
//                     <Select
//                       name="source"
//                       value={formData.source}
//                       onChange={handleInputChange}
//                       onBlur={() => handleBlur('source')}
//                       label="Source *"
//                     >
//                       {SOURCE_OPTIONS.map(option => (
//                         <MenuItem key={option.value} value={option.value}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {option.icon}
//                             {option.label}
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {touched.source && fieldErrors.source && (
//                       <FormHelperText>{fieldErrors.source}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Source URL"
//                     name="sourceUrl"
//                     value={formData.sourceUrl}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Referred By"
//                     name="referredBy"
//                     value={formData.referredBy}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Tags Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <BadgeIcon sx={{ color: '#1976D2' }} />
//                 Tags
//               </Typography>

//               {/* Add New Tag */}
//               <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//                 <TextField
//                   size="small"
//                   value={tagInput}
//                   onChange={(e) => {
//                     setTagInput(e.target.value);
//                     setTagInputError('');
//                   }}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
//                   placeholder="Add a tag"
//                   error={!!tagInputError}
//                   helperText={tagInputError}
//                   sx={{ flex: 1 }}
//                 />
//                 <Button
//                   variant="outlined"
//                   onClick={handleAddTag}
//                   disabled={!tagInput.trim()}
//                   sx={{ borderRadius: 1.5, textTransform: 'none' }}
//                 >
//                   Add
//                 </Button>
//               </Box>

//               {/* Tags List */}
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                 {formData.tags.map((tag, index) => (
//                   <Chip
//                     key={index}
//                     label={tag}
//                     onDelete={() => handleRemoveTag(index)}
//                     sx={{
//                       bgcolor: '#E8F5E8',
//                       color: '#2E7D32',
//                       '& .MuiChip-deleteIcon': { color: '#2E7D32' }
//                     }}
//                   />
//                 ))}
//                 {formData.tags.length === 0 && (
//                   <Typography variant="caption" color="textSecondary">
//                     No tags added yet
//                   </Typography>
//                 )}
//               </Box>
//             </Paper>
//           </Stack>
//         );

//       case 5:
//         return (
//           <Stack spacing={2}>
//             {/* Status Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 2 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <BadgeIcon sx={{ color: '#1976D2' }} />
//                 Status & Job Assignment
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       label="Status"
//                     >
//                       {STATUS_OPTIONS.map(option => (
//                         <MenuItem key={option.value} value={option.value}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {option.icon}
//                             {option.label}
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   {jobsLoading ? (
//                     <Box sx={{ display: 'flex', alignItems: 'center', height: '40px' }}>
//                       <CircularProgress size={20} sx={{ mr: 1 }} />
//                       <Typography variant="body2">Loading jobs...</Typography>
//                     </Box>
//                   ) : (
//                     <Autocomplete
//                       value={selectedJob}
//                       onChange={handleJobChange}
//                       options={availableJobs}
//                       getOptionLabel={(option) => `${option.title} (${option.jobId})`}
//                       isOptionEqualToValue={(option, value) => option._id === value._id}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Assign to Job"
//                           size="small"
//                           placeholder="Search job"
//                         />
//                       )}
//                     />
//                   )}
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Preview Card */}
//             <Paper sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
//               <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                 Candidate Summary
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <Typography variant="caption" color="textSecondary">Name</Typography>
//                   <Typography variant="body2">{formData.firstName} {formData.lastName}</Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="caption" color="textSecondary">Email</Typography>
//                   <Typography variant="body2">{formData.email}</Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="caption" color="textSecondary">Phone</Typography>
//                   <Typography variant="body2">{formData.phone}</Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="caption" color="textSecondary">Status</Typography>
//                   <Chip
//                     size="small"
//                     label={STATUS_OPTIONS.find(s => s.value === formData.status)?.label || formData.status}
//                     sx={{
//                       bgcolor: STATUS_OPTIONS.find(s => s.value === formData.status)?.bg,
//                       color: STATUS_OPTIONS.find(s => s.value === formData.status)?.color,
//                       height: 24
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="caption" color="textSecondary">Source</Typography>
//                   <Typography variant="body2">{SOURCE_OPTIONS.find(s => s.value === formData.source)?.label || formData.source}</Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="caption" color="textSecondary">Skills</Typography>
//                   <Typography variant="body2">{formData.skills.length} skills added</Typography>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         py: 2,
//         px: 3
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <EditIcon sx={{ color: '#1976D2' }} />
//           <Typography variant="h6" fontWeight={600}>
//             Edit Candidate
//           </Typography>
//           {candidate && (
//             <Chip
//               label={candidate.candidateId}
//               size="small"
//               sx={{
//                 bgcolor: '#E3F2FD',
//                 color: '#1976D2',
//                 fontWeight: 500,
//                 height: 24,
//                 fontSize: '12px',
//                 ml: 1
//               }}
//             />
//           )}
//         </Box>
//         <IconButton onClick={handleClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         {fetchLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//             <CircularProgress size={40} sx={{ color: '#1976D2' }} />
//           </Box>
//         ) : (
//           <>
//             <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
//               {steps.map((label) => (
//                 <Step key={label}>
//                   <StepLabel>{label}</StepLabel>
//                 </Step>
//               ))}
//             </Stepper>

//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//                 {error}
//               </Alert>
//             )}

//             {success && (
//               <Alert severity="success" sx={{ mb: 3 }}>
//                 {success}
//               </Alert>
//             )}

//             <Box sx={{ minHeight: 500 }}>
//               {getStepContent(activeStep)}
//             </Box>
//           </>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 3,
//         py: 2,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         display: 'flex',
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleClose}
//           variant="outlined"
//           disabled={loading || fetchLoading}
//           sx={{ borderRadius: 1.5, textTransform: 'none', px: 3 }}
//         >
//           Cancel
//         </Button>

//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             disabled={activeStep === 0 || loading}
//             onClick={handleBack}
//             startIcon={<ArrowBackIcon />}
//             sx={{ borderRadius: 1.5, textTransform: 'none' }}
//           >
//             Back
//           </Button>

//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || fetchLoading || Object.keys(fieldErrors).length > 0}
//               startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
//               sx={{
//                 borderRadius: 1.5,
//                 textTransform: 'none',
//                 px: 4,
//                 backgroundColor: '#1976D2',
//                 '&:hover': { backgroundColor: '#1565C0' }
//               }}
//             >
//               {loading ? 'Saving...' : 'Update Candidate'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               endIcon={<ArrowForwardIcon />}
//               disabled={loading}
//               sx={{
//                 borderRadius: 1.5,
//                 textTransform: 'none',
//                 px: 4,
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

// export default EditCandidate;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Grid,
  Box,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  InputAdornment,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  CloudUpload as CloudUploadIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon
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

// Status options based on backend enum
const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: COLORS.primaryDark, bg: COLORS.status.info, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'contacted', label: 'Contacted', color: '#7B1FA2', bg: '#F3E5F5', icon: <PersonIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'shortlisted', label: 'Shortlisted', color: COLORS.primaryDark, bg: COLORS.status.success, icon: <ThumbUpIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'interviewed', label: 'Interviewed', color: '#0288D1', bg: '#E1F5FE', icon: <PersonIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'selected', label: 'Selected', color: COLORS.primaryDark, bg: COLORS.status.success, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'rejected', label: 'Rejected', color: '#991B1B', bg: COLORS.status.error, icon: <ThumbDownIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'onHold', label: 'On Hold', color: '#92400E', bg: COLORS.status.warning, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
  { value: 'joined', label: 'Joined', color: COLORS.primaryDark, bg: COLORS.status.success, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> }
];

// Source options based on backend enum
const SOURCE_OPTIONS = [
  { value: 'naukri', label: 'Naukri', icon: <LanguageIcon sx={{ fontSize: '0.7rem' }} />, color: '#FF5722' },
  { value: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon sx={{ fontSize: '0.7rem' }} />, color: '#0077B5' },
  { value: 'indeed', label: 'Indeed', icon: <WorkIcon sx={{ fontSize: '0.7rem' }} />, color: '#003A9B' },
  { value: 'walkin', label: 'Walk-in', icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, color: '#4CAF50' },
  { value: 'reference', label: 'Reference', icon: <PeopleIcon sx={{ fontSize: '0.7rem' }} />, color: '#9C27B0' },
  { value: 'careerPage', label: 'Career Page', icon: <BusinessIcon sx={{ fontSize: '0.7rem' }} />, color: '#FF9800' },
  { value: 'upload', label: 'Upload', icon: <CloudUploadIcon sx={{ fontSize: '0.7rem' }} />, color: '#00BCD4' },
  { value: 'other', label: 'Other', icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, color: '#9E9E9E' }
];

const steps = ['Personal Info', 'Address', 'Education', 'Experience', 'Skills & Source', 'Status & Job'];

const EditCandidate = ({ open, onClose, onUpdate, candidateId, candidateData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [candidate, setCandidate] = useState(candidateData || null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [skillInputError, setSkillInputError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagInputError, setTagInputError] = useState('');

  // New item states for dynamic arrays
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    yearOfPassing: '',
    percentage: '',
    specialization: ''
  });
  const [newEducationErrors, setNewEducationErrors] = useState({});

  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    fromDate: '',
    toDate: '',
    current: false,
    description: ''
  });
  const [newExperienceErrors, setNewExperienceErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    education: [],
    experience: [],
    skills: [],
    source: 'other',
    sourceUrl: '',
    referredBy: '',
    tags: [],
    status: 'new',
    jobId: ''
  });

  // Validation rules
  const validationRules = {
    firstName: { required: true, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'First name should only contain letters and spaces' },
    lastName: { required: true, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'Last name should only contain letters and spaces' },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
    phone: { required: true, pattern: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' },
    alternativePhone: { required: false, pattern: /^\d{10}$/, message: 'Alternative phone number must be exactly 10 digits' },
    dateOfBirth: { required: false, validate: (value) => { if (!value) return true; const dob = new Date(value); const today = new Date(); const age = today.getFullYear() - dob.getFullYear(); return age >= 18 && age <= 70; }, message: 'Age must be between 18 and 70 years' },
    'address.street': { required: false, minLength: 5, maxLength: 200, message: 'Street address must be at least 5 characters' },
    'address.city': { required: false, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'City should only contain letters and spaces' },
    'address.state': { required: false, minLength: 2, maxLength: 50, pattern: /^[A-Za-z\s]+$/, message: 'State should only contain letters and spaces' },
    'address.pincode': { required: false, pattern: /^\d{6}$/, message: 'Pincode must be exactly 6 digits' },
    source: { required: true, message: 'Source is required' }
  };

  const getFieldLabel = (fieldPath) => {
    const labels = {
      firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone number',
      alternativePhone: 'Alternative phone', dateOfBirth: 'Date of birth',
      'address.street': 'Street address', 'address.city': 'City', 'address.state': 'State',
      'address.pincode': 'Pincode', source: 'Source'
    };
    return labels[fieldPath] || fieldPath;
  };

  const validateField = (fieldPath, value, allValues = formData) => {
    const rules = validationRules[fieldPath];
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

  const getStepFields = (step) => {
    switch (step) {
      case 0: return ['firstName', 'lastName', 'email', 'phone', 'alternativePhone', 'dateOfBirth'];
      case 1: return ['address.street', 'address.city', 'address.state', 'address.pincode'];
      case 4: return ['source'];
      default: return [];
    }
  };

  const validateStep = () => {
    const errors = {};
    const stepFields = getStepFields(activeStep);

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
    });

    if (activeStep === 2 && formData.education.length === 0) {
      errors['education'] = 'At least one education entry is recommended';
    }

    if (activeStep === 3) {
      formData.experience.forEach((exp, index) => {
        if (exp.company && (!exp.fromDate || !exp.position)) {
          errors[`experience[${index}].details`] = 'Please fill all experience details';
        }
        if (exp.fromDate && exp.toDate && !exp.current && new Date(exp.toDate) < new Date(exp.fromDate)) {
          errors[`experience[${index}].date`] = 'To date must be after from date';
        }
      });
    }

    setFieldErrors(errors);
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

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return { error: !!hasError, helperText: hasError || '' };
  };

  useEffect(() => {
    setFieldErrors({});
    setError('');
  }, [activeStep]);

  useEffect(() => {
    if (open) {
      fetchJobs();
      if (candidateData) {
        setCandidate(candidateData);
        populateFormData(candidateData);
      } else if (candidateId) {
        fetchCandidateDetails();
      }
    }
  }, [open, candidateData, candidateId]);

  useEffect(() => {
    if (formData.jobId && availableJobs.length > 0) {
      const job = availableJobs.find(j => j._id === formData.jobId);
      setSelectedJob(job || null);
    }
  }, [formData.jobId, availableJobs]);

  const fetchCandidateDetails = async () => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const candidateData = response.data.data;
        setCandidate(candidateData);
        populateFormData(candidateData);
      } else {
        setError(response.data.message || 'Failed to fetch candidate details');
      }
    } catch (err) {
      console.error('Error fetching candidate details:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidate details');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/jobs?status=published`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setAvailableJobs(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const populateFormData = (data) => {
    setFormData({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      alternativePhone: data.alternativePhone || '',
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
      gender: data.gender || '',
      address: {
        street: data.address?.street || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        country: data.address?.country || 'India',
        pincode: data.address?.pincode || ''
      },
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      source: data.source || 'other',
      sourceUrl: data.sourceUrl || '',
      referredBy: data.referredBy || '',
      tags: data.tags || [],
      status: data.status || 'new',
      jobId: data.jobId || data.latestApplication?.jobId?._id || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
      const fieldPath = `${parent}.${child}`;
      if (fieldErrors[fieldPath]) setFieldErrors(prev => ({ ...prev, [fieldPath]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleJobChange = (event, newValue) => {
    setSelectedJob(newValue);
    setFormData(prev => ({ ...prev, jobId: newValue?._id || '' }));
  };

  const validateNewEducation = () => {
    const errors = {};
    if (!newEducation.degree) errors.degree = 'Degree is required';
    if (!newEducation.institution) errors.institution = 'Institution is required';
    if (newEducation.yearOfPassing) {
      const year = parseInt(newEducation.yearOfPassing);
      if (year < 1900 || year > new Date().getFullYear()) {
        errors.yearOfPassing = 'Please enter a valid year (1900-current year)';
      }
    }
    if (newEducation.percentage && (newEducation.percentage < 0 || newEducation.percentage > 100)) {
      errors.percentage = 'Percentage must be between 0 and 100';
    }
    return errors;
  };

  const handleAddEducation = () => {
    const errors = validateNewEducation();
    setNewEducationErrors(errors);

    if (Object.keys(errors).length === 0 && newEducation.degree && newEducation.institution) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation, _id: Date.now().toString() }]
      }));
      setNewEducation({ degree: '', institution: '', yearOfPassing: '', percentage: '', specialization: '' });
      setNewEducationErrors({});
      if (fieldErrors.education) setFieldErrors(prev => ({ ...prev, education: '' }));
    }
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const validateNewExperience = () => {
    const errors = {};
    if (!newExperience.company) errors.company = 'Company is required';
    if (!newExperience.position) errors.position = 'Position is required';
    if (newExperience.fromDate && newExperience.toDate && !newExperience.current) {
      if (new Date(newExperience.toDate) < new Date(newExperience.fromDate)) {
        errors.date = 'To date must be after from date';
      }
    }
    return errors;
  };

  const handleAddExperience = () => {
    const errors = validateNewExperience();
    setNewExperienceErrors(errors);

    if (Object.keys(errors).length === 0 && newExperience.company && newExperience.position) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, _id: Date.now().toString() }]
      }));
      setNewExperience({ company: '', position: '', fromDate: '', toDate: '', current: false, description: '' });
      setNewExperienceErrors({});
    }
  };

  const handleRemoveExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (field, value) => {
    setNewExperience(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'current' && value === true) updated.toDate = '';
      return updated;
    });
    if (field === 'company' || field === 'position') {
      setNewExperienceErrors(prev => ({ ...prev, [field]: '', date: '' }));
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

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    setTagInputError('');
    if (!tagInput.trim()) { setTagInputError('Please enter a tag'); return; }
    if (formData.tags.includes(tagInput.trim())) { setTagInputError('This tag has already been added'); return; }
    if (tagInput.trim().length > 30) { setTagInputError('Tag cannot exceed 30 characters'); return; }
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput('');
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) return 'First name and last name are required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) return 'Phone number must be exactly 10 digits';
    if (formData.alternativePhone && !/^\d{10}$/.test(formData.alternativePhone)) return 'Alternative phone number must be exactly 10 digits';
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18 || age > 70) return 'Age must be between 18 and 70 years';
    }
    return null;
  };

  const handleNext = () => {
    setError('');
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    } else {
      setError('Please fill all fields correctly');
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) { setError('Please fix all errors before submitting'); return; }

    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const candidateIdToUpdate = candidate?._id || candidateId;

      const response = await axios.put(`${BASE_URL}/api/candidates/${candidateIdToUpdate}`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdate(response.data.data);
          handleClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update candidate');
      }
    } catch (err) {
      console.error('Error updating candidate:', err);
      setError(err.response?.data?.message || 'Failed to update candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !fetchLoading) {
      setActiveStep(0);
      setError('');
      setSuccess(false);
      setTouched({});
      setFieldErrors({});
      onClose();
    }
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
          <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Personal Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>First Name *</Typography>
                <TextField fullWidth name="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={() => handleBlur('firstName')} size="small" {...getErrorProps('firstName')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Last Name *</Typography>
                <TextField fullWidth name="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={() => handleBlur('lastName')} size="small" {...getErrorProps('lastName')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Email *</Typography>
                <TextField fullWidth name="email" type="email" value={formData.email} onChange={handleInputChange} onBlur={() => handleBlur('email')} size="small" {...getErrorProps('email')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Phone *</Typography>
                <TextField fullWidth name="phone" value={formData.phone} onChange={handleInputChange} onBlur={() => handleBlur('phone')} size="small" placeholder="10 digit number" {...getErrorProps('phone')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Alternative Phone</Typography>
                <TextField fullWidth name="alternativePhone" value={formData.alternativePhone} onChange={handleInputChange} onBlur={() => handleBlur('alternativePhone')} size="small" placeholder="10 digit number" {...getErrorProps('alternativePhone')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Date of Birth</Typography>
                <TextField fullWidth name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} onBlur={() => handleBlur('dateOfBirth')} size="small" InputLabelProps={{ shrink: true }} {...getErrorProps('dateOfBirth')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Gender</Typography>
                <FormControl fullWidth size="small">
                  <Select name="gender" value={formData.gender} onChange={handleInputChange} displayEmpty sx={{ borderRadius: 1.5, fontSize: '0.75rem', '& .MuiSelect-select': { py: 1, px: 1.5 } }}>
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select Gender</MenuItem>
                    <MenuItem value="M" sx={{ fontSize: '0.75rem' }}>Male</MenuItem>
                    <MenuItem value="F" sx={{ fontSize: '0.75rem' }}>Female</MenuItem>
                    <MenuItem value="O" sx={{ fontSize: '0.75rem' }}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        );

      case 1:
        return (
          <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Address Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography sx={labelStyle}>Street</Typography>
                <TextField fullWidth name="address.street" value={formData.address.street} onChange={handleInputChange} onBlur={() => handleBlur('address.street')} size="small" {...getErrorProps('address.street')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>City</Typography>
                <TextField fullWidth name="address.city" value={formData.address.city} onChange={handleInputChange} onBlur={() => handleBlur('address.city')} size="small" {...getErrorProps('address.city')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>State</Typography>
                <TextField fullWidth name="address.state" value={formData.address.state} onChange={handleInputChange} onBlur={() => handleBlur('address.state')} size="small" {...getErrorProps('address.state')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Pincode</Typography>
                <TextField fullWidth name="address.pincode" value={formData.address.pincode} onChange={handleInputChange} onBlur={() => handleBlur('address.pincode')} size="small" placeholder="6 digit pincode" {...getErrorProps('address.pincode')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={labelStyle}>Country</Typography>
                <TextField fullWidth name="address.country" value={formData.address.country} onChange={handleInputChange} size="small" InputProps={{ readOnly: true }} sx={inputStyle} />
              </Grid>
            </Grid>
          </Paper>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Add Education
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Degree *</Typography>
                  <TextField fullWidth size="small" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} error={!!newEducationErrors.degree} helperText={newEducationErrors.degree} sx={inputStyle} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Institution *</Typography>
                  <TextField fullWidth size="small" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} error={!!newEducationErrors.institution} helperText={newEducationErrors.institution} sx={inputStyle} />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={labelStyle}>Year</Typography>
                  <TextField fullWidth size="small" type="number" value={newEducation.yearOfPassing} onChange={(e) => setNewEducation({ ...newEducation, yearOfPassing: e.target.value })} inputProps={{ min: 1900, max: new Date().getFullYear() }} error={!!newEducationErrors.yearOfPassing} helperText={newEducationErrors.yearOfPassing} sx={inputStyle} />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={labelStyle}>Percentage</Typography>
                  <TextField fullWidth size="small" type="number" value={newEducation.percentage} onChange={(e) => setNewEducation({ ...newEducation, percentage: e.target.value })} inputProps={{ min: 0, max: 100, step: 0.01 }} error={!!newEducationErrors.percentage} helperText={newEducationErrors.percentage} sx={inputStyle} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Specialization</Typography>
                  <TextField fullWidth size="small" value={newEducation.specialization} onChange={(e) => setNewEducation({ ...newEducation, specialization: e.target.value })} sx={inputStyle} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddEducation} sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', borderColor: COLORS.border, color: COLORS.primary, '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` } }}>
                    Add Education
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {formData.education.length > 0 && (
              <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>Education History</Typography>
                {fieldErrors.education && <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{fieldErrors.education}</Alert>}
                {formData.education.map((edu, index) => (
                  <Paper key={edu._id || index} sx={{ p: 2, bgcolor: COLORS.background.light, mb: 2, position: 'relative', borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <IconButton size="small" onClick={() => handleRemoveEducation(index)} sx={{ position: 'absolute', top: 8, right: 8 }}><DeleteIcon fontSize="small" /></IconButton>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Degree</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.degree}</Typography></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Institution</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.institution}</Typography></Grid>
                      <Grid size={{ xs: 12, md: 2 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Year</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.yearOfPassing}</Typography></Grid>
                      <Grid size={{ xs: 12, md: 2 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>%</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.percentage}%</Typography></Grid>
                      {edu.specialization && <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Specialization</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.specialization}</Typography></Grid>}
                    </Grid>
                  </Paper>
                ))}
              </Paper>
            )}
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WorkIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Add Experience
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}><Typography sx={labelStyle}>Company *</Typography><TextField fullWidth size="small" value={newExperience.company} onChange={(e) => handleExperienceChange('company', e.target.value)} error={!!newExperienceErrors.company} helperText={newExperienceErrors.company} sx={inputStyle} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Typography sx={labelStyle}>Position *</Typography><TextField fullWidth size="small" value={newExperience.position} onChange={(e) => handleExperienceChange('position', e.target.value)} error={!!newExperienceErrors.position} helperText={newExperienceErrors.position} sx={inputStyle} /></Grid>
                <Grid size={{ xs: 12, md: 5 }}><Typography sx={labelStyle}>From Date</Typography><TextField fullWidth type="date" value={newExperience.fromDate} onChange={(e) => handleExperienceChange('fromDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={inputStyle} /></Grid>
                <Grid size={{ xs: 12, md: 5 }}><Typography sx={labelStyle}>To Date</Typography><TextField fullWidth type="date" value={newExperience.toDate} onChange={(e) => handleExperienceChange('toDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} disabled={newExperience.current} sx={inputStyle} /></Grid>
                <Grid size={{ xs: 12, md: 2 }}><FormControlLabel control={<Checkbox checked={newExperience.current} onChange={(e) => handleExperienceChange('current', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.7rem' }}>Current</Typography>} /></Grid>
                {newExperienceErrors.date && <Grid size={{ xs: 12 }}><FormHelperText error sx={{ fontSize: '0.65rem' }}>{newExperienceErrors.date}</FormHelperText></Grid>}
                <Grid size={{ xs: 12 }}><Typography sx={labelStyle}>Description</Typography><TextField fullWidth multiline rows={2} value={newExperience.description} onChange={(e) => handleExperienceChange('description', e.target.value)} size="small" sx={inputStyle} /></Grid>
                <Grid size={{ xs: 12 }}><Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddExperience} sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', borderColor: COLORS.border, color: COLORS.primary }}>Add Experience</Button></Grid>
              </Grid>
            </Paper>

            {formData.experience.length > 0 && (
              <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>Experience History</Typography>
                {formData.experience.map((exp, index) => (
                  <Paper key={exp._id || index} sx={{ p: 2, bgcolor: COLORS.background.light, mb: 2, position: 'relative', borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <IconButton size="small" onClick={() => handleRemoveExperience(index)} sx={{ position: 'absolute', top: 8, right: 8 }}><DeleteIcon fontSize="small" /></IconButton>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Company</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{exp.company}</Typography></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Position</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{exp.position}</Typography></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Duration</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{exp.fromDate ? new Date(exp.fromDate).toLocaleDateString() : 'N/A'} - {exp.current ? 'Present' : (exp.toDate ? new Date(exp.toDate).toLocaleDateString() : 'N/A')}</Typography></Grid>
                      {exp.description && <Grid size={{ xs: 12 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Description</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{exp.description}</Typography></Grid>}
                    </Grid>
                  </Paper>
                ))}
              </Paper>
            )}
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StarIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>Skills</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField size="small" value={skillInput} onChange={(e) => { setSkillInput(e.target.value); setSkillInputError(''); }} onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()} placeholder="Add a skill" error={!!skillInputError} helperText={skillInputError} sx={{ flex: 1, ...inputStyle }} />
                <Button variant="outlined" onClick={handleAddSkill} disabled={!skillInput.trim()} sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', borderColor: COLORS.border, color: COLORS.primary }}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.skills.map((skill, index) => (<Chip key={index} label={skill} onDelete={() => handleRemoveSkill(index)} sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />))}
                {formData.skills.length === 0 && <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>No skills added yet</Typography>}
              </Box>
            </Paper>

            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LanguageIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>Source Information</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Source *</Typography>
                  <FormControl fullWidth size="small" error={touched.source && !!fieldErrors.source}>
                    <Select name="source" value={formData.source} onChange={handleInputChange} onBlur={() => handleBlur('source')} displayEmpty sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                      {SOURCE_OPTIONS.map(option => (<MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{option.icon}{option.label}</Box></MenuItem>))}
                    </Select>
                    {touched.source && fieldErrors.source && <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.source}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}><Typography sx={labelStyle}>Source URL</Typography><TextField fullWidth name="sourceUrl" value={formData.sourceUrl} onChange={handleInputChange} size="small" sx={inputStyle} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><Typography sx={labelStyle}>Referred By</Typography><TextField fullWidth name="referredBy" value={formData.referredBy} onChange={handleInputChange} size="small" sx={inputStyle} /></Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BadgeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>Tags</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField size="small" value={tagInput} onChange={(e) => { setTagInput(e.target.value); setTagInputError(''); }} onKeyPress={(e) => e.key === 'Enter' && handleAddTag()} placeholder="Add a tag" error={!!tagInputError} helperText={tagInputError} sx={{ flex: 1, ...inputStyle }} />
                <Button variant="outlined" onClick={handleAddTag} disabled={!tagInput.trim()} sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem' }}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.tags.map((tag, index) => (<Chip key={index} label={tag} onDelete={() => handleRemoveTag(index)} sx={{ bgcolor: COLORS.status.success, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />))}
                {formData.tags.length === 0 && <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>No tags added yet</Typography>}
              </Box>
            </Paper>
          </Stack>
        );

      case 5:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BadgeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>Status & Job Assignment</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Status</Typography>
                  <FormControl fullWidth size="small">
                    <Select name="status" value={formData.status} onChange={handleInputChange} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                      {STATUS_OPTIONS.map(option => (<MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{option.icon}{option.label}</Box></MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Assign to Job</Typography>
                  {jobsLoading ? <CircularProgress size={20} /> : (
                    <Autocomplete value={selectedJob} onChange={handleJobChange} options={availableJobs} getOptionLabel={(option) => `${option.title} (${option.jobId})`} isOptionEqualToValue={(option, value) => option._id === value._id} renderInput={(params) => <TextField {...params} size="small" placeholder="Search job" sx={inputStyle} />} />
                  )}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>Candidate Summary</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Name</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.firstName} {formData.lastName}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Email</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.email}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Phone</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.phone}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Status</Typography><Chip size="small" label={STATUS_OPTIONS.find(s => s.value === formData.status)?.label} sx={{ bgcolor: STATUS_OPTIONS.find(s => s.value === formData.status)?.bg, color: STATUS_OPTIONS.find(s => s.value === formData.status)?.color, height: 24, fontSize: '0.65rem' }} /></Grid>
                <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Source</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{SOURCE_OPTIONS.find(s => s.value === formData.source)?.label}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Skills</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.skills.length} skills added</Typography></Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 5, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}`, overflow: 'hidden', maxHeight: '90vh' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, bgcolor: COLORS.background.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Edit Candidate</Typography>
          {candidate && <Chip label={candidate.candidateId} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }} />}
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} /></IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (<Step key={label}><StepLabel><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</Typography></StepLabel></Step>))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetchLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}><CircularProgress size={40} sx={{ color: COLORS.primary }} /></Box> : renderStepContent(activeStep)}
        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>Candidate updated successfully!</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'space-between' }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Cancel</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button disabled={activeStep === 0 || loading} onClick={handleBack} startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Back</Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>{loading ? 'Saving...' : 'Update Candidate'}</Button>
          ) : (
            <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Next</Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCandidate;