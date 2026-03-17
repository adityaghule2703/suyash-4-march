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
  Box,
  Typography,
  Autocomplete
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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

const EditTax = ({ open, onClose, tax, onUpdate }) => {
  const [formData, setFormData] = useState({
    HSNCode: '',
    GSTPercentage: '',
    GSTType: 'CGST/SGST',
    Description: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // GST Type options for Autocomplete
  const gstTypeOptions = [
    { value: 'CGST/SGST', label: 'CGST/SGST' },
    { value: 'IGST', label: 'IGST' }
  ];
  const [selectedGSTType, setSelectedGSTType] = useState(null);

  useEffect(() => {
    if (tax) {
      setFormData({
        HSNCode: tax.HSNCode || '',
        GSTPercentage: tax.GSTPercentage?.toString() || '',
        GSTType: tax.GSTType || 'CGST/SGST',
        Description: tax.Description || '',
        IsActive: tax.IsActive !== undefined ? tax.IsActive : true
      });
      
      // Set selected GST type
      const gstType = gstTypeOptions.find(option => option.value === tax.GSTType);
      setSelectedGSTType(gstType || gstTypeOptions[0]);
    }
  }, [tax]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGSTTypeChange = (event, newValue) => {
    setSelectedGSTType(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        GSTType: newValue.value
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.HSNCode.trim()) {
      setError('HSN Code is required');
      return;
    }

    if (!formData.GSTPercentage) {
      setError('GST Percentage is required');
      return;
    }

    const gstPercentage = parseFloat(formData.GSTPercentage);
    if (isNaN(gstPercentage) || gstPercentage < 0 || gstPercentage > 100) {
      setError('GST Percentage must be a number between 0 and 100');
      return;
    }

    if (!formData.GSTType) {
      setError('GST Type is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/taxes/${tax._id}`, {
        ...formData,
        GSTPercentage: gstPercentage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update tax');
      }
    } catch (err) {
      console.error('Error updating tax:', err);
      setError(err.response?.data?.message || 'Failed to update tax. Please try again.');
    } finally {
      setLoading(false);
    }
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
          Edit Tax
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* HSN Code Field */}
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
                  HSN CODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="HSNCode"
                  value={formData.HSNCode}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter HSN code"
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

            {/* GST Percentage Field */}
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
                  GST PERCENTAGE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="GSTPercentage"
                  value={formData.GSTPercentage}
                  onChange={handleChange}
                  disabled={loading}
                  type="number"
                  placeholder="Enter GST percentage"
                  size="small"
                  variant="outlined"
                  InputProps={{
                    inputProps: {
                      step: "0.01",
                      min: "0",
                      max: "100"
                    },
                    endAdornment: (
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 0.5 }}>
                        %
                      </Typography>
                    )
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
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Must be between 0 and 100
                </Typography>
              </Box>
            </Box>

            {/* GST Type Field - Using Autocomplete like in AddUser */}
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
                  GST TYPE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <Autocomplete
                  fullWidth
                  options={gstTypeOptions}
                  value={selectedGSTType}
                  onChange={handleGSTTypeChange}
                  getOptionLabel={(option) => option.label || ''}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select GST type"
                      required
                      error={!!error && error.includes('GST Type')}
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
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {option.label}
                      </Typography>
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
              </Box>
            </Box>

            {/* Description Field */}
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
                  DESCRIPTION
                </Typography>
                <TextField
                  fullWidth
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Enter tax description..."
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
          disabled={loading || !formData.HSNCode || !formData.GSTPercentage || !formData.GSTType}
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
          {loading ? 'Updating...' : 'Update Tax'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTax;