// AddDefectCode.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
  FormControl,
  Select,
  Chip,
  OutlinedInput,
  FormHelperText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon,
  Build as BuildIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E6F4F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

// Updated defect categories based on the image
const DEFECT_CATEGORIES = [
  'Dimensional',
  'Visual/Surface',
  'Material',
  'Functional',
  'Process',
  'Quantity',
  'Documentation'
];

const SEVERITY_LEVELS = [
  'Critical',
  'Major',
  'Minor',
];

// Steps for stepper
const steps = [
  'Basic Information',
  'Processes & Description',
  'Image & Review'
];

// Modern Stepper Connector
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
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const AddDefectCode = ({ open, onClose, onDefectCodeAdded }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processes, setProcesses] = useState([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stepErrors, setStepErrors] = useState({});
  
  const [formData, setFormData] = useState({
    defect_code: '',
    defect_name: '',
    defect_category: '',
    defect_description: '',
    applicable_processes: [], // This will store ObjectIds
    severity_default: 'Major',
    image: null
  });

  const [touched, setTouched] = useState({
    defect_code: false,
    defect_name: false,
    defect_category: false,
    defect_description: false
  });

  // Fetch processes from API
  useEffect(() => {
    if (open) {
      fetchProcesses();
    }
  }, [open]);

  const fetchProcesses = async () => {
    try {
      setLoadingProcesses(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/processes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProcesses(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching processes:', err);
    } finally {
      setLoadingProcesses(false);
    }
  };

  const handleChange = (field, value) => {
    // Auto-format defect code to uppercase
    if (field === 'defect_code') {
      value = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (touched[field]) {
      setTouched(prev => ({
        ...prev,
        [field]: false
      }));
    }
    
    if (error) setError("");
    if (stepErrors[activeStep]) {
      setStepErrors(prev => ({ ...prev, [activeStep]: false }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleProcessesChange = (event) => {
    const selectedIds = event.target.value; // Get array of IDs
    setFormData(prev => ({
      ...prev,
      applicable_processes: selectedIds // Store only IDs
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WEBP images are allowed');
        return;
      }
      
      setSelectedImage(file);
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Information
        if (!formData.defect_code || !formData.defect_code.trim()) {
          setError('Defect code is required');
          setTouched(prev => ({ ...prev, defect_code: true }));
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        if (formData.defect_code.trim().length < 3) {
          setError('Defect code must be at least 3 characters');
          setTouched(prev => ({ ...prev, defect_code: true }));
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        if (!formData.defect_name || !formData.defect_name.trim()) {
          setError('Defect name is required');
          setTouched(prev => ({ ...prev, defect_name: true }));
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        if (!formData.defect_category) {
          setError('Defect category is required');
          setTouched(prev => ({ ...prev, defect_category: true }));
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        setError('');
        setStepErrors(prev => ({ ...prev, [step]: false }));
        return true;

      case 1: // Processes & Description
        if (!formData.defect_description || !formData.defect_description.trim()) {
          setError('Defect description is required');
          setTouched(prev => ({ ...prev, defect_description: true }));
          setStepErrors(prev => ({ ...prev, [step]: true }));
          return false;
        }
        setError('');
        setStepErrors(prev => ({ ...prev, [step]: false }));
        return true;

      case 2: // Image & Review
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    // Validate all steps before submit
    const isStep0Valid = validateStep(0);
    const isStep1Valid = validateStep(1);
    
    if (!isStep0Valid || !isStep1Valid) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('defect_code', formData.defect_code.trim());
      formDataToSend.append('defect_name', formData.defect_name.trim());
      formDataToSend.append('defect_category', formData.defect_category);
      formDataToSend.append('defect_description', formData.defect_description.trim());
      
      // Send applicable_processes as JSON string of IDs
      if (formData.applicable_processes && formData.applicable_processes.length > 0) {
        formDataToSend.append('applicable_processes', JSON.stringify(formData.applicable_processes));
      } else {
        formDataToSend.append('applicable_processes', '');
      }
      
      if (formData.severity_default) {
        formDataToSend.append('severity_default', formData.severity_default);
      } else {
        formDataToSend.append('severity_default', '');
      }
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else {
        formDataToSend.append('image', '');
      }

      const response = await axios.post(
        `${BASE_URL}/api/defect-codes`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        if (onDefectCodeAdded) {
          onDefectCodeAdded(response.data.data);
        }
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add defect code');
      }
    } catch (err) {
      console.error('Error adding defect code:', err);
      setError(err.response?.data?.message || 'Failed to add defect code');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      defect_code: '',
      defect_name: '',
      defect_category: '',
      defect_description: '',
      applicable_processes: [],
      severity_default: 'Major',
      image: null
    });
    setTouched({
      defect_code: false,
      defect_name: false,
      defect_category: false,
      defect_description: false
    });
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    setActiveStep(0);
    setStepErrors({});
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      color: COLORS.text.secondary
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: COLORS.primary,
      fontSize: '0.7rem'
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Info Card */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Defect Code Information
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Create a new defect code for quality tracking and non-conformance reporting.
                Defect codes help standardize quality issues across production processes.
              </Typography>
            </Paper>

            {/* Basic Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEFECT CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.defect_code}
                      onChange={(e) => handleChange('defect_code', e.target.value)}
                      onBlur={() => handleBlur('defect_code')}
                      placeholder="e.g., DC-001, WLD-001"
                      error={touched.defect_code && !formData.defect_code}
                      helperText={touched.defect_code && !formData.defect_code ? 'Defect code is required' : 'Auto-formatted to uppercase'}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEFECT NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.defect_name}
                      onChange={(e) => handleChange('defect_name', e.target.value)}
                      onBlur={() => handleBlur('defect_name')}
                      placeholder="e.g., Weld Porosity, Dimensional OOT"
                      error={touched.defect_name && !formData.defect_name}
                      helperText={touched.defect_name && !formData.defect_name ? 'Defect name is required' : ''}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEFECT CATEGORY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={formData.defect_category}
                      onChange={(e) => handleChange('defect_category', e.target.value)}
                      onBlur={() => handleBlur('defect_category')}
                      error={touched.defect_category && !formData.defect_category}
                      helperText={touched.defect_category && !formData.defect_category ? 'Defect category is required' : ''}
                      sx={inputStyle}
                    >
                      {DEFECT_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category} sx={{ fontSize: '0.75rem' }}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEFAULT SEVERITY
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={formData.severity_default}
                      onChange={(e) => handleChange('severity_default', e.target.value)}
                      sx={inputStyle}
                    >
                      {SEVERITY_LEVELS.map((severity) => (
                        <MenuItem key={severity} value={severity} sx={{ fontSize: '0.75rem' }}>
                          {severity}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Processes & Description */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Processes & Description
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      APPLICABLE PROCESSES
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={formData.applicable_processes}
                        onChange={handleProcessesChange}
                        input={<OutlinedInput sx={inputStyle} />}
                        disabled={loadingProcesses}
                        renderValue={(selectedIds) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedIds.map((id) => {
                              const process = processes.find(p => p._id === id);
                              return process ? (
                                <Chip
                                  key={id}
                                  label={process.process_name}
                                  size="small"
                                  sx={{
                                    fontSize: '0.65rem',
                                    height: 22,
                                    bgcolor: COLORS.primaryLight,
                                    color: COLORS.primary,
                                  }}
                                />
                              ) : null;
                            })}
                          </Box>
                        )}
                      >
                        {loadingProcesses ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                          </MenuItem>
                        ) : (
                          processes.map((process) => (
                            <MenuItem 
                              key={process._id} 
                              value={process._id}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {process.process_name} ({process.process_id})
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      <FormHelperText sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Select one or more processes where this defect can occur
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEFECT DESCRIPTION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      size="small"
                      value={formData.defect_description}
                      onChange={(e) => handleChange('defect_description', e.target.value)}
                      onBlur={() => handleBlur('defect_description')}
                      placeholder="Describe the defect in detail, including characteristics, measurement methods, acceptance criteria, etc."
                      error={touched.defect_description && !formData.defect_description}
                      helperText={touched.defect_description && !formData.defect_description ? 'Defect description is required' : ''}
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {/* Image Upload */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <ImageIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Reference Image
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 1 }}>
                    {!imagePreview ? (
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          height: 36,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          borderColor: COLORS.border,
                          color: COLORS.text.secondary,
                          '&:hover': {
                            borderColor: COLORS.primary,
                            bgcolor: `${COLORS.primary}10`
                          }
                        }}
                      >
                        Upload Image (JPEG, PNG, GIF, WEBP, max 5MB)
                        <input
                          type="file"
                          hidden
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                        />
                      </Button>
                    ) : (
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '150px',
                            borderRadius: '8px',
                            border: `1px solid ${COLORS.border}`
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={removeImage}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: '#EF4444',
                            color: 'white',
                            '&:hover': {
                              bgcolor: '#DC2626'
                            }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 1 }}>
                    Optional: Upload a reference image (JPEG, PNG, GIF, WEBP, max 5MB)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Review Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                Ready to Add?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Please review the information before adding. Click "Add" to save the defect code.
              </Typography>
            </Paper>
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add Defect Code
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': { color: COLORS.text.secondary }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel error={stepErrors[index]}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
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
          <Alert
            severity="error"
            sx={{
              borderRadius: 1.5,
              mt: 2,
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
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
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

        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
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
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark },
                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
              }}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="small"
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

export default AddDefectCode;