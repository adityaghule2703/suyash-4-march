// src/pages/DeliveryChallan/components/Modals/GenerateEWBDialog.js
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

const GenerateEWBDialog = ({ open, onClose, deliveryChallan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    transporter_id: '',
    transporter_name: '',
    vehicle_no: ''
  });

  useEffect(() => {
    if (deliveryChallan && open) {
      setFormData({
        transporter_id: deliveryChallan.transport?.transporter_id || '',
        transporter_name: deliveryChallan.transport?.transporter_name || '',
        vehicle_no: deliveryChallan.transport?.vehicle_no || ''
      });
    }
  }, [deliveryChallan, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.transporter_id) {
      setError('Transporter ID is required');
      return;
    }
    if (!formData.transporter_name) {
      setError('Transporter name is required');
      return;
    }
    if (!formData.vehicle_no) {
      setError('Vehicle number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        transporter_id: formData.transporter_id,
        transporter_name: formData.transporter_name,
        vehicle_no: formData.vehicle_no
      };
      
      const response = await axios.post(
        `${BASE_URL}/api/delivery-challans/${deliveryChallan._id}/generate-ewb`,
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
        setError(response.data.message || 'Failed to generate EWB');
      }
    } catch (err) {
      console.error('Error generating EWB:', err);
      setError(err.response?.data?.message || 'Failed to generate EWB. Please try again.');
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
          Generate E-Way Bill
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
                    Transporter ID <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transporter_id"
                    value={formData.transporter_id}
                    onChange={handleChange}
                    placeholder="e.g., 37AAACT1234A1Z"
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
                    Transporter Name <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="transporter_name"
                    value={formData.transporter_name}
                    onChange={handleChange}
                    placeholder="e.g., VRL Logistics"
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
                    Vehicle Number <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="vehicle_no"
                    value={formData.vehicle_no}
                    onChange={handleChange}
                    placeholder="e.g., MH 12 AB 1234"
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
          {loading ? 'Generating...' : 'Generate EWB'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateEWBDialog;