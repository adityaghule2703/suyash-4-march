import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Route as RouteIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  }
};

const ROUTING_TYPE_OPTIONS = [
  'Stamping',
  'Busbar',
  'Gasket',
  'Assembly',
  'Toolroom',
  'General'
];

const steps = ['Basic Information', 'Operations', 'Review & Submit'];

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

const EditRouting = ({ open, onClose, routing, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [processes, setProcesses] = useState([]);
  const [machines, setMachines] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [originalOperations, setOriginalOperations] = useState([]);

  const [formData, setFormData] = useState({
    routing_name: '',
    routing_type: '',
    is_active: true,
    version: '1.0',
    operations: []
  });

  const [currentOperation, setCurrentOperation] = useState({
    op_sequence: '',
    operation_id: '',
    operation_name: '',
    work_centre: '',
    machine_id: '',
    is_subcontract: false,
    subcontract_vendor: '',
    planned_setup_min: '',
    planned_run_min: '',
    scrap_pct: '',
    description: ''
  });

  const [editingOperationIndex, setEditingOperationIndex] = useState(null);

  useEffect(() => {
    if (open) {
      fetchProcesses();
      fetchMachines();
      if (routing) {
        initializeFormData(routing);
      }
    }
  }, [open, routing]);

  const initializeFormData = (data) => {
    // Extract operations with proper ID handling
    const operations = (data.operations || []).map(op => ({
      op_sequence: op.op_sequence,
      operation_id: typeof op.operation_id === 'object' ? op.operation_id._id : op.operation_id,
      operation_name: typeof op.operation_id === 'object' ? op.operation_id.process_name : op.operation_name,
      work_centre: op.work_centre || '',
      machine_id: op.machine_id || '',
      is_subcontract: op.is_subcontract || false,
      subcontract_vendor: op.subcontract_vendor || '',
      planned_setup_min: op.planned_setup_min || 0,
      planned_run_min: op.planned_run_min || 0,
      scrap_pct: op.scrap_pct || 0,
      description: op.description || ''
    }));

    setOriginalOperations(operations);
    setFormData({
      routing_name: data.routing_name || '',
      routing_type: data.routing_type || '',
      is_active: data.is_active !== undefined ? data.is_active : true,
      version: data.version || '1.0',
      operations: operations
    });
  };

  const fetchProcesses = async () => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/processes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setProcesses(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching processes:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines?page=1&limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMachines(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleOperationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentOperation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProcessSelect = (processId) => {
    const selectedProcess = processes.find(p => p._id === processId);
    if (selectedProcess) {
      setCurrentOperation(prev => ({
        ...prev,
        operation_id: selectedProcess._id,
        operation_name: selectedProcess.process_name,
        work_centre: selectedProcess.work_centre || ''
      }));
    }
  };

  const addOrUpdateOperation = () => {
    if (!currentOperation.operation_id) {
      setError('Please select a process');
      return;
    }
    if (!currentOperation.op_sequence) {
      setError('Operation sequence is required');
      return;
    }
    if (!currentOperation.planned_setup_min) {
      setError('Planned setup time is required');
      return;
    }
    if (!currentOperation.planned_run_min) {
      setError('Planned run time is required');
      return;
    }

    const newOperation = {
      op_sequence: Number(currentOperation.op_sequence),
      operation_id: currentOperation.operation_id,
      operation_name: currentOperation.operation_name,
      work_centre: currentOperation.work_centre || '',
      machine_id: currentOperation.machine_id || '',
      is_subcontract: currentOperation.is_subcontract || false,
      subcontract_vendor: currentOperation.subcontract_vendor || '',
      planned_setup_min: Number(currentOperation.planned_setup_min),
      planned_run_min: Number(currentOperation.planned_run_min),
      scrap_pct: Number(currentOperation.scrap_pct) || 0,
      description: currentOperation.description || ''
    };

    // Check for duplicate sequence (excluding current editing index)
    const duplicateIndex = formData.operations.findIndex((op, idx) => 
      op.op_sequence === newOperation.op_sequence && idx !== editingOperationIndex
    );
    
    if (duplicateIndex !== -1) {
      setError(`Operation sequence ${newOperation.op_sequence} already exists`);
      return;
    }

    let updatedOperations;
    if (editingOperationIndex !== null) {
      // Update existing operation
      updatedOperations = [...formData.operations];
      updatedOperations[editingOperationIndex] = newOperation;
    } else {
      // Add new operation
      updatedOperations = [...formData.operations, newOperation];
    }

    setFormData(prev => ({
      ...prev,
      operations: updatedOperations.sort((a, b) => a.op_sequence - b.op_sequence)
    }));

    // Reset current operation
    setCurrentOperation({
      op_sequence: '',
      operation_id: '',
      operation_name: '',
      work_centre: '',
      machine_id: '',
      is_subcontract: false,
      subcontract_vendor: '',
      planned_setup_min: '',
      planned_run_min: '',
      scrap_pct: '',
      description: ''
    });
    setEditingOperationIndex(null);
    setError('');
  };

  const editOperation = (index) => {
    const op = formData.operations[index];
    setCurrentOperation({
      op_sequence: op.op_sequence,
      operation_id: op.operation_id,
      operation_name: op.operation_name,
      work_centre: op.work_centre || '',
      machine_id: op.machine_id || '',
      is_subcontract: op.is_subcontract || false,
      subcontract_vendor: op.subcontract_vendor || '',
      planned_setup_min: op.planned_setup_min,
      planned_run_min: op.planned_run_min,
      scrap_pct: op.scrap_pct,
      description: op.description || ''
    });
    setEditingOperationIndex(index);
  };

  const removeOperation = (index) => {
    setFormData(prev => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index)
    }));
    if (editingOperationIndex === index) {
      setCurrentOperation({
        op_sequence: '',
        operation_id: '',
        operation_name: '',
        work_centre: '',
        machine_id: '',
        is_subcontract: false,
        subcontract_vendor: '',
        planned_setup_min: '',
        planned_run_min: '',
        scrap_pct: '',
        description: ''
      });
      setEditingOperationIndex(null);
    }
  };

  const cancelEdit = () => {
    setCurrentOperation({
      op_sequence: '',
      operation_id: '',
      operation_name: '',
      work_centre: '',
      machine_id: '',
      is_subcontract: false,
      subcontract_vendor: '',
      planned_setup_min: '',
      planned_run_min: '',
      scrap_pct: '',
      description: ''
    });
    setEditingOperationIndex(null);
    setError('');
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.routing_name.trim()) {
          errors.routing_name = 'Routing name is required';
          isValid = false;
        }
        if (!formData.routing_type) {
          errors.routing_type = 'Routing type is required';
          isValid = false;
        }
        break;

      case 1:
        if (formData.operations.length === 0) {
          errors.operations = 'At least one operation is required';
          isValid = false;
        }
        break;

      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const submitData = {
        routing_name: formData.routing_name,
        routing_type: formData.routing_type,
        is_active: formData.is_active
      };

      const response = await axios.put(`${BASE_URL}/api/routings/${routing._id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        handleClose();
      } else {
        setError(response.data.message || 'Failed to update routing');
      }
    } catch (err) {
      console.error('Error updating routing:', err);
      setError(err.response?.data?.message || 'Failed to update routing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      routing_name: '',
      routing_type: '',
      is_active: true,
      version: '1.0',
      operations: []
    });
    setCurrentOperation({
      op_sequence: '',
      operation_id: '',
      operation_name: '',
      work_centre: '',
      machine_id: '',
      is_subcontract: false,
      subcontract_vendor: '',
      planned_setup_min: '',
      planned_run_min: '',
      scrap_pct: '',
      description: ''
    });
    setEditingOperationIndex(null);
    setOriginalOperations([]);
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <RouteIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      ROUTING NAME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="routing_name"
                      value={formData.routing_name}
                      onChange={handleChange}
                      placeholder="e.g., Copper Busbar Standard Route"
                      error={!!fieldErrors.routing_name}
                      helperText={fieldErrors.routing_name}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      ROUTING TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.routing_type}>
                      <Select
                        name="routing_type"
                        value={formData.routing_type}
                        onChange={handleChange}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        <MenuItem value="" disabled>Select routing type</MenuItem>
                        {ROUTING_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      VERSION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="version"
                      value={formData.version}
                      onChange={handleChange}
                      disabled
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      STATUS
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleSwitchChange}
                          size="small"
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
                      label={
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {formData.is_active ? 'Active' : 'Inactive'}
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        const totalSetupTime = formData.operations.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0);
        const totalRunTime = formData.operations.reduce((sum, op) => sum + (op.planned_run_min || 0), 0);

        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Operations
              </Typography>

              {/* Add/Edit Operation Form */}
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SEQUENCE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="op_sequence"
                      value={currentOperation.op_sequence}
                      onChange={handleOperationChange}
                      placeholder="10, 20, 30..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PROCESS <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={currentOperation.operation_id}
                        onChange={(e) => handleProcessSelect(e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        <MenuItem value="" disabled>Select process</MenuItem>
                        {processes.map((process) => (
                          <MenuItem key={process._id} value={process._id} sx={{ fontSize: '0.75rem' }}>
                            {process.process_name} ({process.process_id})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      WORK CENTRE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="work_centre"
                      value={currentOperation.work_centre}
                      onChange={handleOperationChange}
                      placeholder="Auto-filled from process"
                      disabled
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      MACHINE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={currentOperation.machine_id}
                        onChange={handleOperationChange}
                        name="machine_id"
                        displayEmpty
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        <MenuItem value="" disabled>Select machine (optional)</MenuItem>
                        {machines.map((machine) => (
                          <MenuItem key={machine._id} value={machine._id} sx={{ fontSize: '0.75rem' }}>
                            {machine.machine_name} ({machine.machine_code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SETUP TIME (min) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="planned_setup_min"
                      value={currentOperation.planned_setup_min}
                      onChange={handleOperationChange}
                      placeholder="e.g., 15"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      RUN TIME (min/unit) <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="planned_run_min"
                      value={currentOperation.planned_run_min}
                      onChange={handleOperationChange}
                      placeholder="e.g., 2.5"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SCRAP %
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="scrap_pct"
                      value={currentOperation.scrap_pct}
                      onChange={handleOperationChange}
                      placeholder="0"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 9 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      DESCRIPTION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="description"
                      value={currentOperation.description}
                      onChange={handleOperationChange}
                      placeholder="Operation description"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <input
                          type="checkbox"
                          name="is_subcontract"
                          checked={currentOperation.is_subcontract}
                          onChange={handleOperationChange}
                          style={{ margin: 0 }}
                        />
                        <Typography sx={{ fontSize: '0.7rem' }}>Is Subcontract</Typography>
                      </Box>
                    </FormControl>
                    {currentOperation.is_subcontract && (
                      <TextField
                        size="small"
                        name="subcontract_vendor"
                        value={currentOperation.subcontract_vendor}
                        onChange={handleOperationChange}
                        placeholder="Vendor Name"
                        sx={{ width: 200, '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
                    )}
                    <Button
                      variant="contained"
                      onClick={addOrUpdateOperation}
                      startIcon={editingOperationIndex !== null ? <EditIcon sx={{ fontSize: '1rem' }} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
                      sx={{ height: 36, px: 2, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      {editingOperationIndex !== null ? 'Update Operation' : 'Add Operation'}
                    </Button>
                    {editingOperationIndex !== null && (
                      <Button
                        variant="outlined"
                        onClick={cancelEdit}
                        sx={{ height: 36, px: 2, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Operations Table */}
              {formData.operations.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Seq</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Operation</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Work Centre</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Machine</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Setup (min)</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Run (min)</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Scrap %</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 80 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.operations.map((op, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{op.op_sequence}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{op.operation_name}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{op.work_centre || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>
                            {machines.find(m => m._id === op.machine_id)?.machine_name || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_setup_min}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_run_min}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{op.scrap_pct}%</TableCell>
                          <TableCell>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => editOperation(index)} sx={{ color: COLORS.primary }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => removeOperation(index)} sx={{ color: COLORS.error }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {formData.operations.length > 0 && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                    Operations Summary
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Setup Time</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{totalSetupTime} min</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Total Run Time</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{totalRunTime} min/unit</Typography>
                    </Box>
                  </Stack>
                </Box>
              )}

              {fieldErrors.operations && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                  {fieldErrors.operations}
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        const totalSetup = formData.operations.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0);
        const totalRun = formData.operations.reduce((sum, op) => sum + (op.planned_run_min || 0), 0);

        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review & Submit
              </Typography>

              <Stack spacing={2}>
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Name:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.routing_name}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Type:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.routing_type}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.version}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Chip
                        label={formData.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          fontSize: '0.6rem',
                          height: 20,
                          bgcolor: formData.is_active ? '#D1FAE5' : '#FEE2E2',
                          color: formData.is_active ? '#059669' : '#DC2626'
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Operations Summary
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Operations:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#059669' }}>
                        {formData.operations.length}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{totalSetup} min</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{totalRun} min/unit</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {formData.operations.length > 0 && (
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                      Operation Details
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Seq</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Operation</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Setup</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Run</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.operations.map((op, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{op.op_sequence}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{op.operation_name}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_setup_min} min</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_run_min} min</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
              </Stack>
            </Paper>
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
          borderRadius: 2,
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
          Edit Routing
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="small"
              startIcon={<SaveIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Updating...' : 'Update Routing'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditRouting;