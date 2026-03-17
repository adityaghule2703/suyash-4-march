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
  Chip,
  Autocomplete
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
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

const EditUser = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    RoleID: '',
    Status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch roles on mount
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  useEffect(() => {
    if (user && roles.length > 0) {
      setFormData({
        Username: user.Username || '',
        Email: user.Email || '',
        RoleID: user.RoleID?._id || '',
        Status: user.Status || 'active'
      });
      
      // Set selected role object
      const role = roles.find(r => r._id === (user.RoleID?._id || user.RoleID));
      setSelectedRole(role || null);
    }
  }, [user, roles]);

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

    if (!formData.RoleID) {
      setError('Please select a role');
      return false;
    }

    if (!formData.Status) {
      setError('Please select a status');
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
      const response = await axios.put(
        `${BASE_URL}/api/users/${user._id}`,
        {
          Username: formData.Username.trim(),
          Email: formData.Email.trim(),
          RoleID: formData.RoleID,
          Status: formData.Status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || 'Failed to update user');
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(err.message || 'Failed to update user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get status chip color
  const getStatusStyles = (status) => {
    const styles = {
      active: {
        bg: COLORS.chips.active,
        text: COLORS.primaryDark,
        border: '#86efac'
      },
      inactive: {
        bg: COLORS.chips.inactive,
        text: COLORS.text.secondary,
        border: COLORS.border
      },
      suspended: {
        bg: COLORS.chips.suspended,
        text: '#92400e',
        border: '#fcd34d'
      },
      locked: {
        bg: COLORS.chips.locked,
        text: '#991b1b',
        border: '#fca5a5'
      }
    };
    return styles[status] || styles.inactive;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
          Edit User
        </Typography>
        {user?.Username && (
          <Chip
            label={`ID: ${user._id?.slice(-6) || 'N/A'}`}
            size="small"
            sx={{ 
              fontSize: '0.65rem',
              fontWeight: 500,
              height: 20,
              bgcolor: COLORS.background.light,
              color: COLORS.text.secondary,
              border: `1px solid ${COLORS.border}`,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        )}
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

            {/* Role Field - Using MUI Autocomplete */}
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
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || loadingRoles || !formData.RoleID}
          startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Updating...' : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;