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
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Autocomplete,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Warehouse as WarehouseIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddEmployees from '../../hrmaster/employeemaster/AddEmployees';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

// Verification types based on schema enum
const VERIFICATION_TYPES = ['Full Count', 'Cycle Count', 'Spot Check', 'Pre-Audit Count'];

// Action types based on schema enum
const ACTION_TYPES = ['Adjust Up', 'Adjust Down', 'No Action', 'Write Off', 'Investigate Further'];

// 🔥 Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Basic Information', 'Verification Settings'];

const AddPSV = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  
  // Modal states for Add functionality
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [employeeTypeForAdd, setEmployeeTypeForAdd] = useState(''); // 'conducted_by' or 'witness'
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  const [formData, setFormData] = useState({
    warehouse_id: '',
    verification_type: 'Cycle Count',
    conducted_by: '',
    witness: '',
    variance_threshold_percent: 5,
    variance_threshold_amount: 1000,
    action: 'No Action',
    remarks: ''
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchWarehouses();
      resetForm();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/employees?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEmployees(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/warehouses?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setWarehouses(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setFormData({
      warehouse_id: '',
      verification_type: 'Cycle Count',
      conducted_by: '',
      witness: '',
      variance_threshold_percent: 5,
      variance_threshold_amount: 1000,
      action: 'No Action',
      remarks: ''
    });
    setErrors({});
    setApiError('');
    setActiveStep(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value?._id || '' }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handler for Add Employee modal
  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    if (employeeTypeForAdd === 'conducted_by') {
      setFormData(prev => ({ ...prev, conducted_by: newEmployee._id }));
    } else if (employeeTypeForAdd === 'witness') {
      setFormData(prev => ({ ...prev, witness: newEmployee._id }));
    }
    setEmployeeTypeForAdd('');
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        if (!formData.warehouse_id) {
          newErrors.warehouse_id = 'Warehouse is required';
          isValid = false;
        }
        if (!formData.verification_type) {
          newErrors.verification_type = 'Verification type is required';
          isValid = false;
        }
        if (!formData.conducted_by) {
          newErrors.conducted_by = 'Conducted By is required';
          isValid = false;
        }
        break;
      
      case 1: // Verification Settings
        if (!formData.variance_threshold_percent && formData.variance_threshold_percent !== 0) {
          newErrors.variance_threshold_percent = 'Variance threshold percent is required';
          isValid = false;
        } else if (formData.variance_threshold_percent < 0) {
          newErrors.variance_threshold_percent = 'Variance threshold percent must be >= 0';
          isValid = false;
        } else if (formData.variance_threshold_percent > 100) {
          newErrors.variance_threshold_percent = 'Variance threshold percent must be <= 100';
          isValid = false;
        }
        if (!formData.variance_threshold_amount && formData.variance_threshold_amount !== 0) {
          newErrors.variance_threshold_amount = 'Variance threshold amount is required';
          isValid = false;
        } else if (formData.variance_threshold_amount < 0) {
          newErrors.variance_threshold_amount = 'Variance threshold amount must be >= 0';
          isValid = false;
        }
        break;
      
      default:
        return true;
    }

    setErrors(newErrors);
    if (!isValid) {
      setApiError('Please fix the errors in this section');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setApiError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setApiError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        warehouse_id: formData.warehouse_id,
        verification_type: formData.verification_type,
        conducted_by: formData.conducted_by,
        witness: formData.witness || '',
        variance_threshold_percent: Number(formData.variance_threshold_percent),
        variance_threshold_amount: Number(formData.variance_threshold_amount),
        action: formData.action,
        remarks: formData.remarks || ''
      };
      
      const response = await axios.post(`${BASE_URL}/api/physical-verifications`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.data.success) {
        if (onAdd) onAdd(response.data.data);
        onClose();
      } else {
        setErrors(prev => ({ ...prev, submit: response.data.message || 'Failed to create Physical Stock Verification' }));
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Failed to create Physical Stock Verification';
        setApiError(errorMsg);
        setErrors(prev => ({ ...prev, submit: errorMsg }));
      } else if (err.request) {
        setApiError('No response from server. Please check your connection.');
      } else {
        setApiError(err.message || 'An error occurred while creating Physical Stock Verification');
      }
    } finally { 
      setLoading(false); 
    }
  };

  // Display helper functions
  const getPersonName = (person) => {
    if (!person) return '';
    if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
    if (person.FirstName) return person.FirstName;
    if (person.Username) return person.Username;
    if (person.Email) return person.Email;
    if (person.name) return person.name;
    return person._id || '';
  };

  const getWarehouseDisplay = (wh) => {
    if (!wh) return '';
    return wh.warehouse_name || wh.name || wh.warehouse_code || wh._id || '';
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
      color: COLORS.text.primary,
      '&::placeholder': {
        color: COLORS.text.tertiary,
        fontSize: '0.75rem'
      }
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
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={2}>
                {/* Warehouse Selection */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      WAREHOUSE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={warehouses}
                      getOptionLabel={getWarehouseDisplay}
                      onChange={(e, val) => handleAutocompleteChange('warehouse_id', val)}
                      loading={fetching}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          error={!!errors.warehouse_id}
                          helperText={errors.warehouse_id}
                          placeholder="Select warehouse for verification"
                          sx={inputStyle}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <WarehouseIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                {/* Verification Type */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      VERIFICATION TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="verification_type"
                      value={formData.verification_type}
                      onChange={handleChange}
                      error={!!errors.verification_type}
                      helperText={errors.verification_type}
                      sx={inputStyle}
                    >
                      {VERIFICATION_TYPES.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                
                {/* Conducted By with Add button */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      CONDUCTED BY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={employees}
                          getOptionLabel={getPersonName}
                          onChange={(e, val) => handleAutocompleteChange('conducted_by', val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!errors.conducted_by}
                              helperText={errors.conducted_by}
                              placeholder="Select person conducting verification"
                              sx={inputStyle}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEmployeeTypeForAdd('conducted_by');
                          setAddEmployeeOpen(true);
                        }}
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
                
                {/* Witness with Add button */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      WITNESS <span style={{ color: '#94A3B8', fontSize: '0.65rem' }}>(Optional)</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          fullWidth
                          options={employees}
                          getOptionLabel={getPersonName}
                          onChange={(e, val) => handleAutocompleteChange('witness', val)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!errors.witness}
                              helperText={errors.witness}
                              placeholder="Select witness (optional)"
                              sx={inputStyle}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEmployeeTypeForAdd('witness');
                          setAddEmployeeOpen(true);
                        }}
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
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Verification Settings
              </Typography>
              
              <Grid container spacing={2}>
                {/* Action Type */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      DEFAULT ACTION <span style={{ color: '#94A3B8', fontSize: '0.65rem' }}>(Optional)</span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="action"
                      value={formData.action}
                      onChange={handleChange}
                      sx={inputStyle}
                    >
                      {ACTION_TYPES.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      Default action to take when variance is detected
                    </Typography>
                  </Box>
                </Grid>

                {/* Variance Threshold Percent */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      VARIANCE THRESHOLD (%) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="variance_threshold_percent"
                      value={formData.variance_threshold_percent}
                      onChange={handleChange}
                      error={!!errors.variance_threshold_percent}
                      helperText={errors.variance_threshold_percent}
                      placeholder="Enter percentage threshold"
                      sx={inputStyle}
                      InputProps={{
                        inputProps: { min: 0, max: 100, step: 0.1 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>%</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      Variance exceeding this percentage will trigger alerts
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Variance Threshold Amount */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>
                      VARIANCE THRESHOLD (AMOUNT) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="variance_threshold_amount"
                      value={formData.variance_threshold_amount}
                      onChange={handleChange}
                      error={!!errors.variance_threshold_amount}
                      helperText={errors.variance_threshold_amount}
                      placeholder="Enter amount threshold"
                      sx={inputStyle}
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>₹</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                      Variance exceeding this amount will trigger alerts
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Remarks */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={labelStyle}>REMARKS</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      size="small"
                      placeholder="Enter any additional remarks about the verification process..."
                      sx={inputStyle}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Summary Section */}
            {formData.warehouse_id && (
              <Paper sx={{ p: 2.5, bgcolor: COLORS.background.light, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Warehouse:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {warehouses.find(w => w._id === formData.warehouse_id)?.warehouse_name || '-'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Verification Type:</Typography>
                        <Chip 
                          label={formData.verification_type} 
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem', 
                            bgcolor: COLORS.primaryLight, 
                            color: COLORS.primary,
                            height: 20
                          }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Default Action:</Typography>
                        <Chip 
                          label={formData.action} 
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem', 
                            bgcolor: COLORS.primaryLight, 
                            color: COLORS.primary,
                            height: 20
                          }} 
                        />
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Conducted By:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {employees.find(e => e._id === formData.conducted_by)?.FirstName || '-'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Witness:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {employees.find(e => e._id === formData.witness)?.FirstName || 'Not specified'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Variance Threshold:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {formData.variance_threshold_percent}% / ₹{formData.variance_threshold_amount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}
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
        onClose={onClose}
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
          mb: 2,
          bgcolor: COLORS.background.white,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Create Physical Stock Verification
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mb: 0.5, mt: 0.5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
          {apiError && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setApiError('')}>
              <strong>Error!</strong><br />
              {apiError}
            </Alert>
          )}
          
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}>
              {errors.submit}
            </Alert>
          )}

          {renderStepContent(activeStep)}
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
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                disabled={loading}
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
            )}
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? null : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : 'Create Verification'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || !formData.warehouse_id}
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

      {/* Add Employee Modal */}
      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => {
          setAddEmployeeOpen(false);
          setEmployeeTypeForAdd('');
        }}
        onAdd={handleEmployeeAdded}
      />
    </>
  );
};

export default AddPSV;