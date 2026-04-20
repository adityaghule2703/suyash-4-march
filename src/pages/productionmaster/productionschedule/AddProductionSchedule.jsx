import React, { useState, useEffect, useCallback } from 'react';
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
    Autocomplete,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Schedule as ScheduleIcon,
    Factory as MachineIcon,
    Assignment as WOIcon,
    QrCodeScanner as OperationIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
    primary: '#063C3F',
    primaryLight: '#E8F0F1',
    primaryDark: '#05292B',
    text: {
        primary: '#151C26',
        secondary: '#4B5568',
        tertiary: '#94A3B8',
        light: '#FFFFFF'
    },
    background: {
        white: '#FFFFFF',
        light: '#F8FFFC',
        hover: '#F0FDF9'
    },
    border: '#E3E8EF'
};

const SHIFT_OPTIONS = ['General', 'Morning', 'Evening', 'Night'];
const steps = ['Basic Information', 'Schedule Details', 'Review & Submit'];

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

const AddProductionSchedule = ({ open, onClose, onSchedule }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [conflictWarning, setConflictWarning] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        machine_id: '',
        wo_id: '',
        operation_seq: '',
        planned_qty: '',
        scheduled_date: '',
        shift: 'General',
        start_time: '08:00',
        end_time: '12:00',
        planned_hours: 4,
        part_no: ''
    });

    // Data options
    const [availableMachines, setAvailableMachines] = useState([]); // Only machines from selected work order
    const [workOrders, setWorkOrders] = useState([]);
    const [selectedWO, setSelectedWO] = useState(null);
    const [availableOperations, setAvailableOperations] = useState([]);
    const [loadingWO, setLoadingWO] = useState(false);
    const [loadingMachines, setLoadingMachines] = useState(false);

    // Fetch work orders on component mount
    useEffect(() => {
        if (open) {
            fetchWorkOrders();
        }
    }, [open]);

    // Update operations and machines when work order is selected
    useEffect(() => {
        if (selectedWO && selectedWO.operations && selectedWO.operations.length > 0) {
            // Get ALL operations regardless of status
            const allOps = selectedWO.operations;

            // Extract unique machines from ALL operations
            const uniqueMachines = [];
            const machineMap = new Map();

            allOps.forEach(op => {
                const machineId = op.machine_id?._id || op.machine_id;
                const machineName = op.machine_id?.machine_name;
                const machineCode = op.machine_id?.machine_code;

                if (machineId && !machineMap.has(machineId)) {
                    machineMap.set(machineId, {
                        _id: machineId,
                        machine_name: machineName || `Machine ${machineId}`,
                        machine_code: machineCode || ''
                    });
                    uniqueMachines.push({
                        _id: machineId,
                        machine_name: machineName || `Machine ${machineId}`,
                        machine_code: machineCode || ''
                    });
                }
            });

            setAvailableMachines(uniqueMachines);

            // Map ALL operations to a consistent format (no status filter)
            const formattedOps = allOps.map(op => ({
                op_sequence: op.op_sequence,
                operation_name: op.operation_name || (op.operation_id?.operation_name) || `Operation ${op.op_sequence}`,
                operation_id: op.operation_id?._id || op.operation_id,
                planned_qty: op.planned_qty || selectedWO.planned_qty,
                machine_id: op.machine_id?._id || op.machine_id,
                machine_name: op.machine_id?.machine_name,
                status: op.status || 'Pending'
            }));

            setAvailableOperations(formattedOps);

            // Auto-select first operation if available
            if (formattedOps.length > 0 && !formData.operation_seq) {
                const firstOp = formattedOps[0];
                setFormData(prev => ({
                    ...prev,
                    operation_seq: firstOp.op_sequence,
                    part_no: selectedWO.part_no || '',
                    planned_qty: firstOp.planned_qty || prev.planned_qty,
                    machine_id: firstOp.machine_id || ''
                }));
            }
        } else {
            setAvailableOperations([]);
            setAvailableMachines([]);
            setFormData(prev => ({
                ...prev,
                machine_id: '',
                operation_seq: '',
                planned_qty: '',
                part_no: ''
            }));
        }
    }, [selectedWO]);

    const fetchWorkOrders = async () => {
        setLoadingWO(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/work-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                const allowedStatuses = ['Planned', 'Released', 'In Progress', 'Cancelled', 'Partially Completed', 'Components Kitted'];
                // Filter work orders that have allowed status AND have operations with machines
                const workOrdersWithOps = response.data.data.filter(wo => {
                    return allowedStatuses.includes(wo.status) &&  // ← Add this line to filter by status
                        wo.operations && wo.operations.length > 0 &&
                        wo.operations.some(op => op.machine_id);
                });
                setWorkOrders(workOrdersWithOps);
            }
        } catch (err) {
            console.error('Error fetching work orders:', err);
        } finally {
            setLoadingWO(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFieldErrors(prev => ({ ...prev, [field]: '' }));

        if (conflictWarning) {
            setConflictWarning(null);
        }
        if (error) {
            setError('');
        }
    };

    const handleWOSelect = (event, newValue) => {
        setSelectedWO(newValue);
        handleChange('wo_id', newValue?._id || '');
        handleChange('part_no', newValue?.part_no || '');
        handleChange('operation_seq', '');
        handleChange('machine_id', '');
        setFieldErrors(prev => ({ ...prev, wo_id: '' }));
    };

    const handleOperationSelect = (event) => {
        const opSeq = event.target.value;
        handleChange('operation_seq', opSeq);

        // Find the selected operation
        const selectedOp = availableOperations.find(op => op.op_sequence === opSeq);
        if (selectedOp) {
            // Auto-fill planned_qty from operation if available
            if (selectedOp.planned_qty) {
                handleChange('planned_qty', selectedOp.planned_qty);
            }
            // Auto-set machine from operation
            if (selectedOp.machine_id) {
                handleChange('machine_id', selectedOp.machine_id);
            }
        }
    };

    const calculatePlannedHours = () => {
        if (formData.start_time && formData.end_time) {
            const start = formData.start_time.split(':');
            const end = formData.end_time.split(':');
            const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
            const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
            const hours = (endMinutes - startMinutes) / 60;
            if (hours > 0) {
                handleChange('planned_hours', hours);
            }
        }
    };

    useEffect(() => {
        calculatePlannedHours();
    }, [formData.start_time, formData.end_time]);

    const validateStep = (step) => {
        const errors = {};
        let isValid = true;

        switch (step) {
            case 0: // Basic Information
                if (!formData.machine_id) {
                    errors.machine_id = 'Machine is required';
                    isValid = false;
                }
                if (!formData.wo_id) {
                    errors.wo_id = 'Work order is required';
                    isValid = false;
                }
                if (!formData.operation_seq) {
                    errors.operation_seq = 'Operation sequence is required';
                    isValid = false;
                }
                break;

            case 1: // Schedule Details
                if (!formData.planned_qty || formData.planned_qty <= 0) {
                    errors.planned_qty = 'Valid planned quantity is required';
                    isValid = false;
                }
                if (!formData.scheduled_date) {
                    errors.scheduled_date = 'Scheduled date is required';
                    isValid = false;
                }
                if (!formData.start_time) {
                    errors.start_time = 'Start time is required';
                    isValid = false;
                }
                if (!formData.end_time) {
                    errors.end_time = 'End time is required';
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
        setConflictWarning(null);

        try {
            const token = localStorage.getItem('token');

            const payload = {
                machine_id: formData.machine_id,
                wo_id: formData.wo_id,
                operation_seq: parseInt(formData.operation_seq),
                planned_qty: parseInt(formData.planned_qty),
                scheduled_date: formData.scheduled_date,
                shift: formData.shift,
                start_time: formData.start_time,
                end_time: formData.end_time,
                planned_hours: parseFloat(formData.planned_hours),
                part_no: formData.part_no
            };

            const response = await axios.post(`${BASE_URL}/api/production-schedule`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess(true);

                if (response.data.conflict) {
                    setConflictWarning({
                        message: response.data.message,
                        conflictingSlotId: response.data.conflicting_slot_id,
                        conflictingWO: response.data.conflicting_wo
                    });
                }

                if (onSchedule) {
                    onSchedule(response.data.data);
                }

                setTimeout(() => {
                    resetForm();
                    onClose();
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to create production schedule');
            }
        } catch (err) {
            console.error('Error creating production schedule:', err);

            if (err.response?.data?.conflict) {
                setConflictWarning({
                    message: err.response.data.message,
                    conflictingSlotId: err.response.data.conflicting_slot_id,
                    conflictingWO: err.response.data.conflicting_wo
                });
                setError(err.response.data.message);
            } else {
                setError(err.response?.data?.message || 'Failed to create production schedule. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setActiveStep(0);
        setFormData({
            machine_id: '',
            wo_id: '',
            operation_seq: '',
            planned_qty: '',
            scheduled_date: '',
            shift: 'General',
            start_time: '08:00',
            end_time: '12:00',
            planned_hours: 4,
            part_no: ''
        });
        setSelectedWO(null);
        setAvailableOperations([]);
        setAvailableMachines([]);
        setFieldErrors({});
        setError('');
        setConflictWarning(null);
        setSuccess(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getShiftColor = (shift) => {
        const colors = {
            General: { bg: '#E0E7FF', color: '#4338CA' },
            Morning: { bg: '#FEF3C7', color: '#D97706' },
            Evening: { bg: '#FCE7F3', color: '#BE185D' },
            Night: { bg: '#E0E7FF', color: '#3730A3' }
        };
        return colors[shift] || { bg: '#F1F5F9', color: '#475569' };
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={2}>
                        {/* Work Order Selection */}

                        
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            WORK ORDER <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            options={workOrders}
                                            getOptionLabel={(option) => `${option.wo_number} - ${option.part_no} (${option.status})`}
                                            value={selectedWO}
                                            onChange={handleWOSelect}
                                            loading={loadingWO}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    placeholder="Select work order"
                                                    error={!!fieldErrors.wo_id}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 1.5,
                                                            fontSize: '0.75rem'
                                                        }
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <Stack direction="column" spacing={0.5}>
                                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                                            {option.wo_number}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                                                Part: {option.part_no}
                                                            </Typography>
                                                            <Chip
                                                                label={option.status}
                                                                size="small"
                                                                sx={{ fontSize: '0.6rem', height: 18 }}
                                                            />
                                                        </Stack>
                                                    </Stack>
                                                </li>
                                            )}
                                        />
                                        {fieldErrors.wo_id && (
                                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                                                {fieldErrors.wo_id}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                        {/* Machine Selection - Only shows machines from selected work order */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1.5
                            }}>
                                <MachineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Machine Details
                            </Typography>

                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            MACHINE <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <FormControl fullWidth size="small" error={!!fieldErrors.machine_id} disabled={!selectedWO}>
                                            <Select
                                                value={formData.machine_id}
                                                onChange={(e) => handleChange('machine_id', e.target.value)}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    fontSize: '0.75rem',
                                                    '& .MuiSelect-select': { py: 1, px: 1.5 }
                                                }}
                                            >
                                                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                                                    {!selectedWO ? 'Select work order first' : 'Select a machine'}
                                                </MenuItem>
                                                {availableMachines.map((machine) => (
                                                    <MenuItem key={machine._id} value={machine._id} sx={{ fontSize: '0.75rem' }}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <MachineIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                                                            <span>{machine.machine_name} ({machine.machine_code})</span>
                                                        </Stack>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.machine_id && (
                                                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                                                    {fieldErrors.machine_id}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Operation Selection */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1.5
                            }}>
                                <OperationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Operation Details
                            </Typography>

                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            OPERATION SEQUENCE <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <FormControl fullWidth size="small" disabled={!selectedWO} error={!!fieldErrors.operation_seq}>
                                            <Select
                                                value={formData.operation_seq}
                                                onChange={handleOperationSelect}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    fontSize: '0.75rem',
                                                    '& .MuiSelect-select': { py: 1, px: 1.5 }
                                                }}
                                            >
                                                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                                                    {!selectedWO ? 'Select work order first' : 'Select an operation'}
                                                </MenuItem>
                                                {availableOperations.map((op) => (
                                                    <MenuItem key={op.op_sequence} value={op.op_sequence} sx={{ fontSize: '0.75rem' }}>
                                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <OperationIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                                                                <span>
                                                                    Operation {op.op_sequence}: {op.operation_name}
                                                                </span>
                                                                {/* Show status badge for all operations */}
                                                                {op.status === 'Completed' && (
                                                                    <Chip
                                                                        label="Completed"
                                                                        size="small"
                                                                        sx={{ fontSize: '0.55rem', height: 18, bgcolor: '#D1FAE5', color: '#059669' }}
                                                                    />
                                                                )}
                                                                {op.status === 'In Progress' && (
                                                                    <Chip
                                                                        label="In Progress"
                                                                        size="small"
                                                                        sx={{ fontSize: '0.55rem', height: 18, bgcolor: '#E0F2FE', color: '#0284C7' }}
                                                                    />
                                                                )}
                                                                {op.status === 'Pending' && (
                                                                    <Chip
                                                                        label="Pending"
                                                                        size="small"
                                                                        sx={{ fontSize: '0.55rem', height: 18, bgcolor: '#FEF3C7', color: '#D97706' }}
                                                                    />
                                                                )}
                                                            </Stack>
                                                            {op.machine_name && (
                                                                <Chip
                                                                    label={op.machine_name}
                                                                    size="small"
                                                                    sx={{ fontSize: '0.6rem', height: 20, ml: 1 }}
                                                                />
                                                            )}
                                                        </Stack>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.operation_seq && (
                                                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                                                    {fieldErrors.operation_seq}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Stack>
                );

            case 1:
                return (
                    <Stack spacing={2}>
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1.5
                            }}>
                                <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Schedule Details
                            </Typography>

                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            PLANNED QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            size="small"
                                            value={formData.planned_qty}
                                            onChange={(e) => handleChange('planned_qty', e.target.value)}
                                            placeholder="e.g., 500"
                                            error={!!fieldErrors.planned_qty}
                                            helperText={fieldErrors.planned_qty}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            PART NUMBER
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={formData.part_no}
                                            InputProps={{ readOnly: true }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1.5,
                                                    fontSize: '0.75rem',
                                                    bgcolor: COLORS.background.light
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            SCHEDULED DATE <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            size="small"
                                            value={formData.scheduled_date}
                                            onChange={(e) => handleChange('scheduled_date', e.target.value)}
                                            error={!!fieldErrors.scheduled_date}
                                            helperText={fieldErrors.scheduled_date}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                                            SHIFT <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={formData.shift}
                                                onChange={(e) => handleChange('shift', e.target.value)}
                                                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                                            >
                                                {SHIFT_OPTIONS.map((shift) => {
                                                    const colors = getShiftColor(shift);
                                                    return (
                                                        <MenuItem key={shift} value={shift} sx={{ fontSize: '0.75rem' }}>
                                                            <Chip
                                                                label={shift}
                                                                size="small"
                                                                sx={{ bgcolor: colors.bg, color: colors.color, fontSize: '0.65rem' }}
                                                            />
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Grid>
                                {/* <Grid container spacing={1.5}> */}
                                   <Grid size={{ xs: 12, sm: 4 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
            START TIME <span style={{ color: '#EF4444' }}>*</span>
        </Typography>
        <TextField
            fullWidth
            type="time"
            size="small"
            value={formData.start_time}
            onChange={(e) => handleChange('start_time', e.target.value)}
            error={!!fieldErrors.start_time}
            helperText={fieldErrors.start_time}
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
        />
    </Box>
</Grid>

<Grid size={{ xs: 12, sm: 4 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
            END TIME <span style={{ color: '#EF4444' }}>*</span>
        </Typography>
        <TextField
            fullWidth
            type="time"
            size="small"
            value={formData.end_time}
            onChange={(e) => handleChange('end_time', e.target.value)}
            error={!!fieldErrors.end_time}
            helperText={fieldErrors.end_time}
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
        />
    </Box>
</Grid>

<Grid size={{ xs: 12, sm: 4 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
            PLANNED HOURS
        </Typography>
        <TextField
            fullWidth
            type="number"
            size="small"
            value={formData.planned_hours}
            InputProps={{
                readOnly: true,
                sx: { bgcolor: COLORS.background.light }
            }}
            helperText="Auto-calculated"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
        />
    </Box>
</Grid>
                                
                            </Grid>
                        </Paper>
                    </Stack>
                );

            case 2:
                return (
                    <Stack spacing={2}>
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1.5
                            }}>
                                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Review & Submit
                            </Typography>

                            <Stack spacing={2}>
                                {/* Basic Info Summary */}
                                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                                        Machine & Work Order Details
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                {availableMachines.find(m => m._id === formData.machine_id)?.machine_name || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Order:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                {selectedWO?.wo_number || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                {formData.part_no || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                Operation {formData.operation_seq}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Schedule Details Summary */}
                                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                                        Schedule Details
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.planned_qty}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Scheduled Date:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.scheduled_date}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Shift:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.shift}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Time:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                {formData.start_time} - {formData.end_time}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Hours:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.planned_hours} hrs</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
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
                    Add Production Schedule
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* Stepper */}
            <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    connector={<ColorConnector />}
                >
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
                {success ? (
                    <Stack spacing={2}>
                        <Alert
                            severity={conflictWarning ? "warning" : "success"}
                            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                            icon={conflictWarning ? <WarningIcon /> : <CheckCircleIcon />}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                {conflictWarning ? 'Schedule Created with Conflict' : 'Production Schedule Created Successfully!'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                                {conflictWarning ? conflictWarning.message : 'The schedule has been added to production plan'}
                            </Typography>
                        </Alert>
                    </Stack>
                ) : (
                    <>
                        {renderStepContent(activeStep)}

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mt: 2,
                                    borderRadius: 1.5,
                                    fontSize: '0.75rem',
                                    py: 0.5
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                                    Validation Error
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>
                                    {error}
                                </Typography>
                            </Alert>
                        )}
                    </>
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
                    disabled={activeStep === 0 || loading || success}
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
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: COLORS.primary,
                            bgcolor: `${COLORS.primary}10`
                        }
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
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: COLORS.primary,
                                bgcolor: `${COLORS.primary}10`
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading || success}
                            size="small"
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
                            {loading ? 'Adding...' : 'Add Schedule'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={loading || success}
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

export default AddProductionSchedule;