import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Typography, Box, Stack, Grid,
  FormControl, InputLabel, Select, MenuItem, Paper,
  FormControlLabel, Switch, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Factory as FactoryIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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

const LINE_TYPES = ['Busbar', 'General', 'Assembly', 'Testing', 'Packaging'];

const EditAssembly = ({ open, onClose, assemblyLine, onUpdate }) => {
  const [formData, setFormData] = useState({
    line_name: '',
    line_type: '',
    work_centre: '',
    description: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Initialize form data when assemblyLine changes
  useEffect(() => {
    if (assemblyLine && open) {
      setFormData({
        line_name: assemblyLine.line_name || '',
        line_type: assemblyLine.line_type || '',
        work_centre: assemblyLine.work_centre || '',
        description: assemblyLine.description || '',
        is_active: assemblyLine.is_active !== undefined ? assemblyLine.is_active : true
      });
    }
  }, [assemblyLine, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? checked : value
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.line_name.trim()) {
      errors.line_name = 'Line name is required';
      isValid = false;
    }
    if (!formData.line_type) {
      errors.line_type = 'Line type is required';
      isValid = false;
    }
    if (!formData.work_centre.trim()) {
      errors.work_centre = 'Work centre is required';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in the form');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        line_name: formData.line_name,
        line_type: formData.line_type,
        work_centre: formData.work_centre,
        description: formData.description || '',
        is_active: formData.is_active
      };

      const response = await axios.put(`${BASE_URL}/api/assembly-lines/${assemblyLine._id}`, updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onUpdate) onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update assembly line');
      }
    } catch (err) {
      console.error('Error updating assembly line:', err);
      setError(err.response?.data?.message || 'Failed to update assembly line');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  if (!assemblyLine) return null;

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
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Assembly Line
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Assembly Line Info Summary */}
          <Paper sx={{ 
            p: 1, 
            bgcolor: COLORS.primaryLight, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.primary}20`
          }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Line Code:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                  {assemblyLine.line_code || `AL-${String(assemblyLine._id?.slice(-4) || '0001')}`}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {new Date(assemblyLine.created_at).toLocaleDateString()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Status:</Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 500, 
                  color: assemblyLine.is_active ? '#059669' : '#DC2626' 
                }}>
                  {assemblyLine.is_active ? 'Active' : 'Inactive'}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Edit Form */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <FactoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Assembly Line Details
            </Typography>

            <Grid container spacing={2}>
              {/* Line Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    LINE NAME <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="line_name"
                    value={formData.line_name}
                    onChange={handleChange}
                    error={!!fieldErrors.line_name}
                    helperText={fieldErrors.line_name}
                    placeholder="e.g., Busbar Assembly Line 1"
                    sx={inputStyle}
                  />
                </Box>
              </Grid>

              {/* Line Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    LINE TYPE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!fieldErrors.line_type}>
                    <Select
                      name="line_type"
                      value={formData.line_type}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5 },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                      }}
                    >
                      <MenuItem value="">Select Line Type</MenuItem>
                      {LINE_TYPES.map(option => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.line_type && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                        {fieldErrors.line_type}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>

              {/* Work Centre */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    WORK CENTRE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="work_centre"
                    value={formData.work_centre}
                    onChange={handleChange}
                    error={!!fieldErrors.work_centre}
                    helperText={fieldErrors.work_centre}
                    placeholder="e.g., Assembly Bay 1"
                    sx={inputStyle}
                  />
                </Box>
              </Grid>

              {/* Status (Active/Inactive) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>STATUS</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={formData.is_active ? 'Active' : 'Inactive'}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: COLORS.text.primary
                      }
                    }}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                    Inactive assembly lines will not appear in dropdown selections
                  </Typography>
                </Box>
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>DESCRIPTION</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    size="small"
                    placeholder="Enter a detailed description of the assembly line..."
                    sx={inputStyle}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
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
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Updating...' : 'Update Assembly Line'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAssembly;