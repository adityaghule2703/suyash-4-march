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
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const EditAccident = ({ open, onClose, accident, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    rootCause: '',
    correctiveAction: '',
    preventiveAction: '',
    investigationStatus: '',
    investigationDate: '',
    investigationBy: null,
    costIncurred: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Enhanced users dropdown state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersOpen, setUsersOpen] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersInputValue, setUsersInputValue] = useState('');

  // Enum options - Updated to match schema exactly
  const investigationStatusOptions = ['Open', 'Under Investigation', 'Closed', 'Resolved'];

  const steps = [
    'Root Cause Analysis',
    'Actions & Status',
    'Investigation Details'
  ];

  // Fetch users from API with pagination and search
  const fetchUsers = async (search = '', page = 1) => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          page: page,
          limit: 10,
          search: search
        }
      });

      if (response.data.success) {
        const usersData = response.data.data?.users || [];
        if (page === 1) {
          setUsers(Array.isArray(usersData) ? usersData : []);
        } else {
          setUsers(prev => [...prev, ...(Array.isArray(usersData) ? usersData : [])]);
        }
        setUsersTotalPages(response.data.data?.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users when dropdown opens
  useEffect(() => {
    if (usersOpen) {
      fetchUsers(usersSearch, 1);
    }
  }, [usersOpen]);

  // Search users with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (usersOpen) {
        setUsersPage(1);
        fetchUsers(usersSearch, 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usersSearch, usersOpen]);

  // Handle scroll load more for users
  const handleUsersScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
      if (usersPage < usersTotalPages && !usersLoading) {
        const nextPage = usersPage + 1;
        setUsersPage(nextPage);
        fetchUsers(usersSearch, nextPage);
      }
    }
  };

  // Prefill Data
  useEffect(() => {
    if (accident) {
      // Find the user object from users list if available, otherwise store as null
      const selectedUser = users.find(user => user._id === accident.investigationBy) || null;
      
      setFormData({
        rootCause: accident.rootCause || '',
        correctiveAction: accident.correctiveAction || '',
        preventiveAction: accident.preventiveAction || '',
        investigationStatus: accident.investigationStatus || 'Open',
        investigationDate: accident.investigationDate
          ? new Date(accident.investigationDate).toISOString().substring(0, 10)
          : '',
        investigationBy: selectedUser,
        costIncurred:
          accident.costIncurred !== undefined
            ? accident.costIncurred.toString()
            : ''
      });
    }
  }, [accident, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, investigationBy: newValue }));
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.rootCause?.trim())
          return 'Root cause is required';
        return null;
      
      case 1:
        if (!formData.investigationStatus?.trim())
          return 'Investigation status is required';
        return null;
      
      case 2:
        if (!formData.investigationDate)
          return 'Investigation date is required';
        if (!formData.investigationBy)
          return 'Investigation By is required';
        
        const costNum = parseFloat(formData.costIncurred || 0);
        if (isNaN(costNum) || costNum < 0)
          return 'Cost incurred must be 0 or positive number';
        return null;
      
      default:
        return null;
    }
  };

  const handleNext = () => {
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const costNum = parseFloat(formData.costIncurred || 0);

      const payload = {
        rootCause: formData.rootCause,
        correctiveAction: formData.correctiveAction || '',
        preventiveAction: formData.preventiveAction || '',
        investigationStatus: formData.investigationStatus,
        investigationDate: new Date(formData.investigationDate).toISOString(),
        investigationBy: formData.investigationBy?._id || formData.investigationBy,
        costIncurred: costNum
      };

      const response = await axios.put(
        `${BASE_URL}/api/safety/accidents/${accident._id}/investigate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onUpdate(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update investigation');
      }

    } catch (err) {
      console.error('Backend Error:', err.response?.data);
      setError(
        err.response?.data?.message ||
        'Failed to update investigation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setUsersInputValue('');
    setUsersSearch('');
    setError('');
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* First Row - Root Cause (full width) */}
            <TextField
              fullWidth
              label="Root Cause *"
              name="rootCause"
              value={formData.rootCause}
              onChange={handleChange}
              required
              multiline
              rows={4}
              disabled={loading}
              placeholder="Describe the root cause of the accident/incident"
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* First Row - Corrective Action (full width) */}
            <TextField
              fullWidth
              label="Corrective Action"
              name="correctiveAction"
              value={formData.correctiveAction}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading}
              placeholder="Actions taken to correct the immediate issue"
            />

            {/* Second Row - Preventive Action (full width) */}
            <TextField
              fullWidth
              label="Preventive Action"
              name="preventiveAction"
              value={formData.preventiveAction}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading}
              placeholder="Actions to prevent future occurrences"
            />

            {/* Third Row - Investigation Status (full width) - Updated with correct enums */}
            <FormControl fullWidth>
              <InputLabel>Investigation Status *</InputLabel>
              <Select
                name="investigationStatus"
                value={formData.investigationStatus}
                onChange={handleChange}
                label="Investigation Status *"
                required
                disabled={loading}
              >
                {investigationStatusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* First Row - Investigation Date and Investigation By */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Investigation Date *"
                name="investigationDate"
                type="date"
                value={formData.investigationDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                disabled={loading}
              />

              {/* Enhanced Investigation By Autocomplete */}
              <Autocomplete
                fullWidth
                id="investigationBy-autocomplete"
                open={usersOpen}
                onOpen={() => setUsersOpen(true)}
                onClose={() => setUsersOpen(false)}
                options={Array.isArray(users) ? users : []}
                loading={usersLoading}
                value={formData.investigationBy}
                onChange={handleUserChange}
                inputValue={usersInputValue}
                onInputChange={(event, newInputValue) => {
                  setUsersInputValue(newInputValue);
                  setUsersSearch(newInputValue);
                }}
                getOptionLabel={(option) => {
                  if (!option) return '';
                  const username = option.Username || '';
                  if (option.EmployeeID?.FirstName && option.EmployeeID?.LastName) {
                    return `${option.EmployeeID.FirstName} ${option.EmployeeID.LastName}`;
                  }
                  return username;
                }}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Investigation By *"
                    required
                    placeholder="Search investigator..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {usersLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  if (!option) return null;
                  
                  let displayName = option.Username || 'Unknown';
                  let displayEmail = option.Email || '';
                  
                  if (option.EmployeeID) {
                    if (option.EmployeeID.FirstName && option.EmployeeID.LastName) {
                      displayName = `${option.EmployeeID.FirstName} ${option.EmployeeID.LastName}`;
                    }
                  }
                  
                  return (
                    <MenuItem {...props} key={option._id} sx={{ py: 0.5 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {displayName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {displayEmail}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                }}
                ListboxProps={{
                  onScroll: handleUsersScroll,
                  style: { maxHeight: 250 }
                }}
              />
            </Stack>

            {/* Second Row - Cost Incurred (full width) */}
            <TextField
              fullWidth
              label="Cost Incurred"
              name="costIncurred"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={formData.costIncurred}
              onChange={handleChange}
              disabled={loading}
              placeholder="0.00"
              helperText="Enter cost in numeric format"
            />
          </Stack>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          paddingTop: '8px'
        }}>
          Update Investigation Details
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box>
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={!loading && <EditIcon />}
            sx={{
              backgroundColor: '#1976D2',
              '&:hover': { backgroundColor: '#1565C0' }
            }}
          >
            {loading ? 'Updating...' : 'Update Investigation'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditAccident;