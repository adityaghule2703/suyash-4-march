// src/pages/DeliveryChallan/components/Modals/PODDialog.js
import React, { useState } from 'react';
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
  Box
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

const PODDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    actual_delivery_date: '',
    pod_signed_by: '',
    delivery_remarks: '',
    pod_document: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, pod_document: file }));
      setFieldErrors(prev => ({ ...prev, pod_document: '' }));
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.actual_delivery_date) {
      errors.actual_delivery_date = 'Actual delivery date is required';
      isValid = false;
    }
    if (!formData.pod_signed_by.trim()) {
      errors.pod_signed_by = 'Signed by is required';
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
      const submitData = new FormData();
      submitData.append('actual_delivery_date', formData.actual_delivery_date);
      submitData.append('pod_signed_by', formData.pod_signed_by);
      submitData.append('delivery_remarks', formData.delivery_remarks || '');
      if (formData.pod_document) {
        submitData.append('pod_document', formData.pod_document);
      }

      const response = await axios.put(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/pod`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update POD');
      }
    } catch (err) {
      console.error('Error updating POD:', err);
      setError(err.response?.data?.message || 'Failed to update POD. Please try again.');
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Proof of Delivery (POD)
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 0.5 }}>
          For DC: {deliveryChallan?.dc_number}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Actual Delivery Date <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="actual_delivery_date"
                    type="date"
                    value={formData.actual_delivery_date}
                    onChange={handleChange}
                    error={!!fieldErrors.actual_delivery_date}
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
                  {fieldErrors.actual_delivery_date && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.actual_delivery_date}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Signed By <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="pod_signed_by"
                    value={formData.pod_signed_by}
                    onChange={handleChange}
                    error={!!fieldErrors.pod_signed_by}
                    placeholder="e.g., Mr. Suresh Kumar - Stores Incharge"
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
                  {fieldErrors.pod_signed_by && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.pod_signed_by}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Delivery Remarks
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="delivery_remarks"
                    multiline
                    rows={3}
                    value={formData.delivery_remarks}
                    onChange={handleChange}
                    placeholder="e.g., All 4 boxes received in good condition"
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

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    POD Document (PDF/Image)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      height: 36,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      borderColor: COLORS.border,
                      justifyContent: 'flex-start',
                      px: 2,
                      '&:hover': {
                        borderColor: COLORS.primary,
                        bgcolor: `${COLORS.primary}10`
                      }
                    }}
                  >
                    {formData.pod_document ? formData.pod_document.name : 'Choose File'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    Upload POD scan (PDF or Image format)
                  </Typography>
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
          {loading ? 'Submitting...' : 'Submit POD'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PODDialog;