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
  Typography,
  Box,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching LeaveTypeMaster and AddTax
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

const AssignTraining = ({
  open,
  onClose,
  trainings = [],
  employees = [],
  onAssign
}) => {
  const [trainingId, setTrainingId] = useState('');
  const [employeeIds, setEmployeeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTrainingId('');
      setEmployeeIds([]);
      setError('');
    }
  }, [open]);

  const handleTrainingChange = (e) => {
    setTrainingId(e.target.value);
    setError('');
  };

  const handleEmployeeChange = (e) => {
    setEmployeeIds(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!trainingId) {
      setError('Please select a training');
      return;
    }

    if (employeeIds.length === 0) {
      setError('Please select at least one employee');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/trainings/assign`, 
        { trainingId, employeeIds },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (onAssign) {
          onAssign(response.data.data);
        }
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to assign training');
      }
    } catch (err) {
      console.error('Error assigning training:', err);
      setError(err.response?.data?.message || 'Failed to assign training. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTrainingId('');
    setEmployeeIds([]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get employee display name - Updated to match API response structure
  const getEmployeeName = (employee) => {
    // Check for FirstName and LastName (capital F and L) from API response
    if (employee.FirstName && employee.LastName) {
      return `${employee.FirstName} ${employee.LastName}`.trim();
    }
    if (employee.FirstName) {
      return employee.FirstName;
    }
    if (employee.LastName) {
      return employee.LastName;
    }
    // Fallback to other possible field names
    if (employee.employeeName) return employee.employeeName;
    if (employee.firstName && employee.lastName) return `${employee.firstName} ${employee.lastName}`.trim();
    if (employee.name) return employee.name;
    if (employee.EmployeeID) return employee.EmployeeID;
    return 'Employee';
  };

  // Get selected training details
  const selectedTraining = trainings.find(t => t._id === trainingId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Assign Training
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Training Selection Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  SELECT TRAINING <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="trainingId"
                  value={trainingId}
                  onChange={handleTrainingChange}
                  disabled={loading}
                  placeholder="Select a training"
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  {trainings.length === 0 ? (
                    <MenuItem disabled sx={{ fontSize: '0.75rem' }}>
                      No trainings available
                    </MenuItem>
                  ) : (
                    trainings.map((training) => (
                      <MenuItem 
                        key={training._id} 
                        value={training._id}
                        sx={{ fontSize: '0.75rem', py: 1 }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {training.trainingName}
                          </Typography>
                          {training.provider && (
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {training.provider}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </TextField>
                {selectedTraining && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                      <strong>Duration:</strong> {selectedTraining.startDate ? new Date(selectedTraining.startDate).toLocaleDateString() : 'N/A'} 
                      {selectedTraining.endDate && ` - ${new Date(selectedTraining.endDate).toLocaleDateString()}`}
                    </Typography>
                    {selectedTraining.description && (
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mt: 0.5 }}>
                        {selectedTraining.description}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Employee Multi-Selection Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  SELECT EMPLOYEES <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="employeeIds"
                  value={employeeIds}
                  onChange={handleEmployeeChange}
                  disabled={loading}
                  placeholder="Select employees"
                  size="small"
                  variant="outlined"
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => {
                      if (selected.length === 0) {
                        return (
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                            Select employees
                          </Typography>
                        );
                      }
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip
                            label={`${selected.length} employee(s) selected`}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              height: 24
                            }}
                          />
                        </Box>
                      );
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary
                    }
                  }}
                >
                  {employees.length === 0 ? (
                    <MenuItem disabled sx={{ fontSize: '0.75rem' }}>
                      No employees available
                    </MenuItem>
                  ) : (
                    employees.map((employee) => (
                      <MenuItem 
                        key={employee._id} 
                        value={employee._id}
                        sx={{ fontSize: '0.75rem', py: 1 }}
                      >
                        <Checkbox 
                          checked={employeeIds.includes(employee._id)} 
                          size="small"
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': {
                              color: COLORS.primary,
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: '1.25rem'
                            }
                          }}
                        />
                        <ListItemText 
                          primary={getEmployeeName(employee)}
                          primaryTypographyProps={{
                            sx: { fontSize: '0.75rem', fontWeight: 500 }
                          }}
                          secondary={
                            employee.EmployeeID ? (
                              <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                ID: {employee.EmployeeID}
                              </Typography>
                            ) : null
                          }
                        />
                      </MenuItem>
                    ))
                  )}
                </TextField>
                {employeeIds.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Selected employees:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {employeeIds.map(id => {
                        const employee = employees.find(e => e._id === id);
                        return employee ? (
                          <Chip
                            key={id}
                            label={getEmployeeName(employee)}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              height: 24
                            }}
                          />
                        ) : null;
                      })}
                    </Box>
                  </Box>
                )}
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  You can select multiple employees for this training
                </Typography>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
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
        justifyContent: 'flex-end',
        gap: 1
      }}>
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
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !trainingId || employeeIds.length === 0}
          startIcon={loading ? null : <AssignmentIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: COLORS.text.light }} />
          ) : (
            'Assign Training'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTraining;