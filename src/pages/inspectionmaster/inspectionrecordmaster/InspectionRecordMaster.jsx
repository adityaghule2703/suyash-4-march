import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Snackbar,
  TablePagination,
  Checkbox,
  Stack,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Assignment as RecordIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Assessment as ResultsIcon,
  DoneAll as CompleteIcon,
  PlayArrow as BulkStartIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddInspectionRecord from './AddInspectionRecord';
import ViewInspectionRecord from './ViewInspectionRecord';
import DeleteInspectionRecord from './DeleteInspectionRecord';

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
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  resultStatus: {
    Accepted: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
    Pending: { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
    'Conditionally Accepted': { bg: '#F3E8FF', color: '#7E22CE', icon: <WarningIcon sx={{ fontSize: '0.7rem' }} /> },
    'Partially Completed': { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> }
  },
  inspectionType: {
    Incoming: { bg: '#E0F2FE', color: '#0369A1' },
    'First Article': { bg: '#F3E8FF', color: '#7E22CE' },
    'In-Process': { bg: '#FEF3C7', color: '#B45309' },
    Final: { bg: '#D1FAE5', color: '#065F46' },
    'Pre-Dispatch': { bg: '#FFE4E6', color: '#BE123C' },
    'Customer Audit': { bg: '#FCE7F3', color: '#BE185D' },
    Periodic: { bg: '#E0F2FE', color: '#0369A1' },
    'Concession Review': { bg: '#FEF3C7', color: '#B45309' }
  }
};

