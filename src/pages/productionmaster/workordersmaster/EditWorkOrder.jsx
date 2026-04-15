// EditWorkOrder.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Typography, Box, Stack, Grid,
  FormControl, InputLabel, Select, MenuItem, Paper
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF'
  },
  border: '#E3E8EF'
};

const STATUS_OPTIONS = [
  'Planned', 'Released', 'Components Kitted', 'In Progress',
  'Partially Completed', 'On Hold', 'Completed', 'Cancelled'
];

const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

const EditWorkOrder = ({ open, onClose, workOrder, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workOrder) {
      setFormData({
        status: workOrder.status || 'Planned',
        priority: workOrder.priority || 'Medium',
        hold_reason: workOrder.hold_reason || '',
        assembly_line: workOrder.assembly_line || ''
      });
    }
  }, [workOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        status: formData.status,
        priority: formData.priority,
        hold_reason: formData.hold_reason,
        assembly_line: formData.assembly_line
      };

      const response = await axios.put(`${BASE_URL}/api/work-orders/${workOrder._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update work order');
      }
    } catch (err) {
      console.error('Error updating work order:', err);
      setError(err.response?.data?.message || 'Failed to update work order');
    } finally {
      setLoading(false);
    }
  };

  if (!workOrder) return null;

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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Work Order
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Work Order Info Summary */}
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.wo_number}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.customer_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.part_no} - {workOrder.part_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Progress:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.completed_qty} / {workOrder.planned_qty} completed
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  STATUS
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                    }}
                  >
                    {STATUS_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  PRIORITY
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary, borderWidth: 1 }
                    }}
                  >
                    {PRIORITY_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  ASSEMBLY LINE
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="assembly_line"
                  value={formData.assembly_line}
                  onChange={handleChange}
                  placeholder="e.g., Line A"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary },
                      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                    },
                    '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                  }}
                />
              </Box>
            </Grid>

            {formData.status === 'On Hold' && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    HOLD REASON
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="hold_reason"
                    multiline
                    rows={3}
                    value={formData.hold_reason}
                    onChange={handleChange}
                    placeholder="Provide reason for putting work order on hold..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>

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
          startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Updating...' : 'Update Work Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkOrder;