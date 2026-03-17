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
  CircularProgress,
  Box,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Color constants matching Users component
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

const AddUser = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    RoleID: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [userStatus, setUserStatus] = useState(true);

  // Fetch roles on mount
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setRoles(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please refresh the page.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        RoleID: newValue._id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        RoleID: ''
      }));
    }
  };

  const validateForm = () => {
    if (!formData.Username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.Username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!formData.Email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.Password) {
      setError('Password is required');
      return false;
    }

    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(formData.Password)) {
      setError('Password must contain at least one letter, one number, and one special character');
      return false;
    }

    if (formData.Password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.RoleID) {
      setError('Please select a role');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        {
          Username: formData.Username.trim(),
          Email: formData.Email.trim(),
          Password: formData.Password,
          RoleID: formData.RoleID,
          Status: userStatus ? 'active' : 'inactive'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || 'Failed to add user');
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(err.message || 'Failed to add user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Username: '',
      Email: '',
      Password: '',
      RoleID: ''
    });
    setConfirmPassword('');
    setSelectedRole(null);
    setError('');
    setUserStatus(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Custom toggle switch component matching Users component styling
  const ToggleSwitch = ({ value, onChange }) => {
    return (
      <Box
        onClick={() => onChange(!value)}
        sx={{
          width: 36,
          height: 20,
          bgcolor: value ? COLORS.primary : COLORS.border,
          borderRadius: 10,
          position: 'relative',
          cursor: 'pointer',
          transition: '0.2s',
          display: 'inline-block',
          '&:hover': {
            opacity: 0.9
          }
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            top: 2,
            left: value ? 18 : 2,
            transition: '0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
      </Box>
    );
  };

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
          Add New User
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Username Field */}
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
                  USERNAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="john_doe"
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
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Minimum 3 characters
                </Typography>
              </Box>
            </Box>

            {/* Email Field */}
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
                  EMAIL <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="john@example.com"
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
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Role Field - Using MUI Autocomplete like in raw material example */}
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
                  ROLE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <Autocomplete
                  fullWidth
                  options={roles}
                  loading={loadingRoles}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  getOptionLabel={(option) => option.RoleName || ''}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select a role"
                      required
                      error={!formData.RoleID && error.includes('role')}
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
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingRoles ? <CircularProgress color="inherit" size={16} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                          {option.RoleName}
                        </Typography>
                        {option.Description && (
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                            {option.Description}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.75rem',
                        py: 1,
                        px: 1.5
                      }
                    }
                  }}
                />

                {loadingRoles && !selectedRole && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <CircularProgress size={12} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Loading roles...
                    </Typography>
                  </Box>
                )}
                {!loadingRoles && roles.length === 0 && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                    No roles available. Please add roles first.
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Password Field */}
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  PASSWORD <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="••••••••"
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
                />
              </Box>
            </Box>

            {/* Confirm Password Field */}
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  CONFIRM <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
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
                />
              </Box>
            </Box>

            {/* Password Helper Text */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                At least 6 characters with letter, number & special character
              </Typography>
            </Box>

            {/* Status Toggle - Optional, can be uncommented if needed */}
            {/* <Box sx={{ gridColumn: 'span 2', mt: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  ACTIVE STATUS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ToggleSwitch value={userStatus} onChange={setUserStatus} />
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: userStatus ? COLORS.primary : COLORS.text.secondary
                    }}
                  >
                    {userStatus ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Box>
            </Box> */}
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
          disabled={loading || loadingRoles || !formData.RoleID}
          startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Adding...' : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;