// Disposition options
const DISPOSITION_OPTIONS = [
  'Use As-Is',
  'Sort',
  'Rework',
  'Return to Vendor',
  'Scrap',
  'MRB Review',
  'Customer Concession'
];

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Bulk Start Dialog Component
const BulkStartDialog = ({ open, onClose, record, onSuccess }) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [availableSequences, setAvailableSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState('');

  // Fetch completed work orders
  const fetchWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/work-orders?limit=200`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        // Filter only completed work orders
        const completedWOs = response.data.data.filter(wo => wo.status === 'Completed');
        setWorkOrders(completedWOs);
      }
    } catch (err) {
      console.error('Error fetching work orders:', err);
      setError('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchWorkOrders();
    }
  }, [open, fetchWorkOrders]);

  // Update sequences when work order is selected
  const handleWorkOrderChange = (event, newValue) => {
    setSelectedWorkOrder(newValue);
    setSelectedSequence('');
    
    if (newValue && newValue.operations && newValue.operations.length > 0) {
      // Get unique operation sequences
      const sequences = newValue.operations
        .filter(op => op.op_sequence)
        .map(op => ({
          value: op.op_sequence,
          label: `Operation ${op.op_sequence} - ${op.operation_name || 'Unnamed'}`
        }));
      setAvailableSequences(sequences);
    } else {
      setAvailableSequences([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedWorkOrder) {
      setError('Please select a work order');
      return;
    }
    if (!selectedSequence) {
      setError('Please select an operation sequence');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/inspection-records/wo/${selectedWorkOrder._id}/operations/${selectedSequence}/bulk-start`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setSelectedWorkOrder(null);
        setSelectedSequence('');
        setAvailableSequences([]);
      } else {
        setError(response.data.message || 'Failed to start bulk inspection');
      }
    } catch (err) {
      console.error('Error starting bulk inspection:', err);
      setError(err.response?.data?.message || 'Failed to start bulk inspection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedWorkOrder(null);
    setSelectedSequence('');
    setAvailableSequences([]);
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
        mb: 2,
        bgcolor: COLORS.background.white
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BulkStartIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Bulk Start Inspection
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
            <BulkStartIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
            Select Work Order & Operation
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Work Order <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={workOrders}
                  getOptionLabel={(option) => `${option.wo_number} - ${option.part_name || option.part_no} (${option.status})`}
                  value={selectedWorkOrder}
                  onChange={handleWorkOrderChange}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search and select completed work order"
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
                  )}
                />
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Operation Sequence <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedSequence}
                    onChange={(e) => setSelectedSequence(e.target.value)}
                    displayEmpty
                    disabled={!selectedWorkOrder || availableSequences.length === 0}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 }
                    }}
                  >
                    <MenuItem value="" disabled>Select operation sequence</MenuItem>
                    {availableSequences.map(seq => (
                      <MenuItem key={seq.value} value={seq.value} sx={{ fontSize: '0.75rem' }}>
                        {seq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedWorkOrder && availableSequences.length === 0 && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    No operations found for this work order
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end'
      }}>
        <Button
          onClick={handleClose}
          disabled={submitting}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
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
          disabled={submitting || !selectedWorkOrder || !selectedSequence}
          startIcon={<BulkStartIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {submitting ? <CircularProgress size={16} /> : 'Start Bulk Inspection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Results Dialog Component - Redesigned
const ResultsDialog = ({ open, onClose, recordId, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkpointResults, setCheckpointResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Checkpoint Details', 'Measurements & Notes'];

  const addCheckpoint = () => {
    const newCheckpoint = {
      checkpoint_seq: checkpointResults.length + 1,
      characteristic: '',
      specification: '',
      nominal: '',
      usl: '',
      lsl: '',
      readings: ['', '', '', '', ''],
      inspector_note: ''
    };
    setCheckpointResults([...checkpointResults, newCheckpoint]);
    setActiveStep(0);
  };

  const removeCheckpoint = (index) => {
    const updated = checkpointResults.filter((_, i) => i !== index);
    updated.forEach((cp, idx) => {
      cp.checkpoint_seq = idx + 1;
    });
    setCheckpointResults(updated);
  };

  const handleCheckpointChange = (index, field, value) => {
    const updatedResults = [...checkpointResults];
    updatedResults[index][field] = value;
    setCheckpointResults(updatedResults);
  };

  const handleReadingChange = (checkpointIndex, readingIndex, value) => {
    const updatedResults = [...checkpointResults];
    updatedResults[checkpointIndex].readings[readingIndex] = value;
    setCheckpointResults(updatedResults);
  };

  const validateStep = (step, checkpointIndex) => {
    const cp = checkpointResults[checkpointIndex];
    
    if (step === 0) {
      if (!cp.characteristic || !cp.specification) {
        setError('Characteristic and Specification are required');
        return false;
      }
    }
    
    setError('');
    return true;
  };

  const handleNext = (checkpointIndex) => {
    if (validateStep(activeStep, checkpointIndex)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmitCheckpoint = async (checkpointIndex) => {
    const cp = checkpointResults[checkpointIndex];
    if (!cp.characteristic || !cp.specification) {
      setError('Characteristic and Specification are required');
      return;
    }

    if (checkpointIndex === checkpointResults.length - 1) {
      await handleSubmitAll();
    } else {
      setActiveStep(0);
      setTimeout(() => {
        const nextCheckpoint = document.getElementById(`checkpoint-${checkpointIndex + 1}`);
        if (nextCheckpoint) {
          nextCheckpoint.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSubmitAll = async () => {
    for (let i = 0; i < checkpointResults.length; i++) {
      const cp = checkpointResults[i];
      if (!cp.characteristic || !cp.specification) {
        setError(`Checkpoint ${cp.checkpoint_seq}: Characteristic and Specification are required`);
        return;
      }
    }

    if (checkpointResults.length === 0) {
      setError('Please add at least one checkpoint');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        checkpoint_results: checkpointResults.map(cp => ({
          checkpoint_seq: cp.checkpoint_seq,
          characteristic: cp.characteristic,
          specification: cp.specification,
          nominal: cp.nominal ? parseFloat(cp.nominal) : null,
          usl: cp.usl ? parseFloat(cp.usl) : null,
          lsl: cp.lsl ? parseFloat(cp.lsl) : null,
          readings: cp.readings.map(r => r === '' ? null : parseFloat(r)),
          inspector_note: cp.inspector_note || ''
        }))
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/inspection-records/${recordId}/results`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setCheckpointResults([]);
        setActiveStep(0);
        setError('');
      } else {
        setError(response.data.message || 'Failed to save results');
      }
    } catch (err) {
      console.error('Error saving results:', err);
      setError(err.response?.data?.message || 'Failed to save checkpoint results');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCheckpointResults([]);
    setActiveStep(0);
    setError('');
    onClose();
  };

  const renderCheckpointContent = (checkpoint, idx) => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Characteristic <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={checkpoint.characteristic}
                    onChange={(e) => handleCheckpointChange(idx, 'characteristic', e.target.value)}
                    placeholder="e.g., Length, Diameter, Hardness"
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
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Specification <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={checkpoint.specification}
                    onChange={(e) => handleCheckpointChange(idx, 'specification', e.target.value)}
                    placeholder="e.g., 100mm ± 0.5mm"
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
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Nominal Value
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={checkpoint.nominal}
                    onChange={(e) => handleCheckpointChange(idx, 'nominal', e.target.value)}
                    placeholder="Target value"
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
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Upper Limit (USL)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={checkpoint.usl}
                    onChange={(e) => handleCheckpointChange(idx, 'usl', e.target.value)}
                    placeholder="Maximum allowed"
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
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Lower Limit (LSL)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={checkpoint.lsl}
                    onChange={(e) => handleCheckpointChange(idx, 'lsl', e.target.value)}
                    placeholder="Minimum allowed"
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
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                Readings (5 readings)
              </Typography>
              <Grid container spacing={1}>
                {[0, 1, 2, 3, 4].map((rIdx) => (
                  <Grid size={{ xs: 2.4 }} key={rIdx}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label={`R${rIdx + 1}`}
                      value={checkpoint.readings[rIdx] || ''}
                      onChange={(e) => handleReadingChange(idx, rIdx, e.target.value)}
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
                        '& .MuiInputLabel-root': {
                          fontSize: '0.7rem'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                Inspector Note
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                value={checkpoint.inspector_note || ''}
                onChange={(e) => handleCheckpointChange(idx, 'inspector_note', e.target.value)}
                placeholder="Add any observations or notes about this checkpoint..."
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
          </Stack>
        );
      
      default:
        return null;
    }
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
        mb:2,
        bgcolor: COLORS.background.white
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Inspection Results
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={addCheckpoint}
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              borderColor: COLORS.primary,
              color: COLORS.primary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primaryDark,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Add Checkpoint
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {checkpointResults.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <ResultsIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
            <Typography sx={{ color: COLORS.text.secondary, fontSize: '0.875rem' }}>
              No checkpoints added. Click "Add Checkpoint" to start entering inspection results.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {checkpointResults.map((checkpoint, idx) => (
              <Paper 
                key={idx} 
                id={`checkpoint-${idx}`}
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${COLORS.border}`,
                  position: 'relative'
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  left: 16, 
                  bgcolor: COLORS.background.white,
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: COLORS.primary
                  }}>
                    Checkpoint {checkpoint.checkpoint_seq}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeCheckpoint(idx)}
                    sx={{ color: '#EF4444', p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                  </IconButton>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ px: 2, pt: 1, pb: 0 }}>
                    <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.secondary }}>
                              {label}
                            </Typography>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    {renderCheckpointContent(checkpoint, idx)}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      sx={{
                        height: 32,
                        px: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text.secondary,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: COLORS.primary,
                          bgcolor: `${COLORS.primary}10`
                        }
                      }}
                    >
                      Back
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => handleSubmitCheckpoint(idx)}
                        disabled={loading}
                        sx={{
                          height: 32,
                          px: 3,
                          borderRadius: 1.5,
                          bgcolor: COLORS.primary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': { bgcolor: COLORS.primaryDark }
                        }}
                      >
                        {idx === checkpointResults.length - 1 ? 'Save All Results' : 'Next Checkpoint'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleNext(idx)}
                        sx={{
                          height: 32,
                          px: 3,
                          borderRadius: 1.5,
                          bgcolor: COLORS.primary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': { bgcolor: COLORS.primaryDark }
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={handleClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Complete Dialog Component - Redesigned
const CompleteDialog = ({ open, onClose, recordId, onSuccess }) => {
  const [formData, setFormData] = useState({
    accepted_qty: '',
    rejected_qty: '',
    rework_qty: '',
    on_hold_qty: '',
    disposition: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.accepted_qty || !formData.rejected_qty) {
      setError('Accepted Quantity and Rejected Quantity are required');
      return;
    }

    if (!formData.disposition) {
      setError('Disposition is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const payload = {
        accepted_qty: parseInt(formData.accepted_qty),
        rejected_qty: parseInt(formData.rejected_qty),
        rework_qty: parseInt(formData.rework_qty) || 0,
        on_hold_qty: parseInt(formData.on_hold_qty) || 0,
        disposition: formData.disposition
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/inspection-records/${recordId}/complete`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setFormData({
          accepted_qty: '',
          rejected_qty: '',
          rework_qty: '',
          on_hold_qty: '',
          disposition: ''
        });
      } else {
        setError(response.data.message || 'Failed to complete inspection');
      }
    } catch (err) {
      console.error('Error completing inspection:', err);
      setError(err.response?.data?.message || 'Failed to complete inspection');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      accepted_qty: '',
      rejected_qty: '',
      rework_qty: '',
      on_hold_qty: '',
      disposition: ''
    });
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
        mb: 2,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Complete Inspection
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
            <CompleteIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
            Final Disposition
          </Typography>
          
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Accepted Quantity <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={formData.accepted_qty}
                  onChange={(e) => handleChange('accepted_qty', e.target.value)}
                  placeholder="0"
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
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Rejected Quantity <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={formData.rejected_qty}
                  onChange={(e) => handleChange('rejected_qty', e.target.value)}
                  placeholder="0"
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
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Rework Quantity
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={formData.rework_qty}
                  onChange={(e) => handleChange('rework_qty', e.target.value)}
                  placeholder="0"
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
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  On Hold Quantity
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  value={formData.on_hold_qty}
                  onChange={(e) => handleChange('on_hold_qty', e.target.value)}
                  placeholder="0"
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
                  Disposition <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.disposition}
                    onChange={(e) => handleChange('disposition', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 }
                    }}
                  >
                    <MenuItem value="" disabled>Select disposition</MenuItem>
                    {DISPOSITION_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end'
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
          sx={{
            height: 32,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? <CircularProgress size={16} /> : 'Complete Inspection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component
const ActionMenu = ({ record, onView, onResults, onComplete, onBulkStart, anchorEl, onClose, onOpen }) => {
  const showResults = record.overall_result === 'Pending';
  const showComplete = record.overall_result === 'Partially Completed';
  const showBulkStart = record.inspection_type === 'First Article' && record.overall_result === 'Accepted';

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}20`
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(record);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {showBulkStart && (
          <MenuItem 
            onClick={() => {
              onBulkStart(record);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <BulkStartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Bulk Start
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showResults && (
          <MenuItem 
            onClick={() => {
              onResults(record);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <ResultsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Results
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showComplete && (
          <MenuItem 
            onClick={() => {
              onComplete(record);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <CompleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Complete
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// Result Status Chip Component
const ResultStatusChip = ({ status }) => {
  const colors = COLORS.resultStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
  return (
    <Chip
      icon={colors.icon}
      label={status}
      size="small"
      sx={{
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 24,
        bgcolor: colors.bg,
        color: colors.color,
        '& .MuiChip-icon': {
          color: colors.color,
          fontSize: '0.7rem'
        }
      }}
    />
  );
};

// Inspection Type Chip Component
const InspectionTypeChip = ({ type }) => {
  const colors = COLORS.inspectionType[type] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 24,
        bgcolor: colors.bg,
        color: colors.color
      }}
    />
  );
};

const InspectionRecordMaster = () => {
  // State for data
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [openBulkStartDialog, setOpenBulkStartDialog] = useState(false);
  
  // Selected record
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Ref to track if we're currently searching
  const isSearchingRef = useRef(false);
  const searchTimeoutRef = useRef(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isSearchingRef.current = true;
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
      setPage(0);
      setSelected([]);
      isSearchingRef.current = false;
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
    setPage(0);
    setSelected([]);
    isSearchingRef.current = false;
  };

  // Fetch inspection records from API with server-side pagination and search
  const fetchRecords = useCallback(async () => {
    // Don't show loading indicator while typing search
    if (!isSearchingRef.current) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        limit: rowsPerPage
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get(`${BASE_URL}/api/inspection-records/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      if (response.data.success) {
        setRecords(response.data.data || []);
        setTotalCount(response.data.total || response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load inspection records', 'error');
        setRecords([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching inspection records:', err);
      showNotification(err.response?.data?.message || 'Failed to load inspection records', 'error');
      setRecords([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  // Load data when dependencies change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle refresh
  const handleRefresh = () => {
    fetchRecords();
    showNotification('Data refreshed', 'success');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(records.map(record => record._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };

  const handleActionMenuOpen = (event, record) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRecordForAction(record);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRecordForAction(null);
  };

  const openViewModalHandler = (record) => {
    setSelectedRecord(record);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openResultsDialogHandler = (record) => {
    setSelectedRecord(record);
    setOpenResultsDialog(true);
    handleActionMenuClose();
  };

  const openCompleteDialogHandler = (record) => {
    setSelectedRecord(record);
    setOpenCompleteDialog(true);
    handleActionMenuClose();
  };

  const openBulkStartDialogHandler = (record) => {
    setSelectedRecord(record);
    setOpenBulkStartDialog(true);
    handleActionMenuClose();
  };

  const handleAddSuccess = () => {
    setOpenAddModal(false);
    fetchRecords();
    showNotification('Inspection record created successfully!', 'success');
  };

  const handleResultsSuccess = () => {
    setOpenResultsDialog(false);
    setSelectedRecord(null);
    fetchRecords();
    showNotification('Inspection results saved successfully!', 'success');
  };

  const handleCompleteSuccess = () => {
    setOpenCompleteDialog(false);
    setSelectedRecord(null);
    fetchRecords();
    showNotification('Inspection completed successfully!', 'success');
  };

  const handleBulkStartSuccess = () => {
    setOpenBulkStartDialog(false);
    setSelectedRecord(null);
    fetchRecords();
    showNotification('Bulk inspection started successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/inspection-records/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (records.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchRecords();
      }
      
      showNotification(`${selected.length} record(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete some records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Inspection Record Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage inspection records, track quality results, and monitor inspection history
        </Typography>
      </Box>

      {/* Filter and Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by inspection ID, part no..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
              sx={{ 
                width: { xs: '100%', sm: 320 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': {
                    borderColor: '#fecaca',
                    bgcolor: '#fee2e2'
                  }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                height: 36,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }}
              disabled={loading}
            >
              Add Record
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Inspection Records Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < records.length}
                    checked={records.length > 0 && selected.length === records.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': {
                        color: COLORS.text.light,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: COLORS.text.light,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                      }
                    }}
                    disabled={loading || records.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Inspection ID
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Inspection Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Part No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Lot Size
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Result
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Inspector
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  width: 60,
                  color: COLORS.text.light
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading inspection records...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <RecordIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No inspection records found' : 'No inspection records available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first inspection record'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => {
                  const isSelected = selected.includes(record._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedRecordForAction?._id === record._id;

                  return (
                    <TableRow
                      key={record._id || index}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': {
                            bgcolor: `${COLORS.primary}20`
                          }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(record._id)}
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': {
                              color: COLORS.primary,
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: '1.25rem'
                            }
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            <RecordIcon sx={{ fontSize: '0.8rem' }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {record.inspection_id || record.inspection_number}
                          </Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(record.inspection_date)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <InspectionTypeChip type={record.inspection_type} />
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {record.items?.[0]?.part_no || record.part_no || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {record.lot_size || record.items?.[0]?.received_qty || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <ResultStatusChip status={record.overall_result || 'Pending'} />
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {record.created_by?.FirstName || record.created_by || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          record={record}
                          onView={openViewModalHandler}
                          onResults={openResultsDialogHandler}
                          onComplete={openCompleteDialogHandler}
                          onBulkStart={openBulkStartDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, record)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.primary,
            }
          }}
        />
      </Paper>

      {/* Modal Components */}
      <AddInspectionRecord 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedRecord && (
        <>
          <ViewInspectionRecord 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedRecord(null);
            }}
            record={selectedRecord}
          />

          <ResultsDialog
            open={openResultsDialog}
            onClose={() => {
              setOpenResultsDialog(false);
              setSelectedRecord(null);
            }}
            recordId={selectedRecord._id}
            onSuccess={handleResultsSuccess}
          />

          <CompleteDialog
            open={openCompleteDialog}
            onClose={() => {
              setOpenCompleteDialog(false);
              setSelectedRecord(null);
            }}
            recordId={selectedRecord._id}
            onSuccess={handleCompleteSuccess}
          />

          <BulkStartDialog
            open={openBulkStartDialog}
            onClose={() => {
              setOpenBulkStartDialog(false);
              setSelectedRecord(null);
            }}
            record={selectedRecord}
            onSuccess={handleBulkStartSuccess}
          />
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InspectionRecordMaster;