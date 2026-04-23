// AddOperations.jsx
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
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
  Box,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Bolt as BoltIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
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

const AddOperationsPopup = ({ open, onClose, workOrder, onOperationsAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [routings, setRoutings] = useState([]);
  const [machines, setMachines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingRoutings, setLoadingRoutings] = useState(false);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [selectedRouting, setSelectedRouting] = useState(null);
  const [availableOperations, setAvailableOperations] = useState([]);
  
  const [operations, setOperations] = useState([
    {
      op_sequence: 10,
      operation_id: '',
      operation_name: '',
      work_centre: '',
      machine_id: '',
      employee_id: '',
      required_skill: '',
      planned_setup_min: '',
      planned_run_min: '',
      planned_qty: '',
      is_subcontract: false,
      subcontract_vendor: '',
      planned_start: '',
      requires_torque_recording: false,
      requires_functional_test: false,
      expected_joints: []
    }
  ]);

  useEffect(() => {
    if (open) {
      fetchRoutings();
      fetchMachines();
      fetchEmployees();
      fetchVendors();
    }
  }, [open]);

  const fetchRoutings = async () => {
    try {
      setLoadingRoutings(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/routings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRoutings(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching routings:', err);
    } finally {
      setLoadingRoutings(false);
    }
  };

  const fetchMachines = async () => {
    try {
      setLoadingMachines(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMachines(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
    } finally {
      setLoadingMachines(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleRoutingChange = (routing) => {
    setSelectedRouting(routing);
    if (routing && routing.operations) {
      const ops = routing.operations.map(op => ({
        _id: op.operation_id?._id || op.operation_id,
        op_sequence: op.op_sequence,
        operation_name: op.operation_name,
        operation_id: op.operation_id?._id || op.operation_id,
        work_centre: op.work_centre,
        machine_id: op.machine_id?._id || op.machine_id,
        planned_setup_min: op.planned_setup_min,
        planned_run_min: op.planned_run_min,
        is_subcontract: op.is_subcontract,
        subcontract_vendor: op.subcontract_vendor,
        requires_torque_recording: op.requires_torque_recording || false,
        requires_functional_test: op.requires_functional_test || false,
        expected_joints: op.expected_joints || []
      }));
      setAvailableOperations(ops);
      
      if (ops.length > 0) {
        setOperations([{
          op_sequence: ops[0].op_sequence || 10,
          operation_id: ops[0]._id || '',
          operation_name: ops[0].operation_name || '',
          work_centre: ops[0].work_centre || '',
          machine_id: ops[0].machine_id || '',
          employee_id: '',
          required_skill: '',
          planned_setup_min: ops[0].planned_setup_min || '',
          planned_run_min: ops[0].planned_run_min || '',
          planned_qty: '',
          is_subcontract: ops[0].is_subcontract || false,
          subcontract_vendor: ops[0].subcontract_vendor || '',
          planned_start: '',
          requires_torque_recording: ops[0].requires_torque_recording || false,
          requires_functional_test: ops[0].requires_functional_test || false,
          expected_joints: ops[0].expected_joints || []
        }]);
      }
    } else {
      setAvailableOperations([]);
      setOperations([{
        op_sequence: 10,
        operation_id: '',
        operation_name: '',
        work_centre: '',
        machine_id: '',
        employee_id: '',
        required_skill: '',
        planned_setup_min: '',
        planned_run_min: '',
        planned_qty: '',
        is_subcontract: false,
        subcontract_vendor: '',
        planned_start: '',
        requires_torque_recording: false,
        requires_functional_test: false,
        expected_joints: []
      }]);
    }
  };

  const handleOperationChange = (index, field, value) => {
    const updatedOps = [...operations];
    updatedOps[index][field] = value;
    
    if (field === 'operation_id' && selectedRouting) {
      const selectedOp = availableOperations.find(op => op._id === value);
      if (selectedOp) {
        updatedOps[index].operation_name = selectedOp.operation_name || '';
        updatedOps[index].work_centre = selectedOp.work_centre || '';
        updatedOps[index].machine_id = selectedOp.machine_id || '';
        updatedOps[index].planned_setup_min = selectedOp.planned_setup_min || '';
        updatedOps[index].planned_run_min = selectedOp.planned_run_min || '';
        updatedOps[index].is_subcontract = selectedOp.is_subcontract || false;
        updatedOps[index].subcontract_vendor = selectedOp.subcontract_vendor || '';
        updatedOps[index].requires_torque_recording = selectedOp.requires_torque_recording || false;
        updatedOps[index].requires_functional_test = selectedOp.requires_functional_test || false;
        updatedOps[index].expected_joints = selectedOp.expected_joints || [];
      }
    }
    
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
        operation_id: '',
        operation_name: '',
        work_centre: '',
        machine_id: '',
        employee_id: '',
        required_skill: '',
        planned_setup_min: '',
        planned_run_min: '',
        planned_qty: '',
        is_subcontract: false,
        subcontract_vendor: '',
        planned_start: '',
        requires_torque_recording: false,
        requires_functional_test: false,
        expected_joints: []
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
    if (!selectedRouting) {
      setError('Please select a routing');
      return;
    }

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      if (!op.operation_id) {
        setError(`Operation ${i + 1}: Please select an operation`);
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
      
      const operationsData = operations.map(op => ({
        op_sequence: Number(op.op_sequence),
        operation_id: op.operation_id,
        work_centre: op.work_centre,
        machine_id: op.machine_id || undefined,
        employee_id: op.employee_id || undefined,
        required_skill: op.required_skill || undefined,
        planned_setup_min: Number(op.planned_setup_min) || 0,
        planned_run_min: Number(op.planned_run_min) || 0,
        planned_qty: Number(op.planned_qty) || 0,
        is_subcontract: op.is_subcontract || false,
        subcontract_vendor: op.is_subcontract ? op.subcontract_vendor : undefined,
        planned_start: op.planned_start || undefined,
        requires_torque_recording: op.requires_torque_recording || false,
        requires_functional_test: op.requires_functional_test || false,
        expected_joints: op.expected_joints || []
      }));

      const requestBody = {
        routing_id: selectedRouting._id,
        operations: operationsData
      };

      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/add`,
        requestBody,
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
    setSelectedRouting(null);
    setAvailableOperations([]);
    setOperations([
      {
        op_sequence: 10,
        operation_id: '',
        operation_name: '',
        work_centre: '',
        machine_id: '',
        employee_id: '',
        required_skill: '',
        planned_setup_min: '',
        planned_run_min: '',
        planned_qty: '',
        is_subcontract: false,
        subcontract_vendor: '',
        planned_start: '',
        requires_torque_recording: false,
        requires_functional_test: false,
        expected_joints: []
      }
    ]);
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

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add Operations
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
          onClick={addOperation}
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
          Add Operation
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2.5}>
          {/* Work Order Info Card */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.primaryLight, 
            borderRadius: 2, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: COLORS.primary, 
              mb: 1.5 
            }}>
              Work Order Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>{workOrder?.wo_number}</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>{workOrder?.part_no}</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>{workOrder?.customer_name}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Routing Selection */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.white, 
            borderRadius: 2, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: COLORS.primary, 
              mb: 1.5 
            }}>
              Select Routing <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <Autocomplete
              fullWidth
              options={routings}
              getOptionLabel={(option) => `${option.routing_id} - ${option.routing_name} (${option.routing_type || 'N/A'})`}
              value={selectedRouting}
              onChange={(event, newValue) => handleRoutingChange(newValue)}
              loading={loadingRoutings}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select routing"
                  error={!!error && !selectedRouting}
                  sx={inputStyle}
                />
              )}
            />
          </Paper>

          {/* Operations List */}
          {selectedRouting && (
            <>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mt: 1 
              }}>
                Operations
              </Typography>

              {operations.map((op, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    bgcolor: COLORS.background.white,
                    boxShadow: 'none',
                    position: 'relative'
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      Operation {index + 1}
                    </Typography>
                    {operations.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeOperation(index)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  <Grid container spacing={1.5}>
                    {/* Row 1: Op Sequence and Operation */}
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>
                          OP SEQUENCE <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.op_sequence}
                          onChange={(e) => handleOperationChange(index, 'op_sequence', e.target.value)}
                          placeholder="e.g., 10"
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 9 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>
                          OPERATION <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={availableOperations}
                          getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name}${option.requires_torque_recording ? ' 🔩' : ''}${option.requires_functional_test ? ' 🧪' : ''}`}
                          value={availableOperations.find(o => o._id === op.operation_id) || null}
                          onChange={(event, newValue) => {
                            handleOperationChange(index, 'operation_id', newValue?._id || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select operation"
                              sx={inputStyle}
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Row 2: Work Centre and Required Skill */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>WORK CENTRE</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={op.work_centre}
                          onChange={(e) => handleOperationChange(index, 'work_centre', e.target.value)}
                          placeholder="Work centre"
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>REQUIRED SKILL</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={op.required_skill}
                          onChange={(e) => handleOperationChange(index, 'required_skill', e.target.value)}
                          placeholder="e.g., PRESS-OPS"
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>

                    {/* Row 3: Machine and Employee */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>MACHINE</Typography>
                        <Autocomplete
                          fullWidth
                          options={machines}
                          getOptionLabel={(option) => `${option.machine_code} - ${option.machine_name}`}
                          value={machines.find(m => m._id === op.machine_id) || null}
                          onChange={(event, newValue) => {
                            handleOperationChange(index, 'machine_id', newValue?._id || '');
                          }}
                          loading={loadingMachines}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select machine"
                              sx={inputStyle}
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>EMPLOYEE</Typography>
                        <Autocomplete
                          fullWidth
                          options={employees}
                          getOptionLabel={(option) => `${option.EmployeeID} - ${option.FirstName} ${option.LastName || ''}`}
                          value={employees.find(e => e._id === op.employee_id) || null}
                          onChange={(event, newValue) => {
                            handleOperationChange(index, 'employee_id', newValue?._id || '');
                          }}
                          loading={loadingEmployees}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select employee"
                              sx={inputStyle}
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Row 4: Planned Times */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>PLANNED SETUP (min)</Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.planned_setup_min}
                          onChange={(e) => handleOperationChange(index, 'planned_setup_min', e.target.value)}
                          placeholder="e.g., 15"
                          inputProps={{ min: 0, step: 0.5 }}
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>PLANNED RUN (min)</Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.planned_run_min}
                          onChange={(e) => handleOperationChange(index, 'planned_run_min', e.target.value)}
                          placeholder="e.g., 1.5"
                          inputProps={{ min: 0, step: 0.1 }}
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>PLANNED QTY</Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.planned_qty}
                          onChange={(e) => handleOperationChange(index, 'planned_qty', e.target.value)}
                          placeholder="Planned quantity"
                          inputProps={{ min: 0 }}
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>

                    {/* Row 5: Quality Requirements */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <Stack spacing={1.5}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={op.requires_torque_recording}
                                onChange={(e) => handleOperationChange(index, 'requires_torque_recording', e.target.checked)}
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BoltIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                  Requires Torque Recording
                                </Typography>
                              </Box>
                            }
                          />

                          {op.requires_torque_recording && (
                            <Box>
                              <Typography sx={{ ...labelStyle, mb: 1 }}>
                                Expected Joints
                              </Typography>
                              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                                {op.expected_joints?.map((joint, idx) => (
                                  <Chip
                                    key={idx}
                                    label={joint}
                                    size="small"
                                    sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.background.white }}
                                  />
                                ))}
                                {(!op.expected_joints || op.expected_joints.length === 0) && (
                                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                                    No joints defined in routing
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={op.requires_functional_test}
                              onChange={(e) => handleOperationChange(index, 'requires_functional_test', e.target.checked)}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScienceIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                Requires Functional Test
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>

                    {/* Row 6: Subcontract and Planned Start */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 1 }}>
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
                    </Grid>

                    {op.is_subcontract && (
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={labelStyle}>SUBCONTRACT VENDOR</Typography>
                          <Autocomplete
                            fullWidth
                            options={vendors}
                            getOptionLabel={(option) => `${option.vendor_code} - ${option.vendor_name}`}
                            value={vendors.find(v => v._id === op.subcontract_vendor) || null}
                            onChange={(event, newValue) => {
                              handleOperationChange(index, 'subcontract_vendor', newValue?._id || '');
                            }}
                            loading={loadingVendors}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select vendor"
                                sx={inputStyle}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    )}

                    <Grid size={{ xs: 12, sm: op.is_subcontract ? 4 : 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={labelStyle}>PLANNED START DATE</Typography>
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          value={op.planned_start}
                          onChange={(e) => handleOperationChange(index, 'planned_start', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={inputStyle}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
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
          disabled={loading || !selectedRouting}
          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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

export default AddOperationsPopup;