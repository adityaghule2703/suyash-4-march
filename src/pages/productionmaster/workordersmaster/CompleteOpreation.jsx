// CompleteOperation.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
  Box,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  TaskAlt as CompleteOpIcon,
  Bolt as BoltIcon,
  Science as ScienceIcon
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

const STATUS_COLORS = {
  'In Progress': { bg: '#E0F2FE', color: '#0284C7' }
};

const CompleteOperationPopup = ({ open, onClose, workOrder, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formData, setFormData] = useState({
    output_qty: '',
    rejection_qty: '',
    rejection_reason: '',
    actual_setup_min: '',
    actual_run_min: '',
    torque_readings: []
  });

  const operations = workOrder?.operations || [];
  const inProgressOperation = operations.find(op => op.status === 'In Progress');

  useEffect(() => {
    if (open && workOrder && inProgressOperation) {
      setSelectedOperation(inProgressOperation);
      setFormData(prev => ({
        ...prev,
        output_qty: inProgressOperation.planned_qty || workOrder?.planned_qty || ''
      }));
      setError('');
    } else if (open && workOrder && !inProgressOperation) {
      setError('No operation is currently In Progress. Please start an operation first.');
    }
  }, [open, workOrder, inProgressOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTorqueReadingChange = (jointIndex, value) => {
    const updatedReadings = [...formData.torque_readings];
    updatedReadings[jointIndex] = value;
    setFormData(prev => ({ ...prev, torque_readings: updatedReadings }));
  };

  const handleSubmit = async () => {
    if (!selectedOperation) {
      setError('Please select an operation');
      return;
    }
    if (!formData.output_qty || formData.output_qty <= 0) {
      setError('Output quantity is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        output_qty: Number(formData.output_qty),
        rejection_qty: Number(formData.rejection_qty) || 0,
        rejection_reason: formData.rejection_reason || '',
        actual_setup_min: Number(formData.actual_setup_min) || 0,
        actual_run_min: Number(formData.actual_run_min) || 0
      };
      
      if (selectedOperation.requires_torque_recording && formData.torque_readings.length > 0) {
        payload.torque_readings = formData.torque_readings.map(val => Number(val));
      }
      
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/${selectedOperation.op_sequence}/complete`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onComplete(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to complete operation');
      }
    } catch (err) {
      console.error('Error completing operation:', err);
      setError(err.response?.data?.message || 'Failed to complete operation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedOperation(null);
    setFormData({
      output_qty: '',
      rejection_qty: '',
      rejection_reason: '',
      actual_setup_min: '',
      actual_run_min: '',
      torque_readings: []
    });
    setError('');
    onClose();
  };

  const maxOutputQty = selectedOperation?.planned_qty || workOrder?.planned_qty || 0;

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
          overflow: 'hidden',
          maxHeight: '90vh'
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
          <CompleteOpIcon sx={{ color: '#059669' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Complete Operation
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
            {inProgressOperation ? (
              <Paper 
                sx={{ 
                  p: 1.5, 
                  bgcolor: `${COLORS.primary}10`, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.primary}`,
                  cursor: 'not-allowed'
                }}
              >
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      {inProgressOperation.op_sequence}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Name:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      {inProgressOperation.operation_name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {inProgressOperation.work_centre}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Qty:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {inProgressOperation.planned_qty || workOrder?.planned_qty}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    <Chip 
                      label={inProgressOperation.status} 
                      size="small"
                      sx={{ 
                        fontSize: '0.6rem', 
                        height: 20,
                        bgcolor: STATUS_COLORS['In Progress']?.bg || '#E0F2FE',
                        color: STATUS_COLORS['In Progress']?.color || '#0284C7'
                      }}
                    />
                  </Stack>
                  {inProgressOperation.requires_torque_recording && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Torque Recording:</Typography>
                      <Chip 
                        icon={<BoltIcon sx={{ fontSize: '0.65rem' }} />}
                        label={`${inProgressOperation.expected_joints?.length || 0} joints`}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primary, color: '#fff' }}
                      />
                    </Stack>
                  )}
                  {inProgressOperation.requires_functional_test && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Functional Test:</Typography>
                      <Chip 
                        icon={<ScienceIcon sx={{ fontSize: '0.65rem' }} />}
                        label="Required"
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.success, color: '#fff' }}
                      />
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ) : (
              <Autocomplete
                fullWidth
                options={operations}
                getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name} - ${option.work_centre} (Planned: ${option.planned_qty})${option.requires_torque_recording ? ' 🔩' : ''}${option.requires_functional_test ? ' 🧪' : ''}`}
                value={selectedOperation}
                onChange={(event, newValue) => {
                  setSelectedOperation(newValue);
                  if (newValue) {
                    setFormData(prev => ({
                      ...prev,
                      output_qty: newValue.planned_qty || workOrder?.planned_qty || '',
                      torque_readings: newValue.requires_torque_recording && newValue.expected_joints 
                        ? new Array(newValue.expected_joints.length).fill('') 
                        : []
                    }));
                  }
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
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OUTPUT QUANTITY <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="output_qty"
              value={formData.output_qty}
              onChange={handleChange}
              placeholder={`Max: ${maxOutputQty}`}
              inputProps={{ max: maxOutputQty, min: 0 }}
              sx={inputStyle}
            />
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Max allowed: {maxOutputQty}
            </Typography>
          </Box>

          {selectedOperation?.requires_torque_recording && selectedOperation.expected_joints?.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BoltIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                Torque Readings (Nm)
              </Typography>
              <Stack spacing={1.5}>
                {selectedOperation.expected_joints.map((joint, idx) => (
                  <Box key={idx}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mb: 0.5 }}>
                      {joint} <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={formData.torque_readings[idx] || ''}
                      onChange={(e) => handleTorqueReadingChange(idx, e.target.value)}
                      placeholder={`Enter torque value for ${joint}`}
                      inputProps={{ min: 0, step: 0.1 }}
                      sx={inputStyle}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              REJECTION QUANTITY
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="rejection_qty"
              value={formData.rejection_qty}
              onChange={handleChange}
              placeholder="e.g., 10"
              inputProps={{ min: 0 }}
              sx={inputStyle}
            />
          </Box>

          {formData.rejection_qty > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                REJECTION REASON
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                name="rejection_reason"
                value={formData.rejection_reason}
                onChange={handleChange}
                placeholder="e.g., Dimensional OOT"
                sx={inputStyle}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              ACTUAL SETUP TIME (minutes)
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="actual_setup_min"
              value={formData.actual_setup_min}
              onChange={handleChange}
              placeholder="e.g., 18"
              inputProps={{ min: 0, step: 0.1 }}
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              ACTUAL RUN TIME (minutes)
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="actual_run_min"
              value={formData.actual_run_min}
              onChange={handleChange}
              placeholder="e.g., 1.6"
              inputProps={{ min: 0, step: 0.1 }}
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
          disabled={loading || !selectedOperation}
          startIcon={<CompleteOpIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#059669',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#047857' }
          }}
        >
          {loading ? 'Processing...' : 'Complete Operation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteOperationPopup;