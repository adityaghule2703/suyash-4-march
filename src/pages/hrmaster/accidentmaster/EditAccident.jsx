import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  InputAdornment,
  IconButton,
  CircularProgress,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddEmployees from '../employeemaster/AddEmployees';
import AddMachine from '../../bommaster/machinemaster/AddMachine';

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
  border: '#E3E8EF'
};

const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none'
});

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundColor: COLORS.primary }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundColor: COLORS.primary }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1
  }
}));

const steps = ['Basic Information', 'Incident Details', 'Actions & Follow-up'];

const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const now = new Date();
  return selectedDate <= now;
};

const validateLostDays = (days) => {
  if (!days && days !== 0) return true;
  const numDays = Number(days);
  return !isNaN(numDays) && numDays >= 0 && Number.isInteger(numDays);
};

const EditAccident = ({ open, onClose, accident, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    location: '',
    department: '',
    machineId: '',
    machineName: '',
    injuryType: '',
    otherInjuryType: '',
    bodyPartAffected: '',
    severity: '',
    description: '',
    immediateAction: '',
    rootCause: '',
    reportedBy: '',
    lostDays: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addMachineOpen, setAddMachineOpen] = useState(false);

  const initialDataLoaded = useRef(false);

  const injuryTypeOptions = [
    'Cut', 'Burn', 'Fracture', 'Sprain', 'Electric Shock',
    'Eye Injury', 'Hearing Loss', 'Respiratory', 'Chemical Exposure', 'Other'
  ];
  const severityOptions = ['Minor', 'Moderate', 'Major', 'Fatal'];

  const textFieldStyles = {
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
    }
  };

  // Fetch all required data
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setMachines(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
    }
  };

  // Load data when dialog opens
  useEffect(() => {
    if (open && !initialDataLoaded.current) {
      const loadData = async () => {
        setFetchingData(true);
        await Promise.all([
          fetchEmployees(),
          fetchDepartments(),
          fetchUsers(),
          fetchMachines()
        ]);
        initialDataLoaded.current = true;
        setFetchingData(false);
      };
      loadData();
    }
  }, [open]);

  // Populate form when accident data is available
  useEffect(() => {
    if (accident && employees.length > 0) {
      console.log('Loading accident data:', accident); // Debug log

      // Format date for datetime-local input
      let formattedDate = '';
      if (accident.date) {
        const dateObj = new Date(accident.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().slice(0, 16);
        }
      }

      // Helper function to extract ID from various formats
      const extractId = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field._id) return field._id;
        return '';
      };

      // Parse injury type - check if it starts with "Other:"
      let injuryTypeValue = accident.injuryType || '';
      let otherInjuryTypeValue = '';

      if (injuryTypeValue.startsWith('Other:')) {
        // Extract the custom description after "Other:"
        otherInjuryTypeValue = injuryTypeValue.substring(6).trim(); // Remove "Other:" and trim spaces
        injuryTypeValue = 'Other';
      }

      setFormData({
        employee: extractId(accident.employee),
        date: formattedDate,
        location: accident.location || '',
        department: extractId(accident.department),
        machineId: accident.machineId || '',
        machineName: accident.machineName || '',
        injuryType: accident.injuryType || '',
        otherInjuryType: otherInjuryTypeValue,
        bodyPartAffected: accident.bodyPartAffected || '',
        severity: accident.severity || '',
        description: accident.description || '',
        immediateAction: accident.immediateAction || '',
        rootCause: accident.rootCause || '',
        reportedBy: extractId(accident.reportedBy),
        lostDays: accident.lostDays?.toString() || ''
      });
    }
  }, [accident, employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'lostDays') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFieldErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'machineId' && value) {
      const selectedMachine = machines.find(machine => machine._id === value);
      if (selectedMachine) {
        setFormData(prev => ({
          ...prev,
          machineId: value,
          machineName: selectedMachine.machine_name || ''
        }));
        return;
      }
    }

    if (name === 'employee' && value) {
      const selectedEmployee = employees.find(emp => emp._id === value);
      if (selectedEmployee) {
        let departmentId = '';
        if (selectedEmployee.DepartmentID) {
          if (typeof selectedEmployee.DepartmentID === 'object' && selectedEmployee.DepartmentID._id) {
            departmentId = selectedEmployee.DepartmentID._id;
          } else if (typeof selectedEmployee.DepartmentID === 'string') {
            departmentId = selectedEmployee.DepartmentID;
          }
        }
        setFormData(prev => ({
          ...prev,
          employee: value,
          department: departmentId
        }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.employee) {
          errors.employee = 'Employee is required';
          isValid = false;
        }
        if (!formData.date) {
          errors.date = 'Date & time is required';
          isValid = false;
        } else if (!validateDate(formData.date)) {
          errors.date = 'Date cannot be in the future';
          isValid = false;
        }
        if (!formData.location?.trim()) {
          errors.location = 'Location is required';
          isValid = false;
        }
        if (!formData.department) {
          errors.department = 'Department is required';
          isValid = false;
        }
        break;
      case 1:
        if (!formData.injuryType) {
          errors.injuryType = 'Injury type is required';
          isValid = false;
        }
        if (formData.injuryType === 'Other' && !formData.otherInjuryType?.trim()) {
          errors.otherInjuryType = 'Please specify the injury type';
          isValid = false;
        }
        if (!formData.severity) {
          errors.severity = 'Severity is required';
          isValid = false;
        }
        if (!formData.description?.trim()) {
          errors.description = 'Description is required';
          isValid = false;
        }
        if (formData.lostDays && !validateLostDays(formData.lostDays)) {
          errors.lostDays = 'Lost days must be a positive whole number';
          isValid = false;
        }
        break;
      case 2:
        break;
      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill in all required fields');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate all steps
    for (let i = 0; i <= 2; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const lostDaysNum = formData.lostDays ? parseInt(formData.lostDays, 10) : 0;

      const submissionData = {
        employee: formData.employee,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        department: formData.department,
        machineId: formData.machineId || '',
        machineName: formData.machineName || '',
        injuryType: injuryTypeValue,
        bodyPartAffected: formData.bodyPartAffected || '',
        severity: formData.severity,
        description: formData.description || '',
        immediateAction: formData.immediateAction || '',
        rootCause: formData.rootCause || '',
        reportedBy: formData.reportedBy || '',
        lostDays: lostDaysNum
      };

      const response = await axios.put(
        `${BASE_URL}/api/safety/accidents/${accident._id}`,
        submissionData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update accident');
      }
    } catch (err) {
      console.error('Error updating accident:', err);
      setError(err.response?.data?.message || 'Failed to update accident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    initialDataLoaded.current = false;
    setActiveStep(0);
    setFieldErrors({});
    setError('');
    onClose();
  };

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setFormData(prev => ({
      ...prev,
      employee: newEmployee._id,
      department: newEmployee.DepartmentID?._id || newEmployee.DepartmentID || ''
    }));
  };

  const handleMachineAdded = (newMachine) => {
    setMachines(prev => [...prev, newMachine]);
    setFormData(prev => ({
      ...prev,
      machineId: newMachine._id,
      machineName: newMachine.machine_name || ''
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Basic Information
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      EMPLOYEE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          options={employees}
                          getOptionLabel={(option) => {
                            const firstName = option.FirstName || '';
                            const lastName = option.LastName || '';
                            const employeeId = option.EmployeeID || '';
                            return `${firstName} ${lastName} (${employeeId})`.trim();
                          }}
                          value={employees.find(emp => emp._id === formData.employee) || null}
                          onChange={(event, newValue) => {
                            handleAutocompleteChange('employee', newValue?._id || '');
                          }}
                          loading={fetchingData}
                          disabled={loading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Search employee..."
                              error={!!fieldErrors.employee}
                              sx={textFieldStyles}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                          PaperComponent={CustomPaper}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddEmployeeOpen(true)}
                        startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                        sx={{ height: 32, minWidth: 'auto', px: 1.5, borderRadius: 1.5, textTransform: 'none' }}
                      >
                        Add New
                      </Button>
                    </Box>
                    {fieldErrors.employee && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.employee}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => option?.DepartmentName || ''}
                      value={departments.find(dept => dept._id === formData.department) || null}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange('department', newValue?._id || '');
                      }}
                      loading={fetchingData}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Auto-populated from employee"
                          error={!!fieldErrors.department}
                          sx={textFieldStyles}
                        />
                      )}
                      PaperComponent={CustomPaper}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />
                    {fieldErrors.department && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.department}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      DATE & TIME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!fieldErrors.date}
                      InputLabelProps={{ shrink: true }}
                      sx={textFieldStyles}
                    />
                    {fieldErrors.date && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.date}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      LOCATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Production Floor, Section A"
                      error={!!fieldErrors.location}
                      sx={textFieldStyles}
                    />
                    {fieldErrors.location && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.location}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Incident Details
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      MACHINE
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Autocomplete
                          options={machines}
                          getOptionLabel={(option) => {
                            const machineId = option.machine_id || '';
                            const machineName = option.machine_name || '';
                            return `${machineId} - ${machineName}`;
                          }}
                          value={machines.find(machine => machine._id === formData.machineId) || null}
                          onChange={(event, newValue) => {
                            handleAutocompleteChange('machineId', newValue?._id || '');
                          }}
                          loading={fetchingData}
                          disabled={loading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select machine..."
                              sx={textFieldStyles}
                            />
                          )}
                          PaperComponent={CustomPaper}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setAddMachineOpen(true)}
                        startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                        sx={{ height: 34, minWidth: 'auto', px: 1.5, borderRadius: 1.5, textTransform: 'none' }}
                      >
                        Add New
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      MACHINE NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="machineName"
                      value={formData.machineName}
                      disabled={true}
                      sx={textFieldStyles}
                    />
                  </Box>
                </Grid>

                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      INJURY TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.injuryType}>
                      <Select
                        name="injuryType"
                        value={formData.injuryType}
                        onChange={handleSelectChange}
                        disabled={loading}
                        sx={textFieldStyles}
                      >
                        {injuryTypeOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.injuryType && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.injuryType}
                      </Typography>
                    )}
                  </Box>
                </Grid> */}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      INJURY TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.injuryType}>
                      <Select
                        name="injuryType"
                        value={formData.injuryType}
                        onChange={(e) => {
                          handleSelectChange(e);
                          // Clear otherInjuryType when changing from Other to something else
                          if (e.target.value !== 'Other') {
                            setFormData(prev => ({ ...prev, otherInjuryType: '' }));
                          }
                        }}
                        disabled={loading}
                        sx={textFieldStyles}
                      >
                        {injuryTypeOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.injuryType && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.injuryType}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Dynamic field for Other injury type */}
                {formData.injuryType === 'Other' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        SPECIFY INJURY TYPE <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="otherInjuryType"
                        value={formData.otherInjuryType}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Please specify the injury type"
                        error={!!fieldErrors.otherInjuryType}
                        helperText={fieldErrors.otherInjuryType}
                        sx={textFieldStyles}
                      />
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      SEVERITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.severity}>
                      <Select
                        name="severity"
                        value={formData.severity}
                        onChange={handleSelectChange}
                        disabled={loading}
                        sx={textFieldStyles}
                      >
                        {severityOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.severity && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.severity}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      DESCRIPTION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="Describe what happened..."
                      error={!!fieldErrors.description}
                      helperText={fieldErrors.description}
                      sx={textFieldStyles}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      BODY PART AFFECTED
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bodyPartAffected"
                      value={formData.bodyPartAffected}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Left hand, Right eye"
                      sx={textFieldStyles}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      LOST DAYS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="lostDays"
                      value={formData.lostDays}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Number of days"
                      error={!!fieldErrors.lostDays}
                      inputProps={{ min: 0 }}
                      sx={textFieldStyles}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                      Number of work days lost (0 if none)
                    </Typography>
                    {fieldErrors.lostDays && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.lostDays}
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
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Actions & Follow-up
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      IMMEDIATE ACTION TAKEN
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="immediateAction"
                      value={formData.immediateAction}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="What immediate action was taken?"
                      sx={textFieldStyles}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      ROOT CAUSE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rootCause"
                      value={formData.rootCause}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="What was the root cause of the incident?"
                      sx={textFieldStyles}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      REPORTED BY
                    </Typography>
                    <Autocomplete
                      options={users}
                      getOptionLabel={(option) => {
                        const username = option.Username || '';
                        const email = option.Email || '';
                        if (username && email) return `${username} (${email})`;
                        return username || email || 'Unknown User';
                      }}
                      value={users.find(user => user._id === formData.reportedBy) || null}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange('reportedBy', newValue?._id || '');
                      }}
                      loading={fetchingData}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search reporter..."
                          sx={textFieldStyles}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      PaperComponent={CustomPaper}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />
                  </Box>
                </Grid>
              </Grid>
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
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Accident / Incident
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon fontSize="small" />
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
          {fetchingData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            </Box>
          ) : (
            renderStepContent(activeStep)
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
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
              textTransform: 'none'
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
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || fetchingData}
                size="small"
                startIcon={<SaveIcon sx={{ fontSize: '1rem' }} />}
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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || fetchingData}
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

      <AddEmployees
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAdd={handleEmployeeAdded}
      />

      <AddMachine
        open={addMachineOpen}
        onClose={() => setAddMachineOpen(false)}
        onAdd={handleMachineAdded}
      />
    </>
  );
};

export default EditAccident;