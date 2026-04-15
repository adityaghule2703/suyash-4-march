import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  border: '#E3E8EF',
  background: {
    light: '#F8FFFC'
  }
};

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

  // Users dropdown state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersOpen, setUsersOpen] = useState(false);
  const [usersInputValue, setUsersInputValue] = useState('');
  
  // Ref to prevent multiple API calls
  const initialLoadDone = useRef(false);
  const searchTimeout = useRef(null);

  const investigationStatusOptions = ['Open', 'Under Investigation', 'Closed', 'Resolved'];
  const steps = ['Root Cause', 'Actions', 'Details'];

  // Fetch users from API
  const fetchUsers = async (search = '') => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { page: 1, limit: 100, search }
      });

      if (response.data.success) {
        // Fix: Users are directly in response.data.data, not in response.data.data.users
        const usersData = response.data.data || [];
        setUsers(usersData);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users when dropdown opens - only once
  useEffect(() => {
    if (usersOpen && !initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchUsers('');
    }
    
    // Reset when dropdown closes
    if (!usersOpen) {
      initialLoadDone.current = false;
    }
  }, [usersOpen]);

  // Search users with debounce
  useEffect(() => {
    if (!usersOpen) return;
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (usersSearch && usersSearch.trim() !== '') {
      searchTimeout.current = setTimeout(() => {
        fetchUsers(usersSearch);
      }, 500);
    } else if (usersSearch === '') {
      fetchUsers('');
    }
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [usersSearch, usersOpen]);

  // Prefill Data
  useEffect(() => {
    if (accident && users.length > 0) {
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
        costIncurred: accident.costIncurred?.toString() || ''
      });
      
      // Set input value for the selected user
      if (selectedUser) {
        const displayName = selectedUser.Username && selectedUser.Email 
          ? `${selectedUser.Username} (${selectedUser.Email})`
          : (selectedUser.Username || selectedUser.Email || 'Unknown User');
        setUsersInputValue(displayName);
      }
    } else if (accident && accident.investigationBy && users.length === 0) {
      // Store the ID temporarily until users are loaded
      setFormData(prev => ({
        ...prev,
        investigationBy: accident.investigationBy
      }));
    }
  }, [accident, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, investigationBy: newValue }));
    if (newValue) {
      const displayName = newValue.Username && newValue.Email 
        ? `${newValue.Username} (${newValue.Email})`
        : (newValue.Username || newValue.Email || 'Unknown User');
      setUsersInputValue(displayName);
    } else {
      setUsersInputValue('');
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.rootCause?.trim()) return 'Root cause is required';
        return null;
      case 1:
        if (!formData.investigationStatus?.trim()) return 'Investigation status is required';
        return null;
      case 2:
        if (!formData.investigationDate) return 'Investigation date is required';
        if (!formData.investigationBy) return 'Investigation By is required';
        const costNum = parseFloat(formData.costIncurred || 0);
        if (isNaN(costNum) || costNum < 0) return 'Cost must be 0 or positive';
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
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
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

        // Format the investigationBy properly
    let investigationById = null;
    if (formData.investigationBy) {
      investigationById = typeof formData.investigationBy === 'object' 
        ? formData.investigationBy._id 
        : formData.investigationBy;
    }
    const payload = {
      rootCause: formData.rootCause,
      correctiveAction: formData.correctiveAction || '',
      preventiveAction: formData.preventiveAction || '',
      investigationStatus: formData.investigationStatus,
      investigationDate: formData.investigationDate ? new Date(formData.investigationDate).toISOString() : new Date().toISOString(),
      investigationBy: investigationById,
      costIncurred: parseFloat(formData.costIncurred || 0)
    };

    console.log('Sending payload:', payload); // Debug log

    const response = await axios.put(
      `${BASE_URL}/api/safety/accidents/${accident._id}/investigate`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('API Response:', response.data); // Debug log

    if (response.data.success) {
      // Make sure we're passing the updated accident correctly
      const updatedAccident = response.data.data;
      console.log('Updated accident from API:', updatedAccident);
      console.log('New status:', updatedAccident.investigationStatus);
      onUpdate(updatedAccident);
      handleClose();
    } else {
      setError(response.data.message || 'Update failed');
    }
  } catch (err) {
    console.error('Full error:', err);
    console.error('Error response:', err.response?.data);
    setError(err.response?.data?.message || 'Update failed. Try again.');
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setActiveStep(0);
    setUsersInputValue('');
    setUsersSearch('');
    setUsersOpen(false);
    setError('');
    initialLoadDone.current = false;
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Root Cause *"
              name="rootCause"
              value={formData.rootCause}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading}
              size="small"
              placeholder="Describe root cause"
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Corrective Action"
              name="correctiveAction"
              value={formData.correctiveAction}
              onChange={handleChange}
              multiline
              rows={2}
              disabled={loading}
              size="small"
              placeholder="Actions taken"
            />
            <TextField
              fullWidth
              label="Preventive Action"
              name="preventiveAction"
              value={formData.preventiveAction}
              onChange={handleChange}
              multiline
              rows={2}
              disabled={loading}
              size="small"
              placeholder="Preventive measures"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status *</InputLabel>
              <Select
                name="investigationStatus"
                value={formData.investigationStatus}
                onChange={handleChange}
                label="Status *"
                disabled={loading}
              >
                {investigationStatusOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1.5}>
              <TextField
                fullWidth
                label="Date *"
                name="investigationDate"
                type="date"
                value={formData.investigationDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={loading}
              />
              <Autocomplete
                fullWidth
                open={usersOpen}
                onOpen={() => setUsersOpen(true)}
                onClose={() => setUsersOpen(false)}
                options={users}
                loading={usersLoading}
                value={formData.investigationBy}
                onChange={handleUserChange}
                inputValue={usersInputValue}
                onInputChange={(e, newValue) => {
                  setUsersInputValue(newValue || '');
                  setUsersSearch(newValue || '');
                }}
                getOptionLabel={(option) => {
                  if (!option) return '';
                  const username = option.Username || '';
                  const email = option.Email || '';
                  
                  if (username && email) {
                    return `${username} (${email})`;
                  }
                  if (username) {
                    return username;
                  }
                  if (email) {
                    return email;
                  }
                  return 'Unknown User';
                }}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option._id === value._id;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Investigator *"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {usersLoading && <CircularProgress size={16} />}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const username = option.Username || '';
                  const email = option.Email || '';
                  const displayText = username && email ? `${username} (${email})` : (username || email || 'Unknown User');
                  return (
                    <MenuItem {...props} key={option._id} dense>
                      <Typography variant="body2">{displayText}</Typography>
                    </MenuItem>
                  );
                }}
              />
            </Stack>
            <TextField
              fullWidth
              label="Cost Incurred"
              name="costIncurred"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={formData.costIncurred}
              onChange={handleChange}
              size="small"
              disabled={loading}
              placeholder="0.00"
            />
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize="0.9rem" fontWeight={600} color={COLORS.primary}>
            Update Investigation
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 2, mt: 0.5 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.7rem' } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2, py: 0, fontSize: '0.7rem' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ minHeight: 200 }}>{getStepContent(activeStep)}</Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${COLORS.border}`, p: 1.5, gap: 0.5 }}>
        <Button onClick={handleClose} size="small" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
          Cancel
        </Button>
        <Box flex={1} />
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          size="small"
          sx={{ fontSize: '0.7rem', color: COLORS.primary }}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            size="small"
            sx={{ fontSize: '0.7rem', bgcolor: COLORS.primary }}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            size="small"
            sx={{ fontSize: '0.7rem', bgcolor: COLORS.primary }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditAccident;