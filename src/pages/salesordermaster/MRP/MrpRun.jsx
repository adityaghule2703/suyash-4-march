// MrpRun.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
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
    Grid,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormHelperText,
    LinearProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled
} from '@mui/material';
import {
    Close as CloseIcon,
    PlayArrow as PlayIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Schedule as ScheduleIcon,
    Factory as FactoryIcon,
    ShoppingCart as ShoppingCartIcon,
    Assignment as AssignmentIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
    primary: '#063C3F',
    primaryLight: '#E8F0F1',
    primaryDark: '#05292B',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
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

const steps = ['Configure MRP', 'Run MRP', 'View Results'];

const MrpRun = ({ open, onClose, onRunComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mrpRun, setMrpRun] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        run_type: 'Full',
        planning_horizon: 30,
        so_ids: []
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [salesOrders, setSalesOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Fetch sales orders for selection
    useEffect(() => {
        if (open && activeStep === 0) {
            fetchSalesOrders();
        }
    }, [open, activeStep]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const fetchSalesOrders = async () => {
        setLoadingOrders(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/sales-orders?status=Confirmed&page=1&limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setSalesOrders(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching sales orders:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSalesOrderChange = (event) => {
        const { value } = event.target;
        setFormData(prev => ({ ...prev, so_ids: value }));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.run_type) {
            errors.run_type = 'Run type is required';
            isValid = false;
        }

        if (!formData.planning_horizon || formData.planning_horizon < 1) {
            errors.planning_horizon = 'Planning horizon must be at least 1 day';
            isValid = false;
        }

        if (formData.planning_horizon > 365) {
            errors.planning_horizon = 'Planning horizon cannot exceed 365 days';
            isValid = false;
        }

        setFieldErrors(errors);
        if (!isValid) {
            setError('Please fix the errors in the form');
        }
        return isValid;
    };

    const handleRunMrp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setActiveStep(1);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${BASE_URL}/api/mrp/run`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setMrpRun(response.data.data);
                // Start polling for status
                startPolling(response.data.data._id);

                if (onRunComplete) {
                    onRunComplete(response.data.data);
                }
            } else {
                setError(response.data.message || 'Failed to start MRP run');
                setActiveStep(0);
            }
        } catch (err) {
            console.error('Error starting MRP run:', err);

            if (err.response?.status === 401) {
                setError('Unauthorized. Please login again.');
            } else if (err.response?.status === 400) {
                setError(err.response.data?.message || 'Invalid request. Please check your inputs.');
            } else {
                setError(err.response?.data?.message || 'Failed to start MRP run. Please try again.');
            }
            setActiveStep(0);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (mrpRunId) => {
        // Clear any existing interval
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        // Poll every 2 seconds
        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${BASE_URL}/api/mrp/runs/${mrpRunId}/status`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (response.data.success) {
                    setJobStatus(response.data.data);

                    // If job is completed or failed, stop polling
                    if (response.data.data.status === 'Completed' ||
                        response.data.data.status === 'Failed' ||
                        response.data.data.status === 'Cancelled') {
                        clearInterval(interval);
                        setPollingInterval(null);

                        if (response.data.data.status === 'Completed') {
                            setActiveStep(2);
                        }
                    }
                }
            } catch (err) {
                console.error('Error polling MRP status:', err);
                clearInterval(interval);
                setPollingInterval(null);
                setError('Failed to get MRP run status');
            }
        }, 2000);

        setPollingInterval(interval);
    };

    const handleReset = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
        setActiveStep(0);
        setMrpRun(null);
        setJobStatus(null);
        setError('');
        setFormData({
            run_type: 'Full',
            planning_horizon: 30,
            so_ids: []
        });
    };

    const handleClose = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
        setActiveStep(0);
        setMrpRun(null);
        setJobStatus(null);
        setError('');
        onClose();
    };

  const getRunTypeLabel = (type) => {
  switch (type) {
    case 'Full':
      return 'Full MRP Run';
    case 'Incremental':
      return 'Incremental MRP Run';
    case 'Item-Specific':
      return 'Item-Specific MRP Run';
    default:
      return type;
  }
};

    const getStatusColor = (status) => {
        switch (status) {
            case 'Running':
                return { bg: `${COLORS.info}15`, color: COLORS.info, icon: <CircularProgress size={16} /> };
            case 'Completed':
                return { bg: `${COLORS.success}15`, color: COLORS.success, icon: <CheckCircleIcon fontSize="small" /> };
            case 'Failed':
                return { bg: `${COLORS.error}15`, color: COLORS.error, icon: <ErrorIcon fontSize="small" /> };
            case 'Queued':
                return { bg: `${COLORS.warning}15`, color: COLORS.warning, icon: <ScheduleIcon fontSize="small" /> };
            default:
                return { bg: `${COLORS.text.tertiary}15`, color: COLORS.text.secondary, icon: null };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={3}>
                        <Paper sx={{
                            p: 2.5,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <FactoryIcon sx={{ fontSize: '1rem' }} />
                                MRP Configuration
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                                        Run Type <span style={{ color: COLORS.error }}>*</span>
                                    </Typography>
                                    <FormControl fullWidth size="small" error={!!fieldErrors.run_type}>
                                        <Select
                                            name="run_type"
                                            value={formData.run_type}
                                            onChange={handleChange}
                                            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                                        >
                                            <MenuItem value="Full" sx={{ fontSize: '0.75rem' }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <span>Full MRP Run</span>
                                                    <Typography variant="caption" color="text.secondary">
                                                        - Recalculates all requirements
                                                    </Typography>
                                                </Stack>
                                            </MenuItem>
                                            <MenuItem value="Incremental" sx={{ fontSize: '0.75rem' }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <span>Incremental MRP Run</span>
                                                    <Typography variant="caption" color="text.secondary">
                                                        - Only changed items since last run
                                                    </Typography>
                                                </Stack>
                                            </MenuItem>
                                            <MenuItem value="Item-Specific" sx={{ fontSize: '0.75rem' }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <span>Item-Specific MRP Run</span>
                                                    <Typography variant="caption" color="text.secondary">
                                                        - Specific items only
                                                    </Typography>
                                                </Stack>
                                            </MenuItem>
                                        </Select>
                                        {fieldErrors.run_type && (
                                            <FormHelperText error>{fieldErrors.run_type}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                                        Planning Horizon (days) <span style={{ color: COLORS.error }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        size="small"
                                        name="planning_horizon"
                                        value={formData.planning_horizon}
                                        onChange={handleChange}
                                        error={!!fieldErrors.planning_horizon}
                                        helperText={fieldErrors.planning_horizon}
                                        InputProps={{ inputProps: { min: 1, max: 365 } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                                        Sales Orders (Optional)
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            multiple
                                            value={formData.so_ids}
                                            onChange={handleSalesOrderChange}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const so = salesOrders.find(s => s._id === value);
                                                        return (
                                                            <Chip
                                                                key={value}
                                                                label={so?.so_id || value}
                                                                size="small"
                                                                sx={{ fontSize: '0.65rem', height: 24 }}
                                                            />
                                                        );
                                                    })}
                                                </Box>
                                            )}
                                            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                                        >
                                            {loadingOrders ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={20} />
                                                </MenuItem>
                                            ) : salesOrders.length === 0 ? (
                                                <MenuItem disabled>No sales orders available</MenuItem>
                                            ) : (
                                                salesOrders.map((so) => (
                                                    <MenuItem key={so._id} value={so._id} sx={{ fontSize: '0.75rem' }}>
                                                        <Checkbox checked={formData.so_ids.indexOf(so._id) !== -1} />
                                                        <ListItemText
                                                            primary={so.so_id}
                                                            secondary={`${so.customer_name || 'N/A'} - ${so.total_amount || 0}`}
                                                            primaryTypographyProps={{ fontSize: '0.75rem' }}
                                                            secondaryTypographyProps={{ fontSize: '0.65rem' }}
                                                        />
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                        Leave empty to run MRP for all confirmed sales orders
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Info Alert */}
                        <Alert
                            severity="info"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.7rem',
                                '& .MuiAlert-icon': {
                                    alignItems: 'center'
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: '0.7rem' }}>
                                <strong>What will MRP do?</strong><br />
                                • Calculate material requirements based on BOM explosion<br />
                                • Generate purchase requisitions for raw materials<br />
                                • Create work orders for manufactured items<br />
                                • Identify shortages and suggest order quantities
                            </Typography>
                        </Alert>
                    </Stack>
                );

            case 1:
                return (
                    <Stack spacing={3}>
                        <Paper sx={{
                            p: 3,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none',
                            textAlign: 'center'
                        }}>
                            <CircularProgress size={48} sx={{ color: COLORS.primary, mb: 2 }} />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
                                MRP Run in Progress
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                                Processing material requirements...
                            </Typography>
                        </Paper>

                        {mrpRun && (
                            <Paper sx={{
                                p: 2,
                                bgcolor: COLORS.background.light,
                                borderRadius: 1.5,
                                border: `1px solid ${COLORS.border}`,
                                boxShadow: 'none'
                            }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                                    MRP Run Details
                                </Typography>
                                <Grid container spacing={1.5}>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                            MRP Run ID
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                            {mrpRun.mrp_run_id}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                            Run Type
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                            {getRunTypeLabel(mrpRun.run_type)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                            Status
                                        </Typography>
                                        <Chip
                                            label={mrpRun.status}
                                            size="small"
                                            sx={{
                                                fontSize: '0.65rem',
                                                height: 24,
                                                bgcolor: getStatusColor(mrpRun.status).bg,
                                                color: getStatusColor(mrpRun.status).color
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}

                        {jobStatus && jobStatus.progress !== undefined && (
                            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                                    Progress: {jobStatus.progress}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={jobStatus.progress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: COLORS.border,
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: COLORS.primary,
                                            borderRadius: 3
                                        }
                                    }}
                                />
                                {jobStatus.message && (
                                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1 }}>
                                        {jobStatus.message}
                                    </Typography>
                                )}
                            </Paper>
                        )}
                    </Stack>
                );

            case 2:
                return (
                    <Stack spacing={3}>
                        {/* Success Banner */}
                        <Paper sx={{
                            p: 3,
                            bgcolor: `${COLORS.success}10`,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.success}`,
                            textAlign: 'center'
                        }}>
                            <CheckCircleIcon sx={{ fontSize: '3rem', color: COLORS.success, mb: 1 }} />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success, mb: 1 }}>
                                MRP Run Completed Successfully!
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                                Material requirements have been calculated and recommendations have been generated.
                            </Typography>
                        </Paper>

                        {/* Summary Cards */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Card sx={{ bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <ShoppingCartIcon sx={{ fontSize: '2rem', color: COLORS.primary, mb: 1 }} />
                                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
                                            {jobStatus?.summary?.purchase_requisitions || 0}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                                            Purchase Requisitions
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Card sx={{ bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <AssignmentIcon sx={{ fontSize: '2rem', color: COLORS.primary, mb: 1 }} />
                                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
                                            {jobStatus?.summary?.work_orders || 0}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                                            Work Orders
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Card sx={{ bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <WarningIcon sx={{ fontSize: '2rem', color: COLORS.warning, mb: 1 }} />
                                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
                                            {jobStatus?.summary?.shortages || 0}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                                            Material Shortages
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* MRP Run Details */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                                MRP Run Details
                            </Typography>

                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                        MRP Run ID
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                        {jobStatus?.mrp_run_id || mrpRun?.mrp_run_id}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                        Run Type
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                        {getRunTypeLabel(jobStatus?.run_type || mrpRun?.run_type)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                        Started At
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem' }}>
                                        {formatDate(jobStatus?.started_at)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                                        Completed At
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem' }}>
                                        {formatDate(jobStatus?.completed_at)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Recommendations Section */}
                        {jobStatus?.recommendations && jobStatus.recommendations.length > 0 && (
                            <Paper sx={{
                                p: 2,
                                bgcolor: COLORS.background.white,
                                borderRadius: 1.5,
                                border: `1px solid ${COLORS.border}`,
                                boxShadow: 'none'
                            }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                                    Recommendations
                                </Typography>

                                <List dense>
                                    {jobStatus.recommendations.map((rec, idx) => (
                                        <ListItem key={idx} sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                {rec.type === 'critical' ? (
                                                    <ErrorIcon sx={{ fontSize: '1rem', color: COLORS.error }} />
                                                ) : rec.type === 'warning' ? (
                                                    <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
                                                ) : (
                                                    <InfoIcon sx={{ fontSize: '1rem', color: COLORS.info }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={rec.message}
                                                primaryTypographyProps={{ fontSize: '0.75rem' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: COLORS.background.white
            }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <FactoryIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
                        MRP Run
                    </Typography>
                </Stack>
                <IconButton onClick={handleClose} size="small" disabled={loading}>
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
                    onClick={handleClose}
                    disabled={loading}
                    size="small"
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
                    {activeStep === 2 ? 'Close' : 'Cancel'}
                </Button>

                {activeStep === 0 && (
                    <Button
                        variant="contained"
                        onClick={handleRunMrp}
                        disabled={loading}
                        size="small"
                        startIcon={loading ? <CircularProgress size={16} /> : <PlayIcon sx={{ fontSize: '1rem' }} />}
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
                        {loading ? 'Starting...' : 'Run MRP'}
                    </Button>
                )}

                {activeStep === 1 && (
                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        disabled={loading}
                        size="small"
                        startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
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
                        New MRP Run
                    </Button>
                )}

                {activeStep === 2 && (
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            onClick={handleReset}
                            size="small"
                            startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
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
                            New MRP Run
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
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
                            onClick={() => {
                                // Handle export functionality
                                showNotification('Export functionality coming soon', 'info');
                            }}
                        >
                            Export Report
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default MrpRun;