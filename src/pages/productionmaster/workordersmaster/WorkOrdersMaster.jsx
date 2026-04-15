// WorkOrdersMaster.jsx (Complete with all buttons - Updated)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, TextField, InputAdornment, Tooltip,
  Typography, Snackbar, TablePagination, Checkbox, Stack, Chip,
  Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Alert, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Autocomplete, Switch, FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  RocketLaunch as RocketLaunchIcon,
  Block as BlockIcon,
  PauseCircleOutline as HoldIcon,
  PlayCircleOutline as StartIcon,
  Replay as ResumeIcon,
  TaskAlt as CompleteOpIcon,
  FactCheck as CompleteWOIcon,
  WorkHistory as LabourIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddWorkOrder from './AddWorkOrder';
import EditWorkOrder from './EditWorkOrder';
import ViewWorkOrder from './ViewWorkOrder';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
};

// Status color mapping
const STATUS_COLORS = {
  'Planned': { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  'Released': { bg: '#E0E7FF', color: '#4338CA', border: '#C7D2FE' },
  'Components Kitted': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'In Progress': { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  'Partially Completed': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'On Hold': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  'Completed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
};

const PRIORITY_COLORS = {
  'Critical': { bg: '#FEE2E2', color: '#DC2626' },
  'High': { bg: '#FEF3C7', color: '#D97706' },
  'Medium': { bg: '#E0F2FE', color: '#0284C7' },
  'Low': { bg: '#D1FAE5', color: '#059669' }
};

// Add Operations Popup Component (NEW)
const AddOperationsPopup = ({ open, onClose, workOrder, onOperationsAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [operations, setOperations] = useState([
    {
      op_sequence: 10,
      operation_name: '',
      work_centre: '',
      machine_id: '',
      operator_id: '',
      required_skill: '',
      planned_setup_min: '',
      planned_run_min: '',
      planned_qty: '',
      is_subcontract: false,
      subcontract_vendor: '',
      planned_start: ''
    }
  ]);

  const handleOperationChange = (index, field, value) => {
    const updatedOps = [...operations];
    updatedOps[index][field] = value;
    setOperations(updatedOps);
  };

  const addOperation = () => {
    const nextSequence = operations.length > 0 
      ? Math.max(...operations.map(o => Number(o.op_sequence) || 0)) + 10 
      : 10;
    setOperations([
      ...operations,
      {
        op_sequence: nextSequence,
        operation_name: '',
        work_centre: '',
        machine_id: '',
        operator_id: '',
        required_skill: '',
        planned_setup_min: '',
        planned_run_min: '',
        planned_qty: '',
        is_subcontract: false,
        subcontract_vendor: '',
        planned_start: ''
      }
    ]);
  };

  const removeOperation = (index) => {
    if (operations.length === 1) {
      setError('At least one operation is required');
      return;
    }
    setOperations(operations.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate operations
    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      if (!op.operation_name.trim()) {
        setError(`Operation ${i + 1}: Operation name is required`);
        return;
      }
      if (!op.work_centre.trim()) {
        setError(`Operation ${i + 1}: Work centre is required`);
        return;
      }
      if (!op.op_sequence || op.op_sequence <= 0) {
        setError(`Operation ${i + 1}: Valid operation sequence is required`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      // Prepare operations data - convert numeric fields
      const operationsData = operations.map(op => ({
        ...op,
        op_sequence: Number(op.op_sequence),
        planned_setup_min: Number(op.planned_setup_min) || 0,
        planned_run_min: Number(op.planned_run_min) || 0,
        planned_qty: Number(op.planned_qty) || 0,
        planned_start: op.planned_start || undefined
      }));

      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/add`,
        { operations: operationsData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onOperationsAdded(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add operations');
      }
    } catch (err) {
      console.error('Error adding operations:', err);
      setError(err.response?.data?.message || 'Failed to add operations');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOperations([
      {
        op_sequence: 10,
        operation_name: '',
        work_centre: '',
        machine_id: '',
        operator_id: '',
        required_skill: '',
        planned_setup_min: '',
        planned_run_min: '',
        planned_qty: '',
        is_subcontract: false,
        subcontract_vendor: '',
        planned_start: ''
      }
    ]);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        justifyContent: 'space-between'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SettingsIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add Operations
          </Typography>
        </Stack>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addOperation}
          sx={{
            height: 32,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.7rem'
          }}
        >
          Add Operation
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, maxHeight: '70vh', overflowY: 'auto' }}>
        <Stack spacing={3}>
          {/* Work Order Info */}
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
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Operations List */}
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary }}>
            OPERATIONS
          </Typography>

          {operations.map((op, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${COLORS.border}`,
                position: 'relative'
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                    Operation {index + 1}
                  </Typography>
                  {operations.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeOperation(index)}
                      sx={{ color: '#DC2626' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      OP SEQUENCE *
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={op.op_sequence}
                      onChange={(e) => handleOperationChange(index, 'op_sequence', e.target.value)}
                      placeholder="e.g., 10"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 2 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      OPERATION NAME *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={op.operation_name}
                      onChange={(e) => handleOperationChange(index, 'operation_name', e.target.value)}
                      placeholder="e.g., Blanking"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      WORK CENTRE *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={op.work_centre}
                      onChange={(e) => handleOperationChange(index, 'work_centre', e.target.value)}
                      placeholder="e.g., Press Shop"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      MACHINE ID
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={op.machine_id}
                      onChange={(e) => handleOperationChange(index, 'machine_id', e.target.value)}
                      placeholder="Machine ID"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      OPERATOR ID
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={op.operator_id}
                      onChange={(e) => handleOperationChange(index, 'operator_id', e.target.value)}
                      placeholder="Operator ID"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      REQUIRED SKILL
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={op.required_skill}
                      onChange={(e) => handleOperationChange(index, 'required_skill', e.target.value)}
                      placeholder="e.g., PRESS-OPS"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      PLANNED SETUP (min)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={op.planned_setup_min}
                      onChange={(e) => handleOperationChange(index, 'planned_setup_min', e.target.value)}
                      placeholder="e.g., 15"
                      inputProps={{ min: 0, step: 0.5 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      PLANNED RUN (min)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={op.planned_run_min}
                      onChange={(e) => handleOperationChange(index, 'planned_run_min', e.target.value)}
                      placeholder="e.g., 1.5"
                      inputProps={{ min: 0, step: 0.1 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      PLANNED QTY
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={op.planned_qty}
                      onChange={(e) => handleOperationChange(index, 'planned_qty', e.target.value)}
                      placeholder="Planned quantity"
                      inputProps={{ min: 0 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Box sx={{ flex: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={op.is_subcontract}
                          onChange={(e) => handleOperationChange(index, 'is_subcontract', e.target.checked)}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.7rem' }}>Subcontract Operation</Typography>}
                    />
                  </Box>
                  {op.is_subcontract && (
                    <Box sx={{ flex: 2 }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                        SUBCONTRACT VENDOR
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={op.subcontract_vendor}
                        onChange={(e) => handleOperationChange(index, 'subcontract_vendor', e.target.value)}
                        placeholder="Vendor name"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
                    </Box>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      PLANNED START DATE
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={op.planned_start}
                      onChange={(e) => handleOperationChange(index, 'planned_start', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          ))}

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
          startIcon={<SettingsIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Adding...' : 'Add Operations'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Complete Operation Popup Component
const CompleteOperationPopup = ({ open, onClose, workOrder, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formData, setFormData] = useState({
    output_qty: '',
    rejection_qty: '',
    rejection_reason: '',
    actual_setup_min: '',
    actual_run_min: ''
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
    if (!formData.output_qty || formData.output_qty <= 0) {
      setError('Output quantity is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/${selectedOperation.op_sequence}/complete`,
        {
          output_qty: Number(formData.output_qty),
          rejection_qty: Number(formData.rejection_qty) || 0,
          rejection_reason: formData.rejection_reason || '',
          actual_setup_min: Number(formData.actual_setup_min) || 0,
          actual_run_min: Number(formData.actual_run_min) || 0
        },
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
      actual_run_min: ''
    });
    setError('');
    onClose();
  };

  const maxOutputQty = selectedOperation?.planned_qty || workOrder?.planned_qty || 0;

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
        gap: 1
      }}>
        <CompleteOpIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Complete Operation
        </Typography>
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
              getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name} - ${option.work_centre} (Planned: ${option.planned_qty})`}
              value={selectedOperation}
              onChange={(event, newValue) => {
                setSelectedOperation(newValue);
                if (newValue) {
                  setFormData(prev => ({
                    ...prev,
                    output_qty: newValue.planned_qty || ''
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary }
                    }
                  }}
                />
              )}
            />
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Max allowed: {maxOutputQty}
            </Typography>
          </Box>

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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '&:hover fieldset': { borderColor: COLORS.primary }
                  }
                }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
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

// Labour Entry Popup Component
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
        gap: 1
      }}>
        <LabourIcon sx={{ color: '#F59E0B' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Labour Entry
        </Typography>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary }
                    }
                  }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                },
                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                },
                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
              }}
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

// Complete Work Order Popup Component
const CompleteWorkOrderPopup = ({ open, onClose, workOrder, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    completed_qty: '',
    rejected_qty: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.completed_qty || formData.completed_qty <= 0) {
      setError('Completed quantity is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/complete`,
        {
          completed_qty: Number(formData.completed_qty),
          rejected_qty: Number(formData.rejected_qty) || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onComplete(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to complete work order');
      }
    } catch (err) {
      console.error('Error completing work order:', err);
      setError(err.response?.data?.message || 'Failed to complete work order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ completed_qty: '', rejected_qty: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CompleteWOIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Complete Work Order</Typography>
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
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Qty:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.planned_qty}</Typography>
              </Stack>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>COMPLETED QUANTITY <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth type="number" size="small" name="completed_qty" value={formData.completed_qty} onChange={handleChange} placeholder="e.g., 490" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>REJECTED QUANTITY</Typography>
            <TextField fullWidth type="number" size="small" name="rejected_qty" value={formData.rejected_qty} onChange={handleChange} placeholder="e.g., 10" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<CompleteWOIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#059669', fontSize: '0.7rem', '&:hover': { bgcolor: '#047857' } }}>
          {loading ? 'Processing...' : 'Complete Work Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Hold Work Order Popup Component
const HoldWorkOrderPopup = ({ open, onClose, workOrder, onHold }) => {
  const [holdReason, setHoldReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!holdReason.trim()) {
      setError('Hold reason is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/hold`, { hold_reason: holdReason }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        onHold(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to hold work order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to hold work order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHoldReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HoldIcon sx={{ color: '#D97706' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Hold Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography></Stack>
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>HOLD REASON <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth multiline rows={4} size="small" value={holdReason} onChange={(e) => setHoldReason(e.target.value)} placeholder="Please provide the reason for putting work order on hold..." error={!!error} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<HoldIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#D97706', fontSize: '0.7rem', '&:hover': { bgcolor: '#B45309' } }}>{loading ? 'Processing...' : 'Hold Work Order'}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Resume Work Order Popup Component
const ResumeWorkOrderPopup = ({ open, onClose, workOrder, onResume }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!resolutionNotes.trim()) { setError('Resolution notes are required'); return; }
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/resume`, { resolution_notes: resolutionNotes }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { onResume(response.data.data); handleClose(); } 
      else { setError(response.data.message || 'Failed to resume work order'); }
    } catch (err) { setError(err.response?.data?.message || 'Failed to resume work order'); } 
    finally { setLoading(false); }
  };

  const handleClose = () => { setResolutionNotes(''); setError(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ResumeIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Resume Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography></Stack>
              {workOrder?.hold_reason && <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Previous Hold Reason:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#DC2626', maxWidth: '60%', textAlign: 'right' }}>{workOrder?.hold_reason}</Typography></Stack>}
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>RESOLUTION NOTES <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth multiline rows={4} size="small" value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} placeholder="Please provide resolution notes explaining how the issue was resolved..." error={!!error} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<ResumeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#059669', fontSize: '0.7rem', '&:hover': { bgcolor: '#047857' } }}>{loading ? 'Processing...' : 'Resume Work Order'}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Cancel Work Order Popup Component
const CancelWorkOrderPopup = ({ open, onClose, workOrder, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!cancelReason.trim()) { setError('Cancel reason is required'); return; }
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/cancel`, { cancel_reason: cancelReason }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { onCancel(response.data.data); handleClose(); } 
      else { setError(response.data.message || 'Failed to cancel work order'); }
    } catch (err) { setError(err.response?.data?.message || 'Failed to cancel work order'); } 
    finally { setLoading(false); }
  };

  const handleClose = () => { setCancelReason(''); setError(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BlockIcon sx={{ color: '#DC2626' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Cancel Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography></Stack>
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>CANCEL REASON <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth multiline rows={4} size="small" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Please provide the reason for cancellation..." error={!!error} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<BlockIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#DC2626', fontSize: '0.7rem', '&:hover': { bgcolor: '#B91C1C' } }}>{loading ? 'Cancelling...' : 'Cancel Work Order'}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component (UPDATED)
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onRelease, onCancel, onHold, onStart, onResume, onCompleteOp, onCompleteWO, onLabour, onOperations }) => {
  const isPlanned = item?.status === 'Planned';
  const isReleased = item?.status === 'Released';
  const isOnHold = item?.status === 'On Hold';
  const isInProgress = item?.status === 'In Progress';
  
  const menuItem = (onClick, icon, label, color = COLORS.text.primary, disabled = false, tooltipMsg = '') => {
    const el = (
      <MenuItem onClick={() => { if (!disabled) { onClick(); onClose(); } }} sx={{ py: 1.5, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer', pointerEvents: disabled ? 'none' : 'auto' }}>
        <ListItemIcon sx={{ color, minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText><Typography variant="body2" fontWeight={500} sx={{ color, fontSize: '0.75rem' }}>{label}</Typography></ListItemText>
      </MenuItem>
    );
    return disabled && tooltipMsg ? <Tooltip key={label} title={tooltipMsg} placement="left">{el}</Tooltip> : <React.Fragment key={label}>{el}</React.Fragment>;
  };

  return (
    <>
      <Tooltip title="Actions"><IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}><MoreVertIcon fontSize="small" /></IconButton></Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 220, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' } }}>
        {menuItem(() => onView(item), <ViewIcon fontSize="small" />, 'View details')}
        {menuItem(() => onEdit(item), <EditIcon fontSize="small" />, 'Edit')}
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        {isPlanned && menuItem(() => onRelease(item), <RocketLaunchIcon fontSize="small" />, 'Release Work Order', '#059669')}
        {isPlanned && menuItem(() => onCancel(item), <BlockIcon fontSize="small" />, 'Cancel Work Order', '#DC2626')}
        
        {/* For Released status - Show Start and Operations buttons */}
        {isReleased && menuItem(() => onStart(item), <StartIcon fontSize="small" />, 'Start', '#059669')}
        {isReleased && menuItem(() => onOperations(item), <SettingsIcon fontSize="small" />, 'Operations', COLORS.primary)}
        
        {isOnHold && menuItem(() => onResume(item), <ResumeIcon fontSize="small" />, 'Resume Work Order', '#059669')}
        {isInProgress && menuItem(() => onHold(item), <HoldIcon fontSize="small" />, 'Hold Work Order', '#D97706')}
        {isInProgress && menuItem(() => onCompleteOp(item), <CompleteOpIcon fontSize="small" />, 'Complete Operation', '#8B5CF6')}
        {isInProgress && menuItem(() => onCompleteWO(item), <CompleteWOIcon fontSize="small" />, 'Complete Work Order', '#059669')}
        {isInProgress && menuItem(() => onLabour(item), <LabourIcon fontSize="small" />, 'Labour Entry', '#F59E0B')}
      </Menu>
    </>
  );
};

// Main Component
const WorkOrdersMaster = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedWorkOrderForMenu, setSelectedWorkOrderForMenu] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openHold, setOpenHold] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openResume, setOpenResume] = useState(false);
  const [openCompleteOp, setOpenCompleteOp] = useState(false);
  const [openCompleteWO, setOpenCompleteWO] = useState(false);
  const [openLabour, setOpenLabour] = useState(false);
  const [openOperations, setOpenOperations] = useState(false); // NEW state for operations popup

  useEffect(() => { const t = setTimeout(() => { setSearchTerm(searchInput); setPage(0); }, 500); return () => clearTimeout(t); }, [searchInput]);

  const fetchWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (searchTerm) params.append('search', searchTerm);
      const res = await axios.get(`${BASE_URL}/api/work-orders?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { setWorkOrders(res.data.data || []); setTotalItems(res.data.pagination?.total || 0); } 
      else { notify('Failed to load work orders', 'error'); }
    } catch (err) { notify('Failed to load work orders', 'error'); } 
    finally { setLoading(false); }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => { fetchWorkOrders(); }, [fetchWorkOrders]);

  const notify = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const openModal = (setter, workOrder = null) => { if (workOrder) setSelectedWorkOrder(workOrder); setter(true); setActionMenuAnchor(null); setSelectedWorkOrderForMenu(null); };
  const closeModal = (setter) => { setter(false); setSelectedWorkOrder(null); };
  const afterAction = (setter, message) => () => { closeModal(setter); fetchWorkOrders(); notify(message); };

  const handleRelease = async (workOrder) => {
    try { 
      const token = localStorage.getItem('token'); 
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/release`, {}, { headers: { Authorization: `Bearer ${token}` } }); 
      if (response.data.success) { 
        notify(`Work Order ${workOrder.wo_number} released successfully!`); 
        fetchWorkOrders(); 
      } else { 
        notify(response.data.message || 'Failed to release work order', 'error'); 
      } 
    } 
    catch (err) { 
      notify(err.response?.data?.message || 'Failed to release work order', 'error'); 
    }
  };

  // NEW: Start Work Order function (for Released status)
  const handleStart = async (workOrder) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        notify(`Work Order ${workOrder.wo_number} started successfully!`);
        fetchWorkOrders();
      } else {
        notify(response.data.message || 'Failed to start work order', 'error');
      }
    } catch (err) {
      console.error('Error starting work order:', err);
      notify(err.response?.data?.message || 'Failed to start work order', 'error');
    } finally {
      setLoading(false);
      setActionMenuAnchor(null);
      setSelectedWorkOrderForMenu(null);
    }
  };

  // NEW: Open Operations popup (for Released status)
  const handleOpenOperations = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setOpenOperations(true);
    setActionMenuAnchor(null);
    setSelectedWorkOrderForMenu(null);
  };

  // NEW: Handle operations added successfully
  const handleOperationsAdded = (updatedWorkOrder) => {
    notify(`Operations added to Work Order ${updatedWorkOrder.wo_number} successfully!`);
    fetchWorkOrders();
    setOpenOperations(false);
    setSelectedWorkOrder(null);
  };

  const handleCancel = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenCancel(true); };
  const handleCancelSubmit = async (cancelledWorkOrder) => { notify(`Work Order ${cancelledWorkOrder.wo_number} cancelled successfully!`); fetchWorkOrders(); setOpenCancel(false); setSelectedWorkOrder(null); };

  const handleHold = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenHold(true); };
  const handleHoldSubmit = async (heldWorkOrder) => { notify(`Work Order ${heldWorkOrder.wo_number} placed on hold successfully!`); fetchWorkOrders(); setOpenHold(false); setSelectedWorkOrder(null); };

  const handleResume = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenResume(true); };
  const handleResumeSubmit = async (resumedWorkOrder) => { notify(`Work Order ${resumedWorkOrder.wo_number} resumed successfully!`); fetchWorkOrders(); setOpenResume(false); setSelectedWorkOrder(null); };

  const handleCompleteOp = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenCompleteOp(true); };
  const handleCompleteOpSubmit = async (completedWorkOrder) => { notify(`Operation completed successfully!`); fetchWorkOrders(); setOpenCompleteOp(false); setSelectedWorkOrder(null); };

  const handleCompleteWO = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenCompleteWO(true); };
  const handleCompleteWOSubmit = async (completedWorkOrder) => { notify(`Work Order ${completedWorkOrder.wo_number} completed successfully!`); fetchWorkOrders(); setOpenCompleteWO(false); setSelectedWorkOrder(null); };

  const handleLabour = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenLabour(true); };
  const handleLabourSubmit = async (labourEntry) => { notify(`Labour entry added successfully!`); fetchWorkOrders(); setOpenLabour(false); setSelectedWorkOrder(null); };

  const handleSelectAll = (e) => setSelected(e.target.checked ? workOrders.map(wo => wo._id) : []);
  const handleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleChangePage = (_, newPage) => { setPage(newPage); setSelected([]); };
  const handleChangeRows = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); setSelected([]); };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon sx={{ fontSize: '0.875rem' }} />;
      case 'Cancelled': return <CancelIcon sx={{ fontSize: '0.875rem' }} />;
      case 'On Hold': return <HoldIcon sx={{ fontSize: '0.875rem' }} />;
      case 'In Progress': return <StartIcon sx={{ fontSize: '0.875rem' }} />;
      case 'Released': return <RocketLaunchIcon sx={{ fontSize: '0.875rem' }} />;
      default: return <AssignmentIcon sx={{ fontSize: '0.875rem' }} />;
    }
  };
  const getInitials = (wo) => wo.customer_name ? wo.customer_name.substring(0, 2).toUpperCase() : 'WO';
  const getAvatarColor = (wo) => { const colors = [COLORS.primary, '#074346', '#0D696C', '#128C7E', '#1A9C8F']; return colors[(wo.customer_name?.charCodeAt(0) || 0) % colors.length]; };

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>Work Orders Master</Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Manage production work orders, track progress, and monitor completion status</Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <TextField placeholder="Search by WO number, SO number, customer, part number..." size="small" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={loading} sx={{ width: { xs: '100%', sm: 450 }, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} /></InputAdornment>, sx: { height: 36, bgcolor: COLORS.background.light, '& input': { padding: '6px 12px', fontSize: '0.75rem' } } }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && <Button variant="outlined" color="error" startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem' }} disabled={loading}>Delete ({selected.length})</Button>}
            <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} onClick={() => setOpenAdd(true)} sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }} disabled={loading}>Add Work Order</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}><Checkbox indeterminate={selected.length > 0 && selected.length < workOrders.length} checked={workOrders.length > 0 && selected.length === workOrders.length} onChange={handleSelectAll} disabled={loading || workOrders.length === 0} sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }} /></TableCell>
                {['WO / Customer', 'Item Details', 'Qty', 'Dates', 'Priority', 'Status', 'Actions'].map(h => (<TableCell key={h} align={h === 'Actions' ? 'center' : 'left'} sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>{h}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress size={32} sx={{ color: COLORS.primary }} /><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading work orders...</Typography></TableCell></TableRow>)
              : workOrders.length === 0 ? (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><AssignmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} /><Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>{searchTerm ? 'No work orders found' : 'No work orders available'}</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>{searchTerm ? 'Try adjusting your search terms' : 'Add your first work order to get started'}</Typography></TableCell></TableRow>)
              : workOrders.map((wo) => {
                const isSelected = selected.includes(wo._id);
                const menuOpen = Boolean(actionMenuAnchor) && selectedWorkOrderForMenu?._id === wo._id;
                const statusColors = STATUS_COLORS[wo.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                const priorityColors = PRIORITY_COLORS[wo.priority] || { bg: '#F1F5F9', color: '#475569' };
                const completionPercent = wo.planned_qty > 0 ? (wo.completed_qty / wo.planned_qty) * 100 : 0;
                return (
                  <TableRow key={wo._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10`, '&:hover': { bgcolor: `${COLORS.primary}20` } }, '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border } }}>
                    <TableCell padding="checkbox"><Checkbox checked={isSelected} onChange={() => handleSelect(wo._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }} /></TableCell>
                    <TableCell><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(wo), fontSize: '0.7rem', fontWeight: 600 }}>{getInitials(wo)}</Avatar><Box><Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{wo.wo_number}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{wo.customer_name}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>SO: {wo.so_number}</Typography></Box></Stack></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{wo.part_no}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, maxWidth: 200 }}>{wo.part_name?.substring(0, 40)}{wo.part_name?.length > 40 ? '...' : ''}</Typography>{wo.drawing_no && <Chip label={`DRG: ${wo.drawing_no}${wo.drawing_revision ? ` Rev ${wo.drawing_revision}` : ''}`} size="small" sx={{ mt: 0.5, height: 18, fontSize: '0.55rem', bgcolor: COLORS.primaryLight, color: COLORS.primary }} />}</TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{wo.completed_qty.toLocaleString()} / {wo.planned_qty.toLocaleString()}</Typography><Box sx={{ width: 100, mt: 0.5, bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}><Box sx={{ width: `${completionPercent}%`, bgcolor: completionPercent === 100 ? '#059669' : COLORS.primary, height: 3, borderRadius: 1 }} /></Box><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>{Math.round(completionPercent)}% complete</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned: {formatDate(wo.planned_start)} - {formatDate(wo.planned_end)}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Required: {formatDate(wo.required_by)}</Typography></TableCell>
                    <TableCell><Chip label={wo.priority || 'Medium'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: priorityColors.bg, color: priorityColors.color }} /></TableCell>
                    <TableCell><Chip icon={getStatusIcon(wo.status)} label={wo.status || 'Planned'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: statusColors.bg, color: statusColors.color, border: `1px solid ${statusColors.border}` }} /></TableCell>
                    <TableCell align="center"><ActionMenu 
                      item={wo} 
                      anchorEl={menuOpen ? actionMenuAnchor : null} 
                      onOpen={(e) => { setActionMenuAnchor(e.currentTarget); setSelectedWorkOrderForMenu(wo); }} 
                      onClose={() => { setActionMenuAnchor(null); setSelectedWorkOrderForMenu(null); }} 
                      onView={(w) => openModal(setOpenView, w)} 
                      onEdit={(w) => openModal(setOpenEdit, w)} 
                      onRelease={(w) => handleRelease(w)} 
                      onCancel={(w) => handleCancel(w)} 
                      onHold={(w) => handleHold(w)} 
                      onStart={(w) => handleStart(w)}  // Updated: Now calls handleStart directly
                      onResume={(w) => handleResume(w)} 
                      onCompleteOp={(w) => handleCompleteOp(w)} 
                      onCompleteWO={(w) => handleCompleteWO(w)} 
                      onLabour={(w) => handleLabour(w)}
                      onOperations={(w) => handleOpenOperations(w)}  // NEW: Operations button handler
                    /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={totalItems} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRows} sx={{ borderTop: `1px solid ${COLORS.border}`, '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.7rem', color: COLORS.text.secondary }, '& .MuiTablePagination-select': { fontSize: '0.7rem' }, '& .MuiTablePagination-actions button': { color: COLORS.primary } }} />
      </Paper>

      <AddWorkOrder open={openAdd} onClose={() => setOpenAdd(false)} onAdd={afterAction(setOpenAdd, 'Work order created successfully!')} />
      {selectedWorkOrder && (<>
        <EditWorkOrder open={openEdit} onClose={() => closeModal(setOpenEdit)} workOrder={selectedWorkOrder} onUpdate={afterAction(setOpenEdit, 'Work order updated successfully!')} />
        <ViewWorkOrder open={openView} onClose={() => closeModal(setOpenView)} workOrder={selectedWorkOrder} onEdit={() => { setOpenView(false); setOpenEdit(true); }} />
        <CancelWorkOrderPopup open={openCancel} onClose={() => setOpenCancel(false)} workOrder={selectedWorkOrder} onCancel={handleCancelSubmit} />
        <HoldWorkOrderPopup open={openHold} onClose={() => setOpenHold(false)} workOrder={selectedWorkOrder} onHold={handleHoldSubmit} />
        <ResumeWorkOrderPopup open={openResume} onClose={() => setOpenResume(false)} workOrder={selectedWorkOrder} onResume={handleResumeSubmit} />
        <CompleteOperationPopup open={openCompleteOp} onClose={() => setOpenCompleteOp(false)} workOrder={selectedWorkOrder} onComplete={handleCompleteOpSubmit} />
        <CompleteWorkOrderPopup open={openCompleteWO} onClose={() => setOpenCompleteWO(false)} workOrder={selectedWorkOrder} onComplete={handleCompleteWOSubmit} />
        <LabourEntryPopup open={openLabour} onClose={() => setOpenLabour(false)} workOrder={selectedWorkOrder} onLabour={handleLabourSubmit} />
        <AddOperationsPopup open={openOperations} onClose={() => setOpenOperations(false)} workOrder={selectedWorkOrder} onOperationsAdded={handleOperationsAdded} />
      </>)}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
};

export default WorkOrdersMaster;