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
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const AddItem = ({ open, onClose, onAdd, materials }) => {
  const [formData, setFormData] = useState({
    PartNo: '',
    PartName: '',
    Description: '',
    DrawingNo: '',
    RevisionNo: '',
    Unit: '',
    HSNCode: '',
    MaterialID: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Enum values for Unit field
  const unitOptions = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.PartNo.trim()) {
      setError('Part number is required');
      return;
    }

    if (!formData.PartName.trim()) {
      setError('Part name is required');
      return;
    }

    if (!formData.Unit.trim()) {
      setError('Unit is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/items`, formData, {
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
        setError(response.data.message || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      PartNo: '',
      PartName: '',
      Description: '',
      DrawingNo: '',
      RevisionNo: '',
      Unit: '',
      HSNCode: '',
      MaterialID: '',
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
          Add New Item
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
                  label="Part Number *"
                  name="PartNo"
                  value={formData.PartNo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  error={!!error && error.includes('Part number')}
                  helperText={error && error.includes('Part number') ? error : ''}
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
                  label="Part Name *"
                  name="PartName"
                  value={formData.PartName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="medium"
                  variant="outlined"
                  error={!!error && error.includes('Part name')}
                  helperText={error && error.includes('Part name') ? error : ''}
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
                  label="Drawing Number"
                  name="DrawingNo"
                  value={formData.DrawingNo}
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
                  label="Revision Number"
                  name="RevisionNo"
                  value={formData.RevisionNo}
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
                <FormControl fullWidth error={!!error && error.includes('Unit')}>
                  <InputLabel 
                    id="unit-label"
                    sx={{
                      backgroundColor: '#FFF',
                      px: 1,
                      transform: 'translate(14px, -6px) scale(0.75)',
                      '&.Mui-focused': {
                        transform: 'translate(14px, -6px) scale(0.75)',
                        color: '#1976D2'
                      },
                      '&.MuiFormLabel-filled': {
                        transform: 'translate(14px, -6px) scale(0.75)'
                      }
                    }}
                  >
                    Unit *
                  </InputLabel>
                  <Select
                    labelId="unit-label"
                    name="Unit"
                    value={formData.Unit}
                    onChange={handleSelectChange}
                    disabled={loading}
                    size="medium"
                    displayEmpty
                    sx={{
                      borderRadius: 1,
                      '& .MuiSelect-select': {
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        height: 'auto'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 1,
                          mt: 0.5
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Unit</em>
                    </MenuItem>
                    {unitOptions.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && error.includes('Unit') && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mt: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="HSN Code"
                  name="HSNCode"
                  value={formData.HSNCode}
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

            <FormControl fullWidth>
              <InputLabel 
                id="material-label"
                sx={{
                  backgroundColor: '#FFF',
                  px: 1,
                  transform: 'translate(14px, -6px) scale(0.75)',
                  '&.Mui-focused': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                    color: '#1976D2'
                  },
                  '&.MuiFormLabel-filled': {
                    transform: 'translate(14px, -6px) scale(0.75)'
                  }
                }}
              >
                Material
              </InputLabel>
              <Select
                labelId="material-label"
                name="MaterialID"
                value={formData.MaterialID}
                onChange={handleSelectChange}
                disabled={loading}
                size="medium"
                displayEmpty
                sx={{
                  borderRadius: 1,
                  '& .MuiSelect-select': {
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    height: 'auto'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 1,
                      mt: 0.5
                    }
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select Material</em>
                </MenuItem>
                {materials.map((material) => (
                  <MenuItem key={material._id} value={material._id}>
                    {material.MaterialCode} - {material.MaterialName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
              label="Active Item"
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
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItem;