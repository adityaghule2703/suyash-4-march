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
  FormHelperText
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
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Custom Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 4,
    border: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  '&.Mui-active .MuiStepConnector-line': {
    background: 'linear-gradient(90deg, #164e63, #00B4D8)',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    background: 'linear-gradient(90deg, #164e63, #00B4D8)',
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
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: 'First name should only contain letters and spaces'
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: 'Last name should only contain letters and spaces'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: /^\d{10}$/,
      message: 'Phone number must be exactly 10 digits'
    },
    dateOfBirth: {
      required: false,
      validate: (value) => {
        if (!value) return true;
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        return age >= 18 && age <= 70;
      },
      message: 'Age must be between 18 and 70 years'
    },
    'address.street': {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Street address must be at least 5 characters'
    },
    'address.city': {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: 'City should only contain letters and spaces'
    },
    'address.state': {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: 'State should only contain letters and spaces'
    },
    'address.pincode': {
      required: true,
      pattern: /^\d{6}$/,
      message: 'Pincode must be exactly 6 digits'
    }
  };

  // Validate a single field
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
    if (fieldPath.includes('.')) {
      return validationRules[fieldPath];
    }
    return validationRules[fieldPath];
  };

  const getFieldLabel = (fieldPath) => {
    const labels = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone number',
      dateOfBirth: 'Date of birth',
      'address.street': 'Street address',
      'address.city': 'City',
      'address.state': 'State',
      'address.pincode': 'Pincode',
      'address.country': 'Country'
    };
    return labels[fieldPath] || fieldPath;
  };

  // Validate all fields in current step
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
      if (error) {
        errors[field] = error;
      }
    });

    // Additional validations
    if (activeStep === 0) {
      // Email format validation (already handled by pattern)
      // Phone format validation (already handled by pattern)
    }

    if (activeStep === 2) {
      // Validate education entries
      if (formData.education.length === 0 || !formData.education[0].degree) {
        errors['education'] = 'At least one education entry is required';
      } else {
        formData.education.forEach((edu, index) => {
          if (!edu.degree) errors[`education[${index}].degree`] = 'Degree is required';
          if (!edu.institution) errors[`education[${index}].institution`] = 'Institution is required';
          if (!edu.yearOfPassing) {
            errors[`education[${index}].yearOfPassing`] = 'Year of passing is required';
          } else if (edu.yearOfPassing < 1900 || edu.yearOfPassing > new Date().getFullYear()) {
            errors[`education[${index}].yearOfPassing`] = 'Please enter a valid year';
          }
        });
      }
    }

    if (activeStep === 3) {
      // Validate experience entries
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
    return Object.keys(errors).length === 0;
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0: return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
      case 1: return ['address.street', 'address.city', 'address.state', 'address.pincode'];
      case 2: return [];
      case 3: return [];
      default: return [];
    }
  };

  // Handle field blur
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

  // Fetch jobs when dialog opens
  useEffect(() => {
    if (open) {
      fetchJobs();
    }
  }, [open]);

  // Reset errors when step changes
  useEffect(() => {
    setFieldErrors({});
    setError('');
  }, [activeStep]);

  // Set selected job if jobId is provided
  useEffect(() => {
    if (jobId && jobs.length > 0) {
      const job = jobs.find(j => j._id === jobId);
      setSelectedJob(job || null);
      setFormData(prev => ({
        ...prev,
        jobId: jobId
      }));
    }
  }, [jobId, jobs]);

  const fetchJobs = async () => {
    setJobsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          status: 'published'
        }
      });

      if (response.data.success) {
        setJobs(response.data.data || []);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const handleJobChange = (event, newValue) => {
    setSelectedJob(newValue);
    setFormData(prev => ({
      ...prev,
      jobId: newValue?._id || ''
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));

    // Clear error for this field
    const fieldPath = `address.${name}`;
    if (fieldErrors[fieldPath]) {
      setFieldErrors(prev => ({ ...prev, [fieldPath]: '' }));
    }
    setError('');
  };

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;

    if (field === 'current' && value === true) {
      updatedExperience[index].toDate = '';
    }

    setFormData(prev => ({
      ...prev,
      experience: updatedExperience
    }));

    // Clear related errors
    const errorFields = [`experience[${index}].details`, `experience[${index}].date`];
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      errorFields.forEach(f => delete newErrors[f]);
      return newErrors;
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          fromDate: '',
          toDate: '',
          current: false,
          description: ''
        }
      ]
    }));
  };

  const removeExperience = (index) => {
    if (formData.experience.length > 1) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }));
    }
  };

  // Education handlers
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));

    // Clear education errors
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
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          yearOfPassing: '',
          specialization: ''
        }
      ]
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  // Skills handlers
  const handleAddSkill = () => {
    setSkillInputError('');

    if (!skillInput.trim()) {
      setSkillInputError('Please enter a skill');
      return;
    }

    if (formData.skills.includes(skillInput.trim())) {
      setSkillInputError('This skill has already been added');
      return;
    }

    if (skillInput.trim().length > 50) {
      setSkillInputError('Skill name cannot exceed 50 characters');
      return;
    }

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    setSkillInput('');
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

  const handleNext = () => {
    setError('');
    if (validateStep()) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      setError('Please fill all required fields');
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    // Validate final step
    if (!validateStep()) {
      setError('Please fix all errors before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Final validation before submission
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error('Please fill all required fields');
      }

      if (!/^\d{10}$/.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await axios.post(`${BASE_URL}/api/candidates`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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

      // Handle specific error messages
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to add candidate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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

  // Helper to get error props for TextField
  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return {
      error: !!hasError,
      helperText: hasError || ''
    };
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
              Personal Information
            </Typography>

            {/* Job Selection Dropdown */}
            <Paper sx={{ p: 2, bgcolor: '#F0F7FF', border: '1px solid #BBDEFB', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <JobIcon sx={{ color: '#1976D2' }} />
                Apply for Job *
              </Typography>

              {jobsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Autocomplete
                  value={selectedJob}
                  onChange={handleJobChange}
                  options={jobs}
                  getOptionLabel={(option) => `${option.title} (${option.jobId}) - ${option.location}`}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  loading={jobsLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Job *"
                      placeholder="Search by job title or ID"
                      size="small"
                      required
                      error={touched.jobId && fieldErrors.jobId}
                      helperText={touched.jobId && fieldErrors.jobId}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {jobsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {option.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.jobId} • {option.location} • {option.department}
                        </Typography>
                        {option.status === 'published' && (
                          <Chip
                            label="Published"
                            size="small"
                            color="success"
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </li>
                  )}
                  noOptionsText="No jobs found"
                />
              )}

              {selectedJob && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#E3F2FD', borderRadius: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Job ID</Typography>
                      <Typography variant="body2">{selectedJob.jobId}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Location</Typography>
                      <Typography variant="body2">{selectedJob.location}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Department</Typography>
                      <Typography variant="body2">{selectedJob.department}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Employment Type</Typography>
                      <Typography variant="body2">{selectedJob.employmentType}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('firstName')}
                  size="small"
                  required
                  {...getErrorProps('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('lastName')}
                  size="small"
                  required
                  {...getErrorProps('lastName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  size="small"
                  required
                  {...getErrorProps('email')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('phone')}
                  size="small"
                  required
                  placeholder="10 digit number"
                  {...getErrorProps('phone')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('dateOfBirth')}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  {...getErrorProps('dateOfBirth')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  error={touched.gender && fieldErrors.gender}
                  sx={{
                    minWidth: '200px',  // Ensures minimum width
                    '& .MuiInputBase-root': {
                      width: '100%'
                    }
                  }}
                >
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('gender')}
                    label="Gender"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          width: 'auto',
                          minWidth: 200
                        }
                      }
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiSelect-select': {
                        whiteSpace: 'normal',  // Prevents text truncation
                        overflow: 'visible'
                      }
                    }}
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </Select>
                  {touched.gender && fieldErrors.gender && (
                    <FormHelperText>{fieldErrors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
              <LocationIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street *"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  onBlur={() => handleBlur('address.street')}
                  size="small"
                  required
                  {...getErrorProps('address.street')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City *"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  onBlur={() => handleBlur('address.city')}
                  size="small"
                  required
                  {...getErrorProps('address.city')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State *"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  onBlur={() => handleBlur('address.state')}
                  size="small"
                  required
                  {...getErrorProps('address.state')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode *"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  onBlur={() => handleBlur('address.pincode')}
                  size="small"
                  required
                  placeholder="6 digit pincode"
                  {...getErrorProps('address.pincode')}
                />
              </Grid>
            </Grid>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={4}>
            {/* Education Section */}
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
                Education
              </Typography>

              {fieldErrors.education && (
                <Alert severity="error" sx={{ borderRadius: 1 }}>
                  {fieldErrors.education}
                </Alert>
              )}

              {formData.education.map((edu, index) => (
                <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Education #{index + 1}
                    </Typography>
                    {formData.education.length > 1 && (
                      <IconButton size="small" onClick={() => removeEducation(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Degree *"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        onBlur={() => handleBlur(`education[${index}].degree`)}
                        size="small"
                        required={index === 0}
                        error={!!fieldErrors[`education[${index}].degree`]}
                        helperText={fieldErrors[`education[${index}].degree`] || ''}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Institution *"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        onBlur={() => handleBlur(`education[${index}].institution`)}
                        size="small"
                        required={index === 0}
                        error={!!fieldErrors[`education[${index}].institution`]}
                        helperText={fieldErrors[`education[${index}].institution`] || ''}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Year of Passing *"
                        type="number"
                        value={edu.yearOfPassing}
                        onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)}
                        onBlur={() => handleBlur(`education[${index}].yearOfPassing`)}
                        size="small"
                        required={index === 0}
                        error={!!fieldErrors[`education[${index}].yearOfPassing`]}
                        helperText={fieldErrors[`education[${index}].yearOfPassing`] || ''}
                        inputProps={{ min: 1900, max: new Date().getFullYear() }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        value={edu.specialization}
                        onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addEducation}
                variant="outlined"
                size="small"
                sx={{ alignSelf: 'flex-start', borderRadius: 1.5 }}
              >
                Add Another Education
              </Button>
            </Stack>

            {/* Skills Section */}
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
                Skills
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Enter a skill"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setSkillInputError('');
                  }}
                  onKeyPress={handleKeyPress}
                  size="small"
                  error={!!skillInputError}
                  helperText={skillInputError}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                  sx={{ borderRadius: 1.5, textTransform: 'none' }}
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
                      bgcolor: '#E3F2FD',
                      color: '#1976D2',
                      '& .MuiChip-deleteIcon': { color: '#1976D2' }
                    }}
                  />
                ))}
                {formData.skills.length === 0 && (
                  <Typography variant="caption" color="textSecondary">
                    No skills added yet
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
              <WorkIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976D2' }} />
              Work Experience
            </Typography>

            {formData.experience.map((exp, index) => (
              <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Experience #{index + 1}
                  </Typography>
                  {formData.experience.length > 1 && (
                    <IconButton size="small" onClick={() => removeExperience(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                {fieldErrors[`experience[${index}].details`] && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                    {fieldErrors[`experience[${index}].details`]}
                  </Alert>
                )}
                {fieldErrors[`experience[${index}].date`] && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                    {fieldErrors[`experience[${index}].date`]}
                  </Alert>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="From Date"
                      type="date"
                      value={exp.fromDate}
                      onChange={(e) => handleExperienceChange(index, 'fromDate', e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="To Date"
                      type="date"
                      value={exp.toDate}
                      onChange={(e) => handleExperienceChange(index, 'toDate', e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      disabled={exp.current}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={exp.current}
                          onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                        />
                      }
                      label="Current"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addExperience}
              variant="outlined"
              size="small"
              sx={{ alignSelf: 'flex-start', borderRadius: 1.5 }}
            >
              Add Another Experience
            </Button>

            {/* Source Selection */}
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Source</InputLabel>
                <Select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  label="Source"
                >
                  <MenuItem value="walkin">Walk-in</MenuItem>
                  <MenuItem value="portal">Job Portal</MenuItem>
                  <MenuItem value="referral">Referral</MenuItem>
                  <MenuItem value="consultant">Consultant</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        pb: 2,
        backgroundColor: '#F8FAFC',
        position: 'sticky',
        top: 0,
        zIndex: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} color="#101010">
            Add New Candidate
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={4}>
          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorConnector />}
            sx={{ mb: 2 }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body2" fontWeight={500}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

       

          <Divider />

          {/* Step Content */}
          {renderStepContent(activeStep)}

          {/* Error/Success Messages */}
          {error && (
            <Alert
              severity="error"
              sx={{ borderRadius: 1 }}
              icon={<ErrorIcon />}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ borderRadius: 1 }}
              icon={<CheckCircleIcon />}
            >
              {success}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        position: 'sticky',
        bottom: 0,
        zIndex: 1,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          sx={{ borderRadius: 1.5, textTransform: 'none' }}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Cancel
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || Object.keys(fieldErrors).length > 0}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                '&:hover': { opacity: 0.9 },
                '&.Mui-disabled': {
                  background: '#E0E0E0'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Candidate'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                '&:hover': { opacity: 0.9 }
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