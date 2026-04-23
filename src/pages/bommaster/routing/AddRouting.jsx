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
    Autocomplete,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Switch
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Route as RouteIcon,
    Build as BuildIcon,
    Info as InfoIcon,
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Science as ScienceIcon,
    CheckCircle as CheckCircleIcon,
    Bolt as BoltIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

import AddItem from '../../master/itemmaster/AddItem';
import AddVendor from '../../master/vendormaster/AddVendor';
import AddProcess from '../../master/processmaster/AddProcess';
import AddMachine from '../machinemaster/AddMachine';

const COLORS = {
    primary: '#063C3F',
    primaryDark: '#05292B',
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#D32F2F',
    border: '#E3E8EF',
    text: {
        primary: '#151C26',
        secondary: '#4B5568',
        tertiary: '#94A3B8'
    },
    background: {
        light: '#F8FFFC',
        white: '#FFFFFF'
    }
};

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

const CustomPaper = styled(Paper)({
    maxHeight: 200,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
});

const AddRouting = ({ open, onClose, onAdd }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [processes, setProcesses] = useState([]);
    const [machines, setMachines] = useState([]);
    const [items, setItems] = useState([]);
    const [fetchingData, setFetchingData] = useState(false);

    // Add state for modals
    const [openAddItemModal, setOpenAddItemModal] = useState(false);
    const [openAddMachineModal, setOpenAddMachineModal] = useState(false);
    const [openAddVendorModal, setOpenAddVendorModal] = useState(false);
    const [openAddProcessModal, setOpenAddProcessModal] = useState(false);

    // Add state for vendors
    const [vendors, setVendors] = useState([]);

    const [currentJoint, setCurrentJoint] = useState('');
    const [jointError, setJointError] = useState('');

    // Fetch vendors when dialog opens
    const fetchVendors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/vendors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setVendors(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching vendors:', err);
        }
    };

    useEffect(() => {
        if (open) {
            fetchProcesses();
            fetchMachines();
            fetchItems();
            fetchVendors();
        }
    }, [open]);

    const [formData, setFormData] = useState({
        routing_name: '',
        routing_type: '',
        applicable_items: [],
        version: '',
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
        description: '',
        requires_torque_recording: false,
        requires_functional_test: false,
        expected_joints: []
    });

    const [selectedItems, setSelectedItems] = useState([]);

    const ROUTING_TYPE_OPTIONS = [
        'Stamping',
        'Busbar',
        'Gasket',
        'Assembly',
        'Toolroom',
        'General'
    ];

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
            const response = await axios.get(`${BASE_URL}/api/machines`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { 'status': ['Active', 'Idle'] },
            });

            if (response.data.success) {
                setMachines(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching machines:', err);
        }
    };

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/items/dropdown`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setItems(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching items:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
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

    const handleProcessAdded = (newProcess) => {
        setProcesses(prev => [...prev, newProcess]);
        setCurrentOperation(prev => ({
            ...prev,
            operation_id: newProcess._id,
            operation_name: newProcess.process_name,
            work_centre: newProcess.work_centre || ''
        }));
    };

    const handleItemAdded = (newItem) => {
        setItems(prev => [...prev, newItem]);
        addApplicableItem(newItem);
    };

    const handleMachineAdded = (newMachine) => {
        setMachines(prev => [...prev, newMachine]);
        setCurrentOperation(prev => ({
            ...prev,
            machine_id: newMachine._id
        }));
    };

    const handleMachineSelect = (machineId) => {
        const selectedMachine = machines.find(m => m._id === machineId);
        if (selectedMachine) {
            setCurrentOperation(prev => ({
                ...prev,
                machine_id: selectedMachine._id,
                work_centre: selectedMachine.work_centre || prev.work_centre
            }));
        }
    };

    const handleVendorAdded = (newVendor) => {
        setVendors(prev => [...prev, newVendor]);
        setCurrentOperation(prev => ({
            ...prev,
            subcontract_vendor: newVendor._id
        }));
    };

    const addJoint = () => {
        if (!currentJoint.trim()) {
            setJointError('Joint name is required');
            return;
        }
        if (currentOperation.expected_joints.includes(currentJoint.trim())) {
            setJointError('Joint name already exists');
            return;
        }
        setCurrentOperation(prev => ({
            ...prev,
            expected_joints: [...prev.expected_joints, currentJoint.trim()]
        }));
        setCurrentJoint('');
        setJointError('');
    };

    const removeJoint = (jointToRemove) => {
        setCurrentOperation(prev => ({
            ...prev,
            expected_joints: prev.expected_joints.filter(joint => joint !== jointToRemove)
        }));
    };

    const addOperation = () => {
        if (!currentOperation.operation_id) {
            setError('Please select a process');
            return;
        }
        if (!currentOperation.op_sequence) {
            setError('Operation sequence is required');
            return;
        }
        if (Number(currentOperation.op_sequence) < 10) {
            setError('Operation sequence must be at least 10');
            return;
        }
        if (!currentOperation.work_centre) {
            setError('Work centre is required');
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

        // Validate torque recording requirements
        if (currentOperation.requires_torque_recording && currentOperation.expected_joints.length === 0) {
            setError('Please add at least one expected joint for torque recording');
            return;
        }

        const newOperation = {
            op_sequence: Number(currentOperation.op_sequence),
            operation_id: currentOperation.operation_id,
            operation_name: currentOperation.operation_name,
            work_centre: currentOperation.work_centre || '',
            machine_id: currentOperation.machine_id || undefined,
            is_subcontract: currentOperation.is_subcontract || false,
            subcontract_vendor: currentOperation.subcontract_vendor || '',
            planned_setup_min: Number(currentOperation.planned_setup_min),
            planned_run_min: Number(currentOperation.planned_run_min),
            scrap_pct: Number(currentOperation.scrap_pct) || 0,
            description: currentOperation.description || undefined,
            requires_torque_recording: currentOperation.requires_torque_recording,
            requires_functional_test: currentOperation.requires_functional_test,
            expected_joints: currentOperation.expected_joints
        };

        if (currentOperation.is_subcontract && currentOperation.subcontract_vendor) {
            newOperation.subcontract_vendor = currentOperation.subcontract_vendor;
        }

        if (formData.operations.some(op => op.op_sequence === newOperation.op_sequence)) {
            setError(`Operation sequence ${newOperation.op_sequence} already exists`);
            return;
        }

        setFormData(prev => ({
            ...prev,
            operations: [...prev.operations, newOperation].sort((a, b) => a.op_sequence - b.op_sequence)
        }));

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
            description: '',
            requires_torque_recording: false,
            requires_functional_test: false,
            expected_joints: []
        });
        setCurrentJoint('');
        setError('');
    };

    const removeOperation = (index) => {
        setFormData(prev => ({
            ...prev,
            operations: prev.operations.filter((_, i) => i !== index)
        }));
    };

    const addApplicableItem = (item) => {
        if (item && !formData.applicable_items.includes(item._id)) {
            setFormData(prev => ({
                ...prev,
                applicable_items: [...prev.applicable_items, item._id]
            }));
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const removeApplicableItem = (itemId) => {
        setFormData(prev => ({
            ...prev,
            applicable_items: prev.applicable_items.filter(id => id !== itemId)
        }));
        setSelectedItems(prev => prev.filter(item => item._id !== itemId));
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
                if (!formData.routing_type.trim()) {
                    errors.routing_type = 'Routing type is required';
                    isValid = false;
                }
                break;

            case 1:
                if (formData.operations.length === 0) {
                    errors.operations = 'At least one operation is required';
                    isValid = false;
                }
                const invalidOps = formData.operations.filter(op => !op.work_centre);
                if (invalidOps.length > 0) {
                    errors.operations = `Operations ${invalidOps.map(op => op.op_sequence).join(', ')} missing work centre`;
                    isValid = false;
                }
                const invalidSequenceOps = formData.operations.filter(op => op.op_sequence < 10);
                if (invalidSequenceOps.length > 0) {
                    errors.operations = `Operation sequences ${invalidSequenceOps.map(op => op.op_sequence).join(', ')} must be at least 10`;
                    isValid = false;
                }
                // Validate torque recording for operations that require it
                const invalidTorqueOps = formData.operations.filter(op => op.requires_torque_recording && (!op.expected_joints || op.expected_joints.length === 0));
                if (invalidTorqueOps.length > 0) {
                    errors.operations = `Operations ${invalidTorqueOps.map(op => op.op_sequence).join(', ')} require torque recording but have no expected joints`;
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

            const cleanedOperations = formData.operations.map(op => {
                const cleanedOp = { ...op };
                if (!cleanedOp.machine_id) delete cleanedOp.machine_id;
                if (!cleanedOp.is_subcontract || !cleanedOp.subcontract_vendor) {
                    delete cleanedOp.subcontract_vendor;
                }
                if (!cleanedOp.description) delete cleanedOp.description;
                return cleanedOp;
            });

            const submitData = {
                routing_name: formData.routing_name,
                routing_type: formData.routing_type,
                applicable_items: formData.applicable_items,
                operations: cleanedOperations,
                version: formData.version
            };

            const response = await axios.post(`${BASE_URL}/api/routings`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                if (onAdd) {
                    onAdd(response.data.data);
                }
                handleClose();
            } else {
                setError(response.data.message || 'Failed to create routing');
            }
        } catch (err) {
            console.error('Error creating routing:', err);
            setError(err.response?.data?.message || 'Failed to create routing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setActiveStep(0);
        setFormData({
            routing_name: '',
            routing_type: '',
            applicable_items: [],
            version: '',
            operations: []
        });
        setSelectedItems([]);
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
            description: '',
            requires_torque_recording: false,
            requires_functional_test: false,
            expected_joints: []
        });
        setCurrentJoint('');
        setFieldErrors({});
        setError('');
    };

    const handleClose = () => {
        resetForm();
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
                                        <Typography sx={labelStyle}>
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
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>
                                            ROUTING TYPE <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <FormControl fullWidth size="small" error={!!fieldErrors.routing_type}>
                                            <Select
                                                name="routing_type"
                                                value={formData.routing_type}
                                                onChange={handleChange}
                                                displayEmpty
                                                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                                            >
                                                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                                                    Select routing type
                                                </MenuItem>
                                                {ROUTING_TYPE_OPTIONS.map((type) => (
                                                    <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.routing_type && (
                                                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                                                    {fieldErrors.routing_type}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>VERSION</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="version"
                                            value={formData.version}
                                            onChange={handleChange}
                                            placeholder="1.0"
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>APPLICABLE ITEMS</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Autocomplete
                                                    options={items}
                                                    getOptionLabel={(option) => {
                                                        const partNo = option.part_no || '';
                                                        const partName = option.part_name || option.part_description || '';
                                                        return `${partNo} - ${partName}`.trim();
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) {
                                                            addApplicableItem(newValue);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            placeholder="Search and select items..."
                                                            sx={inputStyle}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                    PaperComponent={CustomPaper}
                                                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                                                />
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setOpenAddItemModal(true)}
                                                startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                                                sx={{
                                                    height: 35,
                                                    minWidth: 'auto',
                                                    px: 1.5,
                                                    borderRadius: 1.5,
                                                    border: `1px solid ${COLORS.border}`,
                                                    color: COLORS.text.secondary,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 500,
                                                    textTransform: 'none',
                                                    whiteSpace: 'nowrap',
                                                    '&:hover': {
                                                        borderColor: COLORS.primary,
                                                        bgcolor: `${COLORS.primary}10`,
                                                        color: COLORS.primary
                                                    }
                                                }}
                                            >
                                                Add New
                                            </Button>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                            {selectedItems.map((item) => (
                                                <Chip
                                                    key={item._id}
                                                    label={`${item.part_no || item.item_id} - ${item.part_name || item.part_description}`}
                                                    onDelete={() => removeApplicableItem(item._id)}
                                                    size="small"
                                                    sx={{ bgcolor: COLORS.background.light, fontSize: '0.65rem', height: 28 }}
                                                />
                                            ))}
                                            {selectedItems.length === 0 && (
                                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic', mt: 1 }}>
                                                    No items selected
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Stack>
                );

            case 1:
                return (
                    <Stack spacing={2}>
                        <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Operations
                            </Typography>

                            {/* Line 1: SEQUENCE & PROCESS */}
                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>
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
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 9 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>
                                            PROCESS <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <Box sx={{ flex: 1 }}>
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
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setOpenAddProcessModal(true)}
                                                startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                                                sx={{
                                                    height: 35,
                                                    minWidth: 'auto',
                                                    px: 1.5,
                                                    borderRadius: 1.5,
                                                    border: `1px solid ${COLORS.border}`,
                                                    color: COLORS.text.secondary,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 500,
                                                    textTransform: 'none',
                                                    whiteSpace: 'nowrap',
                                                    '&:hover': {
                                                        borderColor: COLORS.primary,
                                                        bgcolor: `${COLORS.primary}10`,
                                                        color: COLORS.primary
                                                    }
                                                }}
                                            >
                                                Add New
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Line 2: WORK CENTRE & MACHINE */}
                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>MACHINE</Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={currentOperation.machine_id}
                                                onChange={(e) => handleMachineSelect(e.target.value)}
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

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>
                                            WORK CENTRE <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="work_centre"
                                            value={currentOperation.work_centre}
                                            onChange={handleOperationChange}
                                            placeholder="Enter work centre"
                                            sx={inputStyle}
                                            disabled
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Line 3: SETUP TIME & RUN TIME */}
                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>
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
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>
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
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Line 4: SCRAP % & DESCRIPTION */}
                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>SCRAP %</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            size="small"
                                            name="scrap_pct"
                                            value={currentOperation.scrap_pct}
                                            onChange={handleOperationChange}
                                            placeholder="0"
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 9 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>DESCRIPTION</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="description"
                                            value={currentOperation.description}
                                            onChange={handleOperationChange}
                                            placeholder="Operation description"
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Line 5: Quality Requirements - Torque Recording & Functional Test */}
                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                        <Stack spacing={1.5}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={currentOperation.requires_torque_recording}
                                                        onChange={handleOperationChange}
                                                        name="requires_torque_recording"
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

                                            {currentOperation.requires_torque_recording && (
                                                <Box>
                                                    <Typography sx={{ ...labelStyle, mb: 1 }}>
                                                        EXPECTED JOINTS <span style={{ color: '#EF4444' }}>*</span>
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                                        <TextField
                                                            size="small"
                                                            value={currentJoint}
                                                            onChange={(e) => {
                                                                setCurrentJoint(e.target.value);
                                                                setJointError('');
                                                            }}
                                                            placeholder="e.g., Phase A, Phase B, Earth"
                                                            error={!!jointError}
                                                            helperText={jointError}
                                                            sx={{ flex: 1, ...inputStyle }}
                                                        />
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={addJoint}
                                                            startIcon={<AddIcon sx={{ fontSize: '0.8rem' }} />}
                                                            sx={{ height: 35, px: 1.5, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'none' }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {currentOperation.expected_joints.map((joint, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={joint}
                                                                onDelete={() => removeJoint(joint)}
                                                                size="small"
                                                                sx={{ bgcolor: COLORS.background.white, fontSize: '0.65rem', height: 26 }}
                                                            />
                                                        ))}
                                                        {currentOperation.expected_joints.length === 0 && (
                                                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                                                                No joints added. Add at least one joint for torque recording.
                                                            </Typography>
                                                        )}
                                                    </Box>
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
                                                    checked={currentOperation.requires_functional_test}
                                                    onChange={handleOperationChange}
                                                    name="requires_functional_test"
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
                            </Grid>

                            {/* Line 6: Is Subcontract (if yes Vendor) */}
                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={currentOperation.is_subcontract}
                                                    onChange={handleOperationChange}
                                                    name="is_subcontract"
                                                    size="small"
                                                />
                                            }
                                            label={<Typography sx={{ fontSize: '0.7rem' }}>Is Subcontract</Typography>}
                                        />
                                        {currentOperation.is_subcontract && (
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flex: 1 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Autocomplete
                                                        options={vendors}
                                                        getOptionLabel={(option) => `${option.vendor_name} (${option.vendor_code})`}
                                                        onChange={(event, newValue) => {
                                                            setCurrentOperation(prev => ({
                                                                ...prev,
                                                                subcontract_vendor: newValue?._id || ''
                                                            }));
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                placeholder="Select vendor"
                                                                sx={inputStyle}
                                                            />
                                                        )}
                                                        PaperComponent={CustomPaper}
                                                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                                                    />
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => setOpenAddVendorModal(true)}
                                                    startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                                                    sx={{
                                                        height: 35,
                                                        minWidth: 'auto',
                                                        px: 1.5,
                                                        borderRadius: 1.5,
                                                        border: `1px solid ${COLORS.border}`,
                                                        color: COLORS.text.secondary,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 500,
                                                        textTransform: 'none',
                                                        whiteSpace: 'nowrap',
                                                        '&:hover': {
                                                            borderColor: COLORS.primary,
                                                            bgcolor: `${COLORS.primary}10`,
                                                            color: COLORS.primary
                                                        }
                                                    }}
                                                >
                                                    Add New
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Add Operation Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={addOperation}
                                    startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                                    sx={{ height: 36, px: 3, borderRadius: 1.5, fontSize: '0.75rem', textTransform: 'none' }}
                                >
                                    Add Operation
                                </Button>
                            </Box>

                            {/* Operations Table */}
                            {formData.operations.length > 0 && (
                                <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: COLORS.background.light }}>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Seq</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Operation</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Work Centre</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Machine</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Setup</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Run</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Torque</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Test</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 50 }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {formData.operations.map((op, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{op.op_sequence}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{op.operation_name}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{op.work_centre || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>
                                                        {machines.find(m => m._id === op.machine_id)?.machine_name || '-'}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_setup_min}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_run_min}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>
                                                        {op.requires_torque_recording ? (
                                                            <Chip 
                                                                label="Yes" 
                                                                size="small" 
                                                                sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primary, color: '#fff' }} 
                                                            />
                                                        ) : '-'}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>
                                                        {op.requires_functional_test ? (
                                                            <Chip 
                                                                label="Yes" 
                                                                size="small" 
                                                                sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.success, color: '#fff' }} 
                                                            />
                                                        ) : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton size="small" onClick={() => removeOperation(index)} sx={{ color: COLORS.error }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
                const totalOperations = formData.operations.length;
                const totalSetupTime = formData.operations.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0);
                const totalRunTime = formData.operations.reduce((sum, op) => sum + (op.planned_run_min || 0), 0);
                const torqueOps = formData.operations.filter(op => op.requires_torque_recording).length;
                const testOps = formData.operations.filter(op => op.requires_functional_test).length;

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
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Applicable Items:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                {selectedItems.map(item => item.part_no || item.item_id).join(', ') || '-'}
                                            </Typography>
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
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#059669' }}>{totalOperations}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{totalSetupTime} min</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{totalRunTime} min/unit</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Torque Recording Ops:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{torqueOps}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Functional Test Ops:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{testOps}</Typography>
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
                                                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Torque</TableCell>
                                                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Test</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {formData.operations.map((op, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ fontSize: '0.7rem' }}>{op.op_sequence}</TableCell>
                                                            <TableCell sx={{ fontSize: '0.7rem' }}>{op.operation_name}</TableCell>
                                                            <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_setup_min} min</TableCell>
                                                            <TableCell sx={{ fontSize: '0.7rem' }}>{op.planned_run_min} min</TableCell>
                                                            <TableCell sx={{ fontSize: '0.7rem' }}>{op.requires_torque_recording ? 'Yes' : '-'}</TableCell>
                                                            <TableCell sx={{ fontSize: '0.7rem' }}>{op.requires_functional_test ? 'Yes' : '-'}</TableCell>
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
                    Create New Routing
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
                            {loading ? 'Creating...' : 'Create Routing'}
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

            {/* Add Item Modal */}
            <AddItem
                open={openAddItemModal}
                onClose={() => setOpenAddItemModal(false)}
                onAdd={handleItemAdded}
            />

            {/* Add Machine Modal */}
            <AddMachine
                open={openAddMachineModal}
                onClose={() => setOpenAddMachineModal(false)}
                onAdd={handleMachineAdded}
            />

            {/* Add Vendor Modal */}
            <AddVendor
                open={openAddVendorModal}
                onClose={() => setOpenAddVendorModal(false)}
                onAdd={handleVendorAdded}
            />

            {/* Add Process Modal */}
            <AddProcess
                open={openAddProcessModal}
                onClose={() => setOpenAddProcessModal(false)}
                onAdd={handleProcessAdded}
            />
        </Dialog>
    );
};

export default AddRouting;