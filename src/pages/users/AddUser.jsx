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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

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
          Status: 'active'
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
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010',
          paddingTop: '8px'
        }}>
          Add New User
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <div style={{ marginTop: '16px' }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Username *"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
                disabled={loading}
                size="medium"
                variant="outlined"
                placeholder="john_doe"
                helperText="Minimum 3 characters"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Email *"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                disabled={loading}
                size="medium"
                variant="outlined"
                placeholder="john@example.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Password *"
                name="Password"
                type="password"
                value={formData.Password}
                onChange={handleChange}
                disabled={loading}
                size="medium"
                variant="outlined"
                placeholder="••••••••"
                helperText="At least 6 characters with letter, number & special character"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Confirm Password *"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                size="medium"
                variant="outlined"
                placeholder="••••••••"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Role *</InputLabel>
                <Select
                  name="RoleID"
                  value={formData.RoleID}
                  onChange={handleChange}
                  label="Role *"
                  disabled={loading || loadingRoles || roles.length === 0}
                  sx={{
                    borderRadius: 1,
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.RoleName} {role.Description && `- ${role.Description}`}
                    </MenuItem>
                  ))}
                </Select>
                {loadingRoles && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={12} /> Loading roles...
                  </Typography>
                )}
                {!loadingRoles && roles.length === 0 && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    No roles available. Please add roles first.
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </div>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        borderTop: '1px solid #E0E0E0', 
        pt: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || loadingRoles || !formData.RoleID}
          startIcon={loading ? null : <AddIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
            '&:hover': {
              opacity: 0.9,
              background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
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