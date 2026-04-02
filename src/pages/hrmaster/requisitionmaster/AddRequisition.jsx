
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
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);

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

  // Handle department added from modal
const handleDepartmentAdded = (newDepartment) => {
  // Add the new department to the departments list
  setDepartments(prev => [...prev, newDepartment]);
  // Automatically select the newly added department
  setFormData(prev => ({
    ...prev,
    department: newDepartment
  }));
  // Clear any department-related error
  if (fieldErrors.department) {
    setFieldErrors(prev => ({
      ...prev,
      department: ''
    }));
  }
  // Clear touched state for department
  setTouched(prev => ({
    ...prev,
    department: true
  }));
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
  
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
    <Box sx={{ flex: 1 }}>
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
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {departmentLoading && <CircularProgress size={16} />}
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

      {/* Add Department Modal */}
<AddDepartments
  open={addDepartmentOpen}
  onClose={() => setAddDepartmentOpen(false)}
  onAdd={handleDepartmentAdded}
/>
    </Dialog>
  );
};

export default AddRequisition;