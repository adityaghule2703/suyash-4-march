import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddDesignations = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    DesignationName: '',
    Level: '',
    Description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    DesignationName: '',
    Level: '',
    Description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Level' ? value : value
    }));
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear general error when user makes changes
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const newFieldErrors = {};
    let isValid = true;

    if (!formData.DesignationName.trim()) {
      newFieldErrors.DesignationName = 'Designation name is required';
      isValid = false;
    } else if (formData.DesignationName.trim().length < 2) {
      newFieldErrors.DesignationName = 'Designation name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.Level.trim()) {
      newFieldErrors.Level = 'Level is required';
      isValid = false;
    } else {
      const levelNum = parseInt(formData.Level, 10);
      if (isNaN(levelNum) || levelNum < 1) {
        newFieldErrors.Level = 'Level must be a positive number';
        isValid = false;
      }
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError('');
    setFieldErrors({
      DesignationName: '',
      Level: '',
      Description: ''
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const levelNum = parseInt(formData.Level, 10);
      
      const response = await axios.post(`${BASE_URL}/api/designations`, {
        DesignationName: formData.DesignationName.trim(),
        Level: levelNum,
        Description: formData.Description.trim() || ''
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        // Handle server-side validation errors
        setError(response.data.message || 'Failed to add designation');
      }
    } catch (err) {
      console.error('Error adding designation:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const serverError = err.response.data;
        
        // Check if it's a Mongoose validation error
        if (serverError.error && serverError.error.name === 'ValidationError') {
          // Handle mongoose validation errors
          const validationErrors = serverError.error.errors;
          const newFieldErrors = {};
          
          Object.keys(validationErrors).forEach(key => {
            if (key === 'Level' || key === 'DesignationName' || key === 'Description') {
              newFieldErrors[key] = validationErrors[key].message;
            }
          });
          
          setFieldErrors(newFieldErrors);
        } 
        // Check for duplicate key error (unique constraint)
        else if (serverError.code === 11000 || (serverError.message && serverError.message.includes('duplicate'))) {
          // Handle duplicate designation name
          if (serverError.message.includes('DesignationName')) {
            setFieldErrors(prev => ({
              ...prev,
              DesignationName: 'This designation name already exists'
            }));
          } else {
            setError('A designation with this information already exists');
          }
        }
        // Check for the specific Level maximum error
        else if (serverError.message && serverError.message.includes('Level') && 
                 serverError.message.includes('maximum allowed value')) {
          setFieldErrors(prev => ({
            ...prev,
            Level: serverError.message
          }));
        }
        // Check for other field-specific errors in the message
        else if (serverError.message && serverError.message.includes('Path')) {
          // Extract field name from error message if possible
          const fieldMatch = serverError.message.match(/Path `([^`]+)`/);
          if (fieldMatch && fieldMatch[1]) {
            const field = fieldMatch[1];
            if (field === 'Level' || field === 'DesignationName' || field === 'Description') {
              setFieldErrors(prev => ({
                ...prev,
                [field]: serverError.message
              }));
            } else {
              setError(serverError.message);
            }
          } else {
            setError(serverError.message);
          }
        }
        // Handle other server messages
        else {
          setError(serverError.message || serverError.error || 'Failed to add designation');
        }
      } else if (err.request) {
        // Request was made but no response
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      DesignationName: '',
      Level: '',
      Description: ''
    });
    setError('');
    setFieldErrors({
      DesignationName: '',
      Level: '',
      Description: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Helper function to get error message for a field
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName];
  };

  // Helper function to check if a field has error
  const hasFieldError = (fieldName) => {
    return !!fieldErrors[fieldName];
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
          Add New Designation
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Add padding from top for the first field */}
          <div style={{ marginTop: '16px' }}>
            <TextField
              fullWidth
              label="Designation Name"
              name="DesignationName"
              value={formData.DesignationName}
              onChange={handleChange}
              required
              error={hasFieldError('DesignationName')}
              helperText={getFieldError('DesignationName')}
              disabled={loading}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
          </div>
          
          <TextField
            fullWidth
            label="Level"
            name="Level"
            value={formData.Level}
            onChange={handleChange}
            required
            type="number"
            inputProps={{ 
              min: 1,
              max: 99,
              step: 1
            }}
            error={hasFieldError('Level')}
            helperText={getFieldError('Level') || 'Enter a number (e.g., 1, 2, 3)'}
            disabled={loading}
            size="medium"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            multiline
            rows={4}
            error={hasFieldError('Description')}
            helperText={getFieldError('Description')}
            disabled={loading}
            size="medium"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          
          {/* Display general error message if exists */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
              onClose={() => setError('')}
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
          disabled={loading}
          startIcon={loading ? null : <AddIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0'
            }
          }}
        >
          {loading ? 'Adding...' : 'Add Designation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDesignations;