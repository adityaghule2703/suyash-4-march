import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddMaterial = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    MaterialCode: '',
    MaterialName: '',
    Description: '',
    Density: '',
    Unit: '',
    Standard: '',
    Grade: '',
    Color: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.MaterialCode.trim()) {
      setError('Material code is required');
      return;
    }

    if (!formData.MaterialName.trim()) {
      setError('Material name is required');
      return;
    }

    if (formData.Density && isNaN(parseFloat(formData.Density))) {
      setError('Density must be a valid number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/materials`, {
        ...formData,
        Density: formData.Density ? parseFloat(formData.Density) : null
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
        setError(response.data.message || 'Failed to add material');
      }
    } catch (err) {
      console.error('Error adding material:', err);
      setError(err.response?.data?.message || 'Failed to add material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      MaterialCode: '',
      MaterialName: '',
      Description: '',
      Density: '',
      Unit: '',
      Standard: '',
      Grade: '',
      Color: '',
      IsActive: true
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
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC',
        pt: 3,
        px: 3
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010'
        }}>
          Add New Material
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 4,
        px: 3,
        pb: 2
      }}>
        {/* Show error at the top if exists */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1,
              mb: 3,
              '& .MuiAlert-icon': {
                alignItems: 'center'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Add extra margin top container */}
        <Box sx={{ mt: 1 }}>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material Code *"
                  name="MaterialCode"
                  value={formData.MaterialCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  error={!!error && error.includes('Material code')}
                  helperText={error && error.includes('Material code') ? error : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material Name *"
                  name="MaterialName"
                  value={formData.MaterialName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  error={!!error && error.includes('Material name')}
                  helperText={error && error.includes('Material name') ? error : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Density"
                  name="Density"
                  value={formData.Density}
                  onChange={handleChange}
                  type="number"
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  error={!!error && error.includes('Density')}
                  helperText={error && error.includes('Density') ? error : ''}
                  InputProps={{
                    inputProps: {
                      step: "0.01",
                      min: "0"
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  name="Unit"
                  value={formData.Unit}
                  onChange={handleChange}
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Standard"
                  name="Standard"
                  value={formData.Standard}
                  onChange={handleChange}
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Grade"
                  name="Grade"
                  value={formData.Grade}
                  onChange={handleChange}
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Color"
              name="Color"
              value={formData.Color}
              onChange={handleChange}
              disabled={loading}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="IsActive"
                  checked={formData.IsActive}
                  onChange={handleChange}
                  color="primary"
                  disabled={loading}
                />
              }
              label="Active Material"
              sx={{ mt: 1 }}
            />
          </Stack>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: '1px solid #E0E0E0',
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
          {loading ? 'Adding...' : 'Add Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaterial;