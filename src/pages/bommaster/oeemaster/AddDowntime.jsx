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
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Chip,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    Add as AddIcon,
    Schedule as ScheduleIcon,
    Build as BuildIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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

// Updated downtime types
const DOWNTIME_TYPES = [
    'Breakdown',
    'Planned Maintenance',
    'Setup',
    'Quality Hold',
    'No Material',
    'Other'
];

const AddDowntime = ({ open, onClose, onAdd, oeeRecordId, machineName, recordDate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [calculatedData, setCalculatedData] = useState(null);

    const [formData, setFormData] = useState({
        type: '',
        otherTypeDescription: '',
        start_time: null,  // Initially null/blank
        end_time: null,    // Initially null/blank
        root_cause: '',
        action_taken: ''
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    const resetForm = () => {
        setFormData({
            type: '',
            otherTypeDescription: '',
            start_time: null,
            end_time: null,
            root_cause: '',
            action_taken: ''
        });
        setCalculatedData(null);
        setFieldErrors({});
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
        setCalculatedData(null);
    };

    const handleDateTimeChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
        setCalculatedData(null);
    };

    const calculateDuration = () => {
        if (formData.start_time && formData.end_time) {
            const durationMs = new Date(formData.end_time) - new Date(formData.start_time);
            const durationMin = durationMs / (1000 * 60);
            return Math.round(durationMin * 10) / 10;
        }
        return 0;
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.type) {
            errors.type = 'Downtime type is required';
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

        if (formData.start_time && formData.end_time) {
            const start = new Date(formData.start_time);
            const end = new Date(formData.end_time);

            if (end <= start) {
                errors.end_time = 'End time must be after start time';
                isValid = false;
            }

            // Optional: Check if end time is not too far in the future
            //   const now = new Date();
            //   if (end > now) {
            //     errors.end_time = 'End time cannot be in the future';
            //     isValid = false;
            //   }
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setError('Please fix the errors above');
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

            // Prepare type value - add description if "Other"
            let typeValue = formData.type;
            if (formData.type === 'Other' && formData.otherTypeDescription) {
                typeValue = `Other: ${formData.otherTypeDescription}`;
            }

            const submitData = {
                oee_record_id: oeeRecordId,
                type: formData.type,
                start_time: new Date(formData.start_time).toISOString(),
                end_time: new Date(formData.end_time).toISOString(),
                root_cause: formData.root_cause || '',
                action_taken: formData.action_taken || ''
            };

            const response = await axios.post(`${BASE_URL}/api/downtime-logs`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setCalculatedData(response.data.data);

                // Call onAdd with the response data
                if (onAdd) {
                    onAdd(response.data.data);
                }

                // Auto close after 3 seconds
                setTimeout(() => {
                    handleClose();
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to log downtime');
            }
        } catch (err) {
            console.error('Error logging downtime:', err);
            setError(err.response?.data?.message || 'Failed to log downtime. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const duration = calculateDuration();
    const getTypeColor = (type) => {
        if (type === 'Breakdown') return COLORS.error;
        if (type === 'Setup' || type === 'Quality Hold') return COLORS.warning;
        if (type === 'Planned Maintenance') return COLORS.primary;
        // Handle "Other" and custom types
        if (type?.startsWith('Other')) return COLORS.info;
        return COLORS.text.secondary;
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
                            Log Downtime Event
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
                    <Stack spacing={2.5}>
                        {/* OEE Record Info */}
                        {(machineName || recordDate) && (
                            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                                    OEE Record Information
                                </Typography>
                                <Grid container spacing={1}>
                                    {machineName && (
                                        <>
                                            <Grid size={{ xs: 4 }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Machine:</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 8 }}>
                                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{machineName}</Typography>
                                            </Grid>
                                        </>
                                    )}
                                    {recordDate && (
                                        <>
                                            <Grid size={{ xs: 4 }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Record Date:</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 8 }}>
                                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                    {new Date(recordDate).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Paper>
                        )}

                        {/* Downtime Details Form */}
                        <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Downtime Details
                            </Typography>

                            <Grid container spacing={2}>
                                {/* Downtime Type Select */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography sx={labelStyle}>Downtime Type *</Typography>
                                    <FormControl fullWidth size="small" error={!!fieldErrors.type}>
                                        <Select
                                            name="type"
                                            value={formData.type}
                                            onChange={(e) => {
                                                handleChange(e);
                                                // Clear other description when changing from Other to something else
                                                if (e.target.value !== 'Other') {
                                                    setFormData(prev => ({ ...prev, otherTypeDescription: '' }));
                                                }
                                            }}
                                            sx={inputStyle}
                                        >
                                            {/* <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select downtime type</MenuItem> */}
                                            {DOWNTIME_TYPES.map((type) => (
                                                <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {type === 'Breakdown'}
                                                        <span>{type}</span>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {fieldErrors.type && (
                                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                                                {fieldErrors.type}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Dynamic field for Other type description */}
                                {formData.type === 'Other' && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography sx={labelStyle}>Please Specify Downtime Type *</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="otherTypeDescription"
                                            value={formData.otherTypeDescription}
                                            onChange={handleChange}
                                            placeholder="Enter the specific downtime type..."
                                            error={!!fieldErrors.otherTypeDescription}
                                            helperText={fieldErrors.otherTypeDescription}
                                            sx={inputStyle}
                                        />
                                    </Grid>
                                )}

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography sx={labelStyle}>Start Time *</Typography>
                                    <TextField
                                        type="datetime-local"
                                        fullWidth
                                        size="small"
                                        name="start_time"
                                        value={formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => handleDateTimeChange('start_time', e.target.value ? new Date(e.target.value) : null)}
                                        error={!!fieldErrors.start_time}
                                        helperText={fieldErrors.start_time}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: 32,
                                                borderRadius: 1,
                                                fontSize: '0.7rem',
                                            },
                                            '& .MuiInputBase-input': {
                                                py: 0.5,
                                                px: 1,
                                                fontSize: '0.7rem',
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography sx={labelStyle}>End Time *</Typography>
                                    <TextField
                                        type="datetime-local"
                                        fullWidth
                                        size="small"
                                        name="start_time"
                                        value={formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => handleDateTimeChange('start_time', e.target.value ? new Date(e.target.value) : null)}
                                        error={!!fieldErrors.start_time}
                                        helperText={fieldErrors.start_time}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: 32,
                                                borderRadius: 1,
                                                fontSize: '0.7rem',
                                            },
                                            '& .MuiInputBase-input': {
                                                py: 0.5,
                                                px: 1,
                                                fontSize: '0.7rem',
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography sx={labelStyle}>Root Cause</Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        name="root_cause"
                                        value={formData.root_cause}
                                        onChange={handleChange}
                                        placeholder="What caused this downtime?"
                                        sx={inputStyle}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography sx={labelStyle}>Action Taken</Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        name="action_taken"
                                        value={formData.action_taken}
                                        onChange={handleChange}
                                        placeholder="What action was taken to resolve it?"
                                        sx={inputStyle}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Duration Preview - only show if both times are selected */}
                        {formData.type && formData.start_time && formData.end_time && duration > 0 && (
                            <Paper sx={{
                                p: 2,
                                bgcolor: getTypeColor(formData.type) + '10',
                                borderRadius: 1.5,
                                border: `1px solid ${getTypeColor(formData.type)}30`
                            }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: getTypeColor(formData.type), mb: 1 }}>
                                    Downtime Summary
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Type:</Typography>
                                        <Chip
                                            label={formData.type}
                                            size="small"
                                            sx={{
                                                bgcolor: getTypeColor(formData.type),
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                height: 24,
                                                mt: 0.5
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Duration:</Typography>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: getTypeColor(formData.type) }}>
                                            {duration} minutes
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        )}

                        {/* Impact Preview after submission */}
                        {calculatedData && (
                            <Alert
                                severity="info"
                                sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                                icon={<CheckCircleIcon />}
                            >
                                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                                    Downtime logged successfully! OEE has been recomputed.
                                </Typography>
                                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Duration:</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                            {calculatedData.duration_min} min
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Downtime:</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                            {calculatedData.total_downtime_min} min
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Updated OEE:</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                                            {calculatedData.updated_oee}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Updated Availability:</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                            {calculatedData.updated_availability}%
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
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
                    justifyContent: 'flex-end',
                    gap: 1
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
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || !formData.type || !formData.start_time || !formData.end_time}
                        startIcon={loading ? <CircularProgress size={16} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
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
                        {loading ? 'Logging...' : 'Log Downtime'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default AddDowntime;