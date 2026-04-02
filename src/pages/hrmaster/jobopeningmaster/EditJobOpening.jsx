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
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddDepartments from '../departmentmaster/AddDepartments';

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

const steps = ["Basic Information", "Job Details", "Review & Save"];

const EditJobOpening = ({ open, onClose, job, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    description: '',
    companyIntro: '',
    requirements: [],
    responsibilities: [],
    location: '',
    department: '',
    employmentType: '',
    experienceRequired: { min: 0, max: 0 },
    salaryRange: { min: 0, max: 0, currency: 'INR' },
    skills: [],
    education: []
  });

  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [educationInput, setEducationInput] = useState('');
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);

  const [departments, setDepartments] = useState([]);
const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const employmentTypes = ['Permanent', 'Contract', 'Temporary', 'Internship'];
  const currencies = ['INR'];

  // Fetch departments for dropdown
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
    console.error('Error fetching departments:', error);
  } finally {
    setDepartmentsLoading(false);
  }
};


  useEffect(() => {
    if (job && open) {
      setFormData({
        description: job.description || '',
        companyIntro: job.companyIntro || '',
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        location: job.location || '',
        department: job.department || '',
        employmentType: job.employmentType || '',
        experienceRequired: job.experienceRequired || { min: 0, max: 0 },
        salaryRange: job.salaryRange || { min: 0, max: 0, currency: 'INR' },
        skills: job.skills || [],
        education: job.education || []
      });
    }
  }, [job, open]);

  // Handle department added from modal
const handleDepartmentAdded = (newDepartment) => {
  // Add the new department to the departments list
  setDepartments(prev => [...prev, newDepartment]);
  // Automatically select the newly added department
  setFormData(prev => ({
    ...prev,
    department: newDepartment.DepartmentName
  }));
  // Clear any department-related error
  if (fieldErrors.department) {
    setFieldErrors(prev => ({ ...prev, department: '' }));
  }
  // Clear touched state for department
  setTouched(prev => ({ ...prev, department: true }));
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

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    switch (activeStep) {
      case 0:
        if (!formData.companyIntro.trim()) {
          errors.companyIntro = 'Company introduction is required';
          isValid = false;
        }
        if (!formData.location.trim()) {
          errors.location = 'Location is required';
          isValid = false;
        }
        if (!formData.department.trim()) {
          errors.department = 'Department is required';
          isValid = false;
        }
        if (!formData.employmentType) {
          errors.employmentType = 'Employment type is required';
          isValid = false;
        }
        break;

      case 1:
        if (!formData.description.trim()) {
          errors.description = 'Job description is required';
          isValid = false;
        }
        if (formData.requirements.length === 0) {
          errors.requirements = 'Please add at least one requirement';
          isValid = false;
        }
        if (formData.responsibilities.length === 0) {
          errors.responsibilities = 'Please add at least one responsibility';
          isValid = false;
        }
        if (formData.experienceRequired.min < 0 || formData.experienceRequired.max < formData.experienceRequired.min) {
          errors.experience = 'Please enter valid experience range';
          isValid = false;
        }
        if (formData.salaryRange.min < 0 || formData.salaryRange.max < formData.salaryRange.min) {
          errors.salary = 'Please enter valid salary range';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors before proceeding');
    } else {
      setError('');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      description: formData.description,
      companyIntro: formData.companyIntro,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      location: formData.location,
      department: formData.department,
      employmentType: formData.employmentType,
      experienceRequired: {
        min: Number(formData.experienceRequired.min),
        max: Number(formData.experienceRequired.max)
      },
      salaryRange: {
        min: Number(formData.salaryRange.min),
        max: Number(formData.salaryRange.max),
        currency: formData.salaryRange.currency
      },
      skills: formData.skills,
      education: formData.education
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/jobs/${job._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess('Job updated successfully!');
        onUpdate(response.data.data);
        setTimeout(() => {
          handleModalClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update job');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.message || 'Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setActiveStep(0);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setTouched({});
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

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
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
          <EditIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Job Opening
          </Typography>
          {job && (
            <Chip
              label={job.jobId}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleModalClose} size="small">
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
        <Stack spacing={2.5}>
          {/* Step 1: Basic Information */}
          {activeStep === 0 && (
            <>
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
    
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1 }}>
        <FormControl fullWidth size="small" error={touched.department && !!fieldErrors.department}>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            displayEmpty
            sx={inputStyle}
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
      
      <Button
        variant="outlined"
        size="small"
        onClick={() => setAddDepartmentOpen(true)}
        disabled={loading}
        startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
        sx={{
          height: 36,
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
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
                        {employmentTypes.map(type => (
                          <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                        ))}
                      </Select>
                      {touched.employmentType && fieldErrors.employmentType && (
                        <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.employmentType}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {/* Step 2: Job Details */}
          {activeStep === 1 && (
            <>
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
                  sx={inputStyle}
                />
              </Box>

              {/* Requirements */}
              <Box>
                <Typography sx={labelStyle}>Requirements *</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Add a requirement (e.g., Minimum 2 years experience)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddRequirement}
                    disabled={!requirementInput.trim()}
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

              {/* Responsibilities */}
              <Box>
                <Typography sx={labelStyle}>Responsibilities *</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    placeholder="Add a responsibility (e.g., Operate production machinery)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddResponsibility()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddResponsibility}
                    disabled={!responsibilityInput.trim()}
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

              {/* Experience Range */}
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
                      inputProps={{ min: formData.experienceRequired.min }}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Salary Range */}
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
                      inputProps={{ min: 0 }}
                      sx={inputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
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
                        sx={inputStyle}
                      >
                        {currencies.map(curr => (
                          <MenuItem key={curr} value={curr} sx={{ fontSize: '0.75rem' }}>{curr}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              {/* Skills */}
              <Box>
                <Typography sx={labelStyle}>Required Skills</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., Lathe operation)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
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

              {/* Education */}
              <Box>
                <Typography sx={labelStyle}>Education Requirements</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={educationInput}
                    onChange={(e) => setEducationInput(e.target.value)}
                    placeholder="Add education (e.g., ITI/Diploma in Mechanical)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEducation()}
                    sx={inputStyle}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddEducation}
                    disabled={!educationInput.trim()}
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
            </>
          )}

          {/* Step 3: Review & Save */}
          {activeStep === 2 && (
            <>
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                Please review all the information before saving.
              </Alert>

              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                  Summary
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography sx={labelStyle}>Company Introduction</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formData.companyIntro.substring(0, 100)}...
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: COLORS.border }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Location</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.location}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Department</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.department}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Employment Type</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formData.employmentType}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Experience</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formData.experienceRequired.min} - {formData.experienceRequired.max} years
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={labelStyle}>Salary Range</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formData.salaryRange.currency} {formData.salaryRange.min.toLocaleString()} - {formData.salaryRange.max.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ borderColor: COLORS.border }} />

                  <Box>
                    <Typography sx={labelStyle}>Requirements ({formData.requirements.length})</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.requirements.map((req, idx) => (
                        <Chip key={idx} label={req} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={labelStyle}>Responsibilities ({formData.responsibilities.length})</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.responsibilities.map((resp, idx) => (
                        <Chip key={idx} label={resp} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 24 }} />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {success}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleModalClose}
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
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
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
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
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
              {saving ? 'Saving...' : 'Save Changes'}
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

export default EditJobOpening;