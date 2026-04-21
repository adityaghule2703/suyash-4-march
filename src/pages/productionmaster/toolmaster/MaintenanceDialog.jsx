import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Build as BuildIcon,
  Construction as MaintenanceIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

// Maintenance type options from enum
const MAINTENANCE_TYPE_OPTIONS = [
  'Sharpening',
  'Repair',
  'Inspection',
  'Replacement',
  'Regrind'
];

const MaintenanceDialog = ({ open, onClose, tool, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    type: '',
    reset_shots_to: 0,
    cost: '',
    performed_by: '',
    remarks: ''
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        type: '',
        reset_shots_to: 0,
        cost: '',
        performed_by: '',
        remarks: ''
      });
      setFieldErrors({});
      setError('');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.type) {
      errors.type = 'Maintenance type is required';
      isValid = false;
    }
    
    if (formData.reset_shots_to === undefined || formData.reset_shots_to === '') {
      errors.reset_shots_to = 'Reset shots value is required';
      isValid = false;
    }
    
    if (formData.reset_shots_to < 0) {
      errors.reset_shots_to = 'Reset shots cannot be negative';
      isValid = false;
    }
    
    if (formData.reset_shots_to > tool?.current_shots) {
      errors.reset_shots_to = `Reset shots cannot exceed current shots (${tool?.current_shots?.toLocaleString()})`;
      isValid = false;
    }
    
    if (!formData.cost) {
      errors.cost = 'Cost is required';
      isValid = false;
    }
    
    if (formData.cost && parseFloat(formData.cost) < 0) {
      errors.cost = 'Cost cannot be negative';
      isValid = false;
    }
    
    if (!formData.performed_by.trim()) {
      errors.performed_by = 'Performed by is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const requestData = {
        type: formData.type,
        reset_shots_to: Number(formData.reset_shots_to),
        cost: Number(formData.cost),
        performed_by: formData.performed_by,
        remarks: formData.remarks || ''
      };

      const response = await axios.post(
        `${BASE_URL}/api/tool-master/${tool._id}/maintenance`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add maintenance record');
      }
    } catch (err) {
      console.error('Error adding maintenance:', err);
      setError(err.response?.data?.message || 'Failed to add maintenance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMaintenanceTypeColor = (type) => {
    const colors = {
      'Sharpening': { bg: '#E0F2FE', color: '#0369A1' },
      'Repair': { bg: '#FEF3C7', color: '#B45309' },
      'Inspection': { bg: '#D1FAE5', color: '#065F46' },
      'Replacement': { bg: '#FEE2E2', color: '#991B1B' },
      'Regrind': { bg: '#F3E8FF', color: '#7E22CE' }
    };
    return colors[type] || { bg: '#F1F5F9', color: '#475569' };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add Maintenance Record
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
            Tool: {tool?.tool_code} - {tool?.tool_name}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Current Tool Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Current Shots
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                  {tool?.current_shots?.toLocaleString() || 0}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Max Shots
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                  {tool?.max_shots?.toLocaleString() || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Maintenance Form */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <MaintenanceIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Maintenance Details
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Maintenance Type <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!fieldErrors.type}>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      <MenuItem value="" disabled>Select maintenance type</MenuItem>
                      {MAINTENANCE_TYPE_OPTIONS.map(option => {
                        const colors = getMaintenanceTypeColor(option);
                        return (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            <Chip
                              label={option}
                              size="small"
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 500,
                                height: 24,
                                bgcolor: colors.bg,
                                color: colors.color
                              }}
                            />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {fieldErrors.type && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.type}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Reset Shots To <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    name="reset_shots_to"
                    value={formData.reset_shots_to}
                    onChange={handleChange}
                    placeholder="0"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">shots</InputAdornment>,
                    }}
                    error={!!fieldErrors.reset_shots_to}
                    helperText="Set to 0 for complete reset, or any other value"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '0.65rem',
                        marginLeft: 0
                      }
                    }}
                  />
                  {fieldErrors.reset_shots_to && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.reset_shots_to}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Cost (₹) <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="e.g., 2500"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    error={!!fieldErrors.cost}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.cost && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.cost}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Performed By <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="performed_by"
                    value={formData.performed_by}
                    onChange={handleChange}
                    placeholder="e.g., Toolroom team, John Doe"
                    error={!!fieldErrors.performed_by}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.performed_by && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.performed_by}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Remarks
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="e.g., Regrind — 0.2mm removed from punch face"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
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
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MaintenanceIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#F59E0B',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#D97706' }
          }}
        >
          {loading ? 'Adding...' : 'Add Maintenance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceDialog;