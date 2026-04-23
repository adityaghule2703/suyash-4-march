// LabourEntry.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  WorkHistory as LabourIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
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

const LabourEntryPopup = ({ open, onClose, workOrder, onLabour }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formData, setFormData] = useState({
    operator_id: '',
    hours_booked: '',
    start_time: '',
    end_time: ''
  });

  const operations = workOrder?.operations || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedOperation) {
      setError('Please select an operation');
      return;
    }
    if (!formData.operator_id.trim()) {
      setError('Operator ID is required');
      return;
    }
    if (!formData.hours_booked || formData.hours_booked <= 0) {
      setError('Hours booked is required');
      return;
    }
    if (!formData.start_time) {
      setError('Start time is required');
      return;
    }
    if (!formData.end_time) {
      setError('End time is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/labour`,
        {
          operator_id: formData.operator_id,
          operation_seq: selectedOperation.op_sequence,
          hours_booked: Number(formData.hours_booked),
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onLabour(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add labour entry');
      }
    } catch (err) {
      console.error('Error adding labour entry:', err);
      setError(err.response?.data?.message || 'Failed to add labour entry');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedOperation(null);
    setFormData({ operator_id: '', hours_booked: '', start_time: '', end_time: '' });
    setError('');
    onClose();
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
      color: COLORS.text.primary
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <LabourIcon sx={{ color: '#F59E0B' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Labour Entry
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography>
              </Stack>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OPERATION <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <Autocomplete
              fullWidth
              options={operations}
              getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name} - ${option.work_centre}`}
              value={selectedOperation}
              onChange={(event, newValue) => {
                setSelectedOperation(newValue);
                setError('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select operation"
                  error={!!error && !selectedOperation}
                  sx={inputStyle}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OPERATOR ID <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="operator_id"
              value={formData.operator_id}
              onChange={handleChange}
              placeholder="Enter operator ID"
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              HOURS BOOKED <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="hours_booked"
              value={formData.hours_booked}
              onChange={handleChange}
              placeholder="e.g., 4"
              inputProps={{ min: 0, step: 0.5 }}
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              START TIME <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              size="small"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              END TIME <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              size="small"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
            />
          </Box>

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
          onClick={handleClose}
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
          startIcon={<LabourIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#F59E0B',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#D97706' }
          }}
        >
          {loading ? 'Processing...' : 'Add Labour Entry'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabourEntryPopup;