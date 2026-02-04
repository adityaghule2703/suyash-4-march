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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Level' ? value : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.DesignationName.trim()) {
      setError('Designation name is required');
      return;
    }

    if (formData.DesignationName.trim().length < 2) {
      setError('Designation name must be at least 2 characters');
      return;
    }

    if (!formData.Level.trim()) {
      setError('Level is required');
      return;
    }

    const levelNum = parseInt(formData.Level, 10);
    if (isNaN(levelNum) || levelNum < 1) {
      setError('Level must be a positive number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/designations`, {
        ...formData,
        Level: levelNum
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
        setError(response.data.message || 'Failed to add designation');
      }
    } catch (err) {
      console.error('Error adding designation:', err);
      setError(err.response?.data?.message || 'Failed to add designation. Please try again.');
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
              error={!!error && (error.includes('Designation name') || error.includes('name must be'))}
              helperText={error && (error.includes('Designation name') || error.includes('name must be')) ? error : ''}
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
            error={!!error && (error.includes('Level is required') || error.includes('Level must be'))}
            helperText={error && (error.includes('Level is required') || error.includes('Level must be')) ? error : 'Enter a number (e.g., 1, 2, 3)'}
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
            disabled={loading}
            size="medium"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          
          {error && !error.includes('Designation name') && !error.includes('name must be') && !error.includes('Level') && (
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