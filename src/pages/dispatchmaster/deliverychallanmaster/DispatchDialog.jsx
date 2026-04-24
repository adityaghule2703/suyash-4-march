// src/pages/DeliveryChallan/components/Modals/DispatchDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Grid,
  Alert,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const DISPATCH_MODES = ['Road', 'Rail', 'Air', 'Sea', 'Hand Delivery', 'Courier'];
const VEHICLE_TYPES = ['Regular', 'Over Dimensional Cargo (ODC)', 'Water Vessel', 'Air Cargo'];
const FREIGHT_TERMS_OPTIONS = ['Freight Paid', 'Freight To Pay', 'Freight Prepaid & Charged', 'Ex-Works'];

const DispatchDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    dispatch_mode: 'Road',
    transporter_name: '',
    transporter_gstin: '',
    transporter_id_ewb: '',
    vehicle_no: '',
    vehicle_type: 'Regular',
    lr_number: '',
    freight_terms: 'Freight Paid',
    freight_amount: '',
    insurance_required: false,
    insurance_amount: '',
    gate_pass_no: '',
    security_officer: ''
  });

  useEffect(() => {
    if (deliveryChallan && open) {
      // Fetch the transporter_id_ewb from transport object, not from eway_bill
      const transporterIdEwb = deliveryChallan.transport?.transporter_id_ewb || '';
      
      setFormData({
        dispatch_mode: deliveryChallan.transport?.dispatch_mode || 'Road',
        transporter_name: deliveryChallan.transport?.transporter_name || '',
        transporter_gstin: deliveryChallan.transport?.transporter_gstin || '',
        transporter_id_ewb: transporterIdEwb,
        vehicle_no: deliveryChallan.transport?.vehicle_no || '',
        vehicle_type: deliveryChallan.transport?.vehicle_type || 'Regular',
        lr_number: deliveryChallan.transport?.lr_number || '',
        freight_terms: deliveryChallan.transport?.freight_terms || 'Freight Paid',
        freight_amount: deliveryChallan.transport?.freight_amount || '',
        insurance_required: deliveryChallan.transport?.insurance_required || false,
        insurance_amount: deliveryChallan.transport?.insurance_amount || '',
        gate_pass_no: deliveryChallan.gate_pass?.gate_pass_no || '',
        security_officer: deliveryChallan.gate_pass?.security_officer || ''
      });
    }
  }, [deliveryChallan, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.dispatch_mode) {
      errors.dispatch_mode = 'Dispatch mode is required';
      isValid = false;
    }
    if (!formData.transporter_name.trim()) {
      errors.transporter_name = 'Transporter name is required';
      isValid = false;
    }
    if (!formData.transporter_gstin.trim()) {
      errors.transporter_gstin = 'Transporter GSTIN is required';
      isValid = false;
    }
    if (!formData.vehicle_no.trim()) {
      errors.vehicle_no = 'Vehicle number is required';
      isValid = false;
    }
    if (!formData.lr_number.trim()) {
      errors.lr_number = 'LR number is required';
      isValid = false;
    }
    if (!formData.gate_pass_no.trim()) {
      errors.gate_pass_no = 'Gate pass number is required';
      isValid = false;
    }
    if (!formData.security_officer.trim()) {
      errors.security_officer = 'Security officer name is required';
      isValid = false;
    }
    if (formData.freight_amount && isNaN(parseFloat(formData.freight_amount))) {
      errors.freight_amount = 'Freight amount must be a number';
      isValid = false;
    }
    if (formData.insurance_required && (!formData.insurance_amount || isNaN(parseFloat(formData.insurance_amount)))) {
      errors.insurance_amount = 'Insurance amount is required and must be a number';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in the form');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        dispatch_mode: formData.dispatch_mode,
        transporter_name: formData.transporter_name,
        transporter_gstin: formData.transporter_gstin,
        transporter_id_ewb: formData.transporter_id_ewb,
        vehicle_no: formData.vehicle_no,
        vehicle_type: formData.vehicle_type,
        lr_number: formData.lr_number,
        freight_terms: formData.freight_terms,
        freight_amount: formData.freight_amount ? parseFloat(formData.freight_amount) : 0,
        insurance_required: formData.insurance_required,
        insurance_amount: formData.insurance_amount ? parseFloat(formData.insurance_amount) : 0,
        gate_pass_no: formData.gate_pass_no,
        security_officer: formData.security_officer
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/dispatch`,
        payload,
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
        setError(response.data.message || 'Failed to update dispatch information');
      }
    } catch (err) {
      console.error('Error updating dispatch:', err);
      setError(err.response?.data?.message || 'Failed to update dispatch information. Please try again.');
    } finally {
      setLoading(false);
    }
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
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        mb: 2,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Dispatch Delivery Challan
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number} - {deliveryChallan?.customer_name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
              Dispatch Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Dispatch Mode <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!fieldErrors.dispatch_mode}>
                    <Select
                      name="dispatch_mode"
                      value={formData.dispatch_mode}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      {DISPATCH_MODES.map(mode => (
                        <MenuItem key={mode} value={mode} sx={{ fontSize: '0.75rem' }}>{mode}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {fieldErrors.dispatch_mode && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.dispatch_mode}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Transporter Name <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transporter_name"
                    value={formData.transporter_name}
                    onChange={handleChange}
                    error={!!fieldErrors.transporter_name}
                    placeholder="e.g., VRL Logistics"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.transporter_name && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.transporter_name}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Transporter GSTIN <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transporter_gstin"
                    value={formData.transporter_gstin}
                    onChange={handleChange}
                    error={!!fieldErrors.transporter_gstin}
                    placeholder="e.g., 29AAACV1234A1Z"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.transporter_gstin && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.transporter_gstin}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Transporter ID (EWB) <span style={{ color: '#94A3B8' }}>(Auto-filled)</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transporter_id_ewb"
                    value={formData.transporter_id_ewb}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: '#F3F4F6',
                        '& fieldset': { borderColor: COLORS.border }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                    Auto-populated from transport object
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Vehicle Number <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="vehicle_no"
                    value={formData.vehicle_no}
                    onChange={handleChange}
                    error={!!fieldErrors.vehicle_no}
                    placeholder="e.g., MH 12 AB 1234"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.vehicle_no && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.vehicle_no}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Vehicle Type
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      {VEHICLE_TYPES.map(type => (
                        <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    LR Number <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="lr_number"
                    value={formData.lr_number}
                    onChange={handleChange}
                    error={!!fieldErrors.lr_number}
                    placeholder="e.g., VRL-2025-0033"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.lr_number && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.lr_number}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Freight Terms
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="freight_terms"
                      value={formData.freight_terms}
                      onChange={handleChange}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '& .MuiSelect-select': { py: 1, px: 1.5 }
                      }}
                    >
                      {FREIGHT_TERMS_OPTIONS.map(term => (
                        <MenuItem key={term} value={term} sx={{ fontSize: '0.75rem' }}>{term}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Freight Amount (₹)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    name="freight_amount"
                    value={formData.freight_amount}
                    onChange={handleChange}
                    error={!!fieldErrors.freight_amount}
                    placeholder="0"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.freight_amount && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.freight_amount}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="insurance_required"
                      checked={formData.insurance_required}
                      onChange={handleChange}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: COLORS.primary,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: COLORS.primary,
                        },
                      }}
                    />
                  }
                  label="Insurance Required"
                />
              </Grid>

              {formData.insurance_required && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Insurance Amount (₹) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="insurance_amount"
                      value={formData.insurance_amount}
                      onChange={handleChange}
                      error={!!fieldErrors.insurance_amount}
                      placeholder="0"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          bgcolor: COLORS.background.white,
                          '&:hover fieldset': { borderColor: COLORS.primary }
                        },
                        '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                      }}
                    />
                    {fieldErrors.insurance_amount && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.insurance_amount}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Gate Pass Number <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="gate_pass_no"
                    value={formData.gate_pass_no}
                    onChange={handleChange}
                    error={!!fieldErrors.gate_pass_no}
                    placeholder="e.g., GP-2025-0088"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.gate_pass_no && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.gate_pass_no}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Security Officer <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="security_officer"
                    value={formData.security_officer}
                    onChange={handleChange}
                    error={!!fieldErrors.security_officer}
                    placeholder="e.g., Ramesh S."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        bgcolor: COLORS.background.white,
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                  {fieldErrors.security_officer && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.security_officer}
                    </Typography>
                  )}
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
            fontSize: '0.75rem'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Submitting...' : 'Confirm Dispatch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchDialog;