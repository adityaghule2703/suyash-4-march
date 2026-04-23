import React, { useState, useEffect } from 'react';
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
  Chip,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Verified as VerifiedIcon,
  Description as DescriptionIcon
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

// Calibration type options from enum
const CALIBRATION_TYPE_OPTIONS = [
  'Internal',
  'External NABL',
  'Manufacturer Service'
];

// Found condition options from enum
const FOUND_CONDITION_OPTIONS = [
  'Within Tolerance',
  'Out of Tolerance',
  'Damaged'
];

const CalibrationDialog = ({ open, onClose, gauge, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    calibration_date: '',
    calibration_type: '',
    calibrating_agency: '',
    certificate_no: '',
    certificate_path: '',
    found_condition: '',
    adjustment_made: false,
    adjustment_details: '',
    calibrated_by: '',
    traceability: ''
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Set default calibration date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        calibration_date: today,
        calibration_type: '',
        calibrating_agency: '',
        certificate_no: '',
        certificate_path: '',
        found_condition: '',
        adjustment_made: false,
        adjustment_details: '',
        calibrated_by: '',
        traceability: ''
      });
      setFieldErrors({});
      setError('');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.calibration_date) {
      errors.calibration_date = 'Calibration date is required';
      isValid = false;
    }
    
    if (!formData.calibration_type) {
      errors.calibration_type = 'Calibration type is required';
      isValid = false;
    }
    
    if (!formData.calibrating_agency) {
      errors.calibrating_agency = 'Calibrating agency is required';
      isValid = false;
    }
    
    if (!formData.certificate_no) {
      errors.certificate_no = 'Certificate number is required';
      isValid = false;
    }
    
    if (!formData.certificate_path) {
      errors.certificate_path = 'Certificate path is required';
      isValid = false;
    }
    
    if (!formData.found_condition) {
      errors.found_condition = 'Found condition is required';
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
      
      // Get the custodian_id from the gauge object
      // custodian_id can be either a string or an object with _id property
      let custodianId = null;
      if (gauge?.custodian_id) {
        if (typeof gauge.custodian_id === 'string') {
          custodianId = gauge.custodian_id;
        } else if (gauge.custodian_id._id) {
          custodianId = gauge.custodian_id._id;
        }
      }
      
      const requestData = {
        calibration_date: formData.calibration_date,
        calibration_type: formData.calibration_type,
        calibrating_agency: formData.calibrating_agency,
        certificate_no: formData.certificate_no,
        certificate_path: formData.certificate_path,
        found_condition: formData.found_condition,
        adjustment_made: formData.adjustment_made,
        adjustment_details: formData.adjustment_details || '',
        calibrated_by: custodianId, // Pass custodian_id instead of text
        traceability: formData.traceability || ''
      };

      const response = await axios.put(
        `${BASE_URL}/api/gauges/${gauge._id}/calibrate`,
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
        setError(response.data.message || 'Failed to add calibration record');
      }
    } catch (err) {
      console.error('Error adding calibration:', err);
      setError(err.response?.data?.message || 'Failed to add calibration record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCalibrationTypeColor = (type) => {
    const colors = {
      'Internal': { bg: '#E0F2FE', color: '#0369A1' },
      'External NABL': { bg: '#D1FAE5', color: '#065F46' },
      'Manufacturer Service': { bg: '#F3E8FF', color: '#7E22CE' }
    };
    return colors[type] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getFoundConditionColor = (condition) => {
    const colors = {
      'Within Tolerance': { bg: '#D1FAE5', color: '#065F46' },
      'Out of Tolerance': { bg: '#FEE2E2', color: '#991B1B' },
      'Damaged': { bg: '#FEF3C7', color: '#B45309' }
    };
    return colors[condition] || { bg: '#F1F5F9', color: '#475569' };
  };

  // Get custodian name for display
  const getCustodianName = () => {
    if (!gauge?.custodian_id) return 'Not assigned';
    if (typeof gauge.custodian_id === 'string') return gauge.custodian_id;
    if (gauge.custodian_id._id) return gauge.custodian_id.name;
    return 'Not assigned';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Calibrate Gauge
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
            Gauge: {gauge?.gauge_code || gauge?.gauge_id} - {gauge?.gauge_name}
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
          {/* Current Gauge Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Last Calibration Date
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mt: 0.5 }}>
                  {gauge?.last_calibration_date ? new Date(gauge.last_calibration_date).toLocaleDateString() : 'Not calibrated yet'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Current Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={gauge?.status || 'Unknown'}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      height: 26,
                      bgcolor: gauge?.status === 'Calibrated' ? '#D1FAE5' : '#FEF3C7',
                      color: gauge?.status === 'Calibrated' ? '#065F46' : '#B45309'
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Calibrated By
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.primary, mt: 0.5 }}>
                  {getCustodianName()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Calibration Form */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Calibration Details
            </Typography>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Calibration Date <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    name="calibration_date"
                    value={formData.calibration_date}
                    onChange={handleChange}
                    error={!!fieldErrors.calibration_date}
                    InputLabelProps={{ shrink: true }}
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
                  {fieldErrors.calibration_date && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.calibration_date}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Calibration Type <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!fieldErrors.calibration_type}>
                    <Select
                      name="calibration_type"
                      value={formData.calibration_type}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      <MenuItem value="" disabled>Select calibration type</MenuItem>
                      {CALIBRATION_TYPE_OPTIONS.map(option => {
                        const colors = getCalibrationTypeColor(option);
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
                  {fieldErrors.calibration_type && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.calibration_type}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Calibrating Agency <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="calibrating_agency"
                    value={formData.calibrating_agency}
                    onChange={handleChange}
                    placeholder="e.g., ABC Calibration Lab"
                    error={!!fieldErrors.calibrating_agency}
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
                  {fieldErrors.calibrating_agency && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.calibrating_agency}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Certificate No <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="certificate_no"
                    value={formData.certificate_no}
                    onChange={handleChange}
                    placeholder="e.g., CAL-2026-001"
                    error={!!fieldErrors.certificate_no}
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
                  {fieldErrors.certificate_no && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.certificate_no}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Certificate Path <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="certificate_path"
                    value={formData.certificate_path}
                    onChange={handleChange}
                    placeholder="e.g., /uploads/certificates/CAL-2026-001.pdf"
                    error={!!fieldErrors.certificate_path}
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
                  {fieldErrors.certificate_path && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.certificate_path}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Found Condition <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!fieldErrors.found_condition}>
                    <Select
                      name="found_condition"
                      value={formData.found_condition}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      <MenuItem value="" disabled>Select found condition</MenuItem>
                      {FOUND_CONDITION_OPTIONS.map(option => {
                        const colors = getFoundConditionColor(option);
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
                  {fieldErrors.found_condition && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.found_condition}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="adjustment_made"
                        checked={formData.adjustment_made}
                        onChange={handleChange}
                        sx={{
                          color: COLORS.primary,
                          '&.Mui-checked': { color: COLORS.primary }
                        }}
                      />
                    }
                    label="Adjustment Made"
                  />
                </Box>
              </Grid>

              {formData.adjustment_made && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Adjustment Details
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      name="adjustment_details"
                      value={formData.adjustment_details}
                      onChange={handleChange}
                      placeholder="Describe the adjustments made..."
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
              )}

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Traceability
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    name="traceability"
                    value={formData.traceability}
                    onChange={handleChange}
                    placeholder="e.g., Traceable to NIST standards"
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
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <VerifiedIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#8B5CF6',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#7C3AED' }
          }}
        >
          {loading ? 'Saving...' : 'Save Calibration'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalibrationDialog;