// EditDefectCode.jsx - Fixed version with proper ID handling
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Alert,
    Typography,
    Box,
    MenuItem,
    FormControl,
    Select,
    Chip,
    OutlinedInput,
    FormHelperText,
    Switch,
    FormControlLabel,
    IconButton,
    CircularProgress,
    Grid,
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
    Close as CloseIcon,
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
    Info as InfoIcon,
    Build as BuildIcon,
    Image as ImageIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Color constants matching your design system
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
    border: '#E3E8EF'
};

// Updated defect categories matching Add form
const DEFECT_CATEGORIES = [
    'Dimensional',
    'Visual/Surface',
    'Material',
    'Functional',
    'Process',
    'Quantity',
    'Documentation'
];

const SEVERITY_LEVELS = [
    'Critical',
    'Major',
    'Minor'
];

// Steps for stepper
const steps = [
    'Basic Information',
    'Processes & Description',
    'Image & Review'
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

const EditDefectCode = ({ open, onClose, defectCode, onUpdate }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [processes, setProcesses] = useState([]);
    const [loadingProcesses, setLoadingProcesses] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [stepErrors, setStepErrors] = useState({});

    const [formData, setFormData] = useState({
        defect_name: "",
        defect_category: "",
        defect_description: "",
        applicable_processes: [], // This stores ONLY ObjectIds
        severity_default: "Major",
        photo_reference: "",
        is_active: true,
        image: null
    });

    const [touched, setTouched] = useState({
        defect_name: false,
        defect_category: false,
        defect_description: false
    });

    // Fetch processes from API
    useEffect(() => {
        if (open) {
            fetchProcesses();
        }
    }, [open]);

    const fetchProcesses = async () => {
        try {
            setLoadingProcesses(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/processes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setProcesses(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching processes:', err);
        } finally {
            setLoadingProcesses(false);
        }
    };

    useEffect(() => {
        if (defectCode && processes.length > 0) {
            // Extract process IDs from applicable_processes
            let processesIds = [];
            if (defectCode.applicable_processes && Array.isArray(defectCode.applicable_processes)) {
                processesIds = defectCode.applicable_processes.map(p => {
                    // If it's already an ID string, use it
                    if (typeof p === 'string') {
                        return p;
                    }
                    // If it's an object with _id, extract it
                    if (typeof p === 'object' && p._id) {
                        return p._id;
                    }
                    // If it's a name, find the matching ID from processes list
                    if (typeof p === 'string' && processes.length > 0) {
                        const foundProcess = processes.find(proc => 
                            proc.process_name === p || proc.process_id === p
                        );
                        return foundProcess ? foundProcess._id : null;
                    }
                    return null;
                }).filter(id => id !== null); // Remove any null values
            }

            setFormData({
                defect_name: defectCode.defect_name || "",
                defect_category: defectCode.defect_category || "",
                defect_description: defectCode.defect_description || "",
                applicable_processes: processesIds, // Store ONLY IDs
                severity_default: defectCode.severity_default || "Major",
                photo_reference: defectCode.photo_reference || "",
                is_active: defectCode.is_active !== undefined ? defectCode.is_active : true,
                image: null
            });

            // Set image preview if photo_reference exists
            if (defectCode.photo_reference) {
                const fullImageUrl = defectCode.photo_reference.startsWith('http')
                    ? defectCode.photo_reference
                    : `${BASE_URL}${defectCode.photo_reference}`;
                setImagePreview(fullImageUrl);
            } else {
                setImagePreview(null);
            }

            setError("");
            setIsImageChanged(false);
            setActiveStep(0);

            // Reset touched states
            setTouched({
                defect_name: false,
                defect_category: false,
                defect_description: false
            });

            setStepErrors({});
        }
    }, [defectCode, processes]); // Add processes as dependency

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            setTouched(prev => ({
                ...prev,
                [name]: false
            }));
        }

        if (error) setError("");
        if (stepErrors[activeStep]) {
            setStepErrors(prev => ({ ...prev, [activeStep]: false }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSwitchChange = (e) => {
        setFormData(prev => ({
            ...prev,
            is_active: e.target.checked
        }));
    };

    const handleProcessesChange = (event) => {
        const selectedIds = event.target.value; // This gives array of IDs
        setFormData(prev => ({
            ...prev,
            applicable_processes: selectedIds // Store only IDs for API
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Only JPEG, PNG, GIF, and WEBP images are allowed');
                return;
            }

            setSelectedImage(file);
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setIsImageChanged(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            image: null,
            photo_reference: ''
        }));
        setIsImageChanged(true);
    };

    // Validate current step
    const validateStep = (step) => {
        switch (step) {
            case 0: // Basic Information
                if (!formData.defect_name || !formData.defect_name.trim()) {
                    setError('Defect name is required');
                    setTouched(prev => ({ ...prev, defect_name: true }));
                    setStepErrors(prev => ({ ...prev, [step]: true }));
                    return false;
                }
                if (!formData.defect_category) {
                    setError('Defect category is required');
                    setTouched(prev => ({ ...prev, defect_category: true }));
                    setStepErrors(prev => ({ ...prev, [step]: true }));
                    return false;
                }
                setError('');
                setStepErrors(prev => ({ ...prev, [step]: false }));
                return true;

            case 1: // Processes & Description
                if (!formData.defect_description || !formData.defect_description.trim()) {
                    setError('Defect description is required');
                    setTouched(prev => ({ ...prev, defect_description: true }));
                    setStepErrors(prev => ({ ...prev, [step]: true }));
                    return false;
                }
                setError('');
                setStepErrors(prev => ({ ...prev, [step]: false }));
                return true;

            case 2: // Image & Review
                return true;

            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setError('');
    };

    const handleSubmit = async () => {
        // Validate all steps before submit
        const isStep0Valid = validateStep(0);
        const isStep1Valid = validateStep(1);

        if (!isStep0Valid || !isStep1Valid) {
            setError('Please complete all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            let response;

            // Ensure applicable_processes contains only IDs
            const applicableProcessesIds = formData.applicable_processes || [];

            if (isImageChanged) {
                const formDataToSend = new FormData();
                formDataToSend.append('defect_name', formData.defect_name.trim());
                formDataToSend.append('defect_category', formData.defect_category);
                formDataToSend.append('defect_description', formData.defect_description.trim());

                // Send IDs as JSON string
                if (applicableProcessesIds && applicableProcessesIds.length > 0) {
                    formDataToSend.append('applicable_processes', JSON.stringify(applicableProcessesIds));
                } else {
                    formDataToSend.append('applicable_processes', '');
                }

                if (formData.severity_default) {
                    formDataToSend.append('severity_default', formData.severity_default);
                } else {
                    formDataToSend.append('severity_default', '');
                }

                formDataToSend.append('is_active', formData.is_active);

                if (formData.image) {
                    formDataToSend.append('image', formData.image);
                } else if (!formData.photo_reference && !formData.image) {
                    formDataToSend.append('image', '');
                }

                response = await axios.put(
                    `${BASE_URL}/api/defect-codes/${defectCode._id}`,
                    formDataToSend,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                response = await axios.put(
                    `${BASE_URL}/api/defect-codes/${defectCode._id}`,
                    {
                        defect_name: formData.defect_name.trim(),
                        defect_category: formData.defect_category,
                        defect_description: formData.defect_description.trim(),
                        applicable_processes: applicableProcessesIds, // Send only IDs
                        severity_default: formData.severity_default,
                        photo_reference: formData.photo_reference || null,
                        is_active: formData.is_active
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            if (response.data.success) {
                onUpdate(response.data.data);
                onClose();
            } else {
                setError(response.data.message || 'Failed to update defect code');
            }
        } catch (err) {
            console.error('Error updating defect code:', err);

            if (err.response?.status === 409) {
                setError('A defect code with this name already exists');
            } else if (err.response?.status === 404) {
                setError('Defect code not found');
            } else {
                setError(err.response?.data?.message || 'Failed to update defect code. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            fontSize: '0.75rem',
            '&:hover fieldset': {
                borderColor: COLORS.primary,
            },
            '&.Mui-focused fieldset': {
                borderColor: COLORS.primary,
                borderWidth: 1
            }
        },
        '& .MuiInputBase-input': {
            py: 1,
            px: 1.5,
            fontSize: '0.75rem',
            color: COLORS.text.primary,
            '&::placeholder': {
                color: COLORS.text.tertiary,
                fontSize: '0.75rem'
            }
        }
    };

    const labelStyle = {
        fontSize: '0.7rem',
        fontWeight: 600,
        color: COLORS.text.secondary,
        letterSpacing: '0.5px',
        mb: 0.5
    };

    // Render step content
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={2}>
                        {/* Status Toggle */}
                        <Paper sx={{
                            p: 1.5,
                            bgcolor: COLORS.background.light,
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                    Status
                                </Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                    {formData.is_active ? 'Active - Can be used in quality checks' : 'Inactive - Cannot be used in quality checks'}
                                </Typography>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_active}
                                        onChange={handleSwitchChange}
                                        disabled={loading}
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
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                        {formData.is_active ? 'Active' : 'Inactive'}
                                    </Typography>
                                }
                            />
                        </Paper>

                        {/* Basic Information */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 2
                            }}>
                                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Basic Information
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>DEFECT CODE</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={defectCode?.defect_code || ''}
                                            disabled
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>DEFECT NAME <span style={{ color: '#EF4444' }}>*</span></Typography>
                                        <TextField
                                            fullWidth
                                            name="defect_name"
                                            value={formData.defect_name}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('defect_name')}
                                            disabled={loading}
                                            placeholder="Enter defect name"
                                            size="small"
                                            error={touched.defect_name && !formData.defect_name}
                                            helperText={touched.defect_name && !formData.defect_name ? 'Defect name is required' : ''}
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>DEFECT CATEGORY <span style={{ color: '#EF4444' }}>*</span></Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            name="defect_category"
                                            value={formData.defect_category}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('defect_category')}
                                            disabled={loading}
                                            size="small"
                                            error={touched.defect_category && !formData.defect_category}
                                            helperText={touched.defect_category && !formData.defect_category ? 'Defect category is required' : ''}
                                            sx={inputStyle}
                                        >
                                            {DEFECT_CATEGORIES.map((category) => (
                                                <MenuItem key={category} value={category} sx={{ fontSize: '0.75rem' }}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>DEFAULT SEVERITY</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            name="severity_default"
                                            value={formData.severity_default}
                                            onChange={handleChange}
                                            disabled={loading}
                                            size="small"
                                            sx={inputStyle}
                                        >
                                            {SEVERITY_LEVELS.map((severity) => (
                                                <MenuItem key={severity} value={severity} sx={{ fontSize: '0.75rem' }}>
                                                    {severity}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Stack>
                );

            case 1:
                return (
                    <Stack spacing={2}>
                        {/* Processes & Description */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 2
                            }}>
                                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Processes & Description
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>APPLICABLE PROCESSES</Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                multiple
                                                value={formData.applicable_processes || []}
                                                onChange={handleProcessesChange}
                                                disabled={loadingProcesses || loading}
                                                input={<OutlinedInput sx={inputStyle} />}
                                                renderValue={(selectedIds) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selectedIds.map((id) => {
                                                            const process = processes.find(p => p._id === id);
                                                            return process ? (
                                                                <Chip
                                                                    key={id}
                                                                    label={process.process_name}
                                                                    size="small"
                                                                    sx={{
                                                                        fontSize: '0.65rem',
                                                                        height: 22,
                                                                        bgcolor: COLORS.primaryLight,
                                                                        color: COLORS.primary,
                                                                    }}
                                                                />
                                                            ) : null;
                                                        })}
                                                    </Box>
                                                )}
                                            >
                                                {loadingProcesses ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} />
                                                    </MenuItem>
                                                ) : (
                                                    processes.map((process) => (
                                                        <MenuItem
                                                            key={process._id}
                                                            value={process._id}
                                                            sx={{ fontSize: '0.75rem' }}
                                                        >
                                                            {process.process_name} ({process.process_id})
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            <FormHelperText sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                                Select one or more processes where this defect can occur
                                            </FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography sx={labelStyle}>DEFECT DESCRIPTION <span style={{ color: '#EF4444' }}>*</span></Typography>
                                        <TextField
                                            fullWidth
                                            name="defect_description"
                                            value={formData.defect_description}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('defect_description')}
                                            multiline
                                            rows={4}
                                            disabled={loading}
                                            placeholder="Describe the defect in detail, including characteristics, measurement methods, acceptance criteria, etc."
                                            size="small"
                                            error={touched.defect_description && !formData.defect_description}
                                            helperText={touched.defect_description && !formData.defect_description ? 'Defect description is required' : ''}
                                            sx={inputStyle}
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
                        {/* Image Upload */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.white,
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: 'none'
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 2
                            }}>
                                <ImageIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Reference Image
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ mt: 1 }}>
                                        {!imagePreview ? (
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{
                                                    height: 36,
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontSize: '0.75rem',
                                                    borderColor: COLORS.border,
                                                    color: COLORS.text.secondary,
                                                    '&:hover': {
                                                        borderColor: COLORS.primary,
                                                        bgcolor: `${COLORS.primary}10`
                                                    }
                                                }}
                                            >
                                                Upload Image (JPEG, PNG, GIF, WEBP, max 5MB)
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                                    onChange={handleImageChange}
                                                />
                                            </Button>
                                        ) : (
                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '150px',
                                                        borderRadius: '8px',
                                                        border: `1px solid ${COLORS.border}`
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={removeImage}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        bgcolor: '#EF4444',
                                                        color: 'white',
                                                        '&:hover': {
                                                            bgcolor: '#DC2626'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 1 }}>
                                        Optional: Upload a reference image (JPEG, PNG, GIF, WEBP, max 5MB)
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Review Information */}
                        <Paper sx={{
                            p: 2,
                            bgcolor: COLORS.background.light,
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`
                        }}>
                            <Typography sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1
                            }}>
                                Ready to Update?
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                                Please review the information before updating. Click "Update" to save changes.
                            </Typography>
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
            onClose={onClose}
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
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    Edit Defect Code
                </Typography>
                <IconButton
                    size="small"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        color: COLORS.text.tertiary,
                        '&:hover': { color: COLORS.text.secondary }
                    }}
                >
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
            </DialogTitle>

            {/* Stepper */}
            <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    connector={<ColorConnector />}
                >
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel error={stepErrors[index]}>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
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
                            borderRadius: 1.5,
                            mt: 2,
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
                        onClick={onClose}
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
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
                            sx={{
                                height: 32,
                                px: 2,
                                borderRadius: 1.5,
                                bgcolor: COLORS.primary,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': { bgcolor: COLORS.primaryDark },
                                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
                            }}
                        >
                            {loading ? 'Updating...' : 'Update'}
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

export default EditDefectCode;