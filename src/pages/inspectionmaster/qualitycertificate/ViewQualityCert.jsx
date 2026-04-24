// ViewQualityCert.jsx
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
    Divider,
    IconButton,
    Avatar,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled,
    Tooltip,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {
    Close as CloseIcon,
    Description as DescriptionIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
    Info as InfoIcon,
    Category as CategoryIcon,
    Timeline as TimelineIcon,
    CheckCircle as CheckCircleIcon,
    Assignment as AssignmentIcon,
    Verified as VerifiedIcon,
    LocalShipping as LocalShippingIcon,
    QrCode as QrCodeIcon,
    Rule as RuleIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import axios from 'axios';
import BASE_URL from "../../../config/Config";

// Color constants
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
    border: '#E3E8EF',
    status: {
        'Pass': '#10B981',
        'Fail': '#EF4444',
        'Warning': '#F59E0B'
    }
};

// Steps for stepper
const steps = [
    'Certificate Information',
    'Actual Measurements',
    'Audit Information'
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

const ViewQualityCert = ({ open, onClose, certId }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [certData, setCertData] = useState(null);

    const [referenceDetails, setReferenceDetails] = useState({
        wo_number: null,
        so_number: null,
        dc_number: null
    });

    useEffect(() => {
        if (open && certId) {
            fetchCertificateDetails();
        }
    }, [open, certId]);

    const fetchCertificateDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/quality-certificates/${certId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCertData(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch certificate details');
            }
        } catch (err) {
            console.error('Error fetching certificate details:', err);
            setError(err.response?.data?.message || 'Failed to fetch certificate details');
        } finally {
            setLoading(false);
        }
    };

    const fetchReferenceDetails = async (cert) => {
        const token = localStorage.getItem('token');
        const details = { wo_number: null, so_number: null, dc_number: null };

        // Fetch WO details if wo_id is a string (MongoDB ID)
        if (cert.wo_id && typeof cert.wo_id === 'string' && cert.wo_id.length === 24) {
            try {
                const response = await axios.get(`${BASE_URL}/api/work-orders/${cert.wo_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    details.wo_number = response.data.data.wo_number;
                }
            } catch (err) {
                console.error('Error fetching WO details:', err);
            }
        } else if (cert.wo_id && cert.wo_id.wo_number) {
            details.wo_number = cert.wo_id.wo_number;
        }

        // Fetch SO details if so_id is a string (MongoDB ID)
        if (cert.so_id && typeof cert.so_id === 'string' && cert.so_id.length === 24) {
            try {
                const response = await axios.get(`${BASE_URL}/api/sales-orders/${cert.so_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            if (response.data.success) {
                details.so_number = response.data.data.so_number;
            }
        } catch (err) {
            console.error('Error fetching SO details:', err);
        }
    } else if (cert.so_id && cert.so_id.so_number) {
        details.so_number = cert.so_id.so_number;
    }

    // Fetch DC details if dc_id is a string (MongoDB ID)
    if (cert.dc_id && typeof cert.dc_id === 'string' && cert.dc_id.length === 24) {
        try {
            const response = await axios.get(`${BASE_URL}/api/delivery-challans/${cert.dc_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        if (response.data.success) {
            details.dc_number = response.data.data.dc_number;
        }
    } catch (err) {
        console.error('Error fetching DC details:', err);
    }
} else if (cert.dc_id && cert.dc_id.dc_number) {
    details.dc_number = cert.dc_id.dc_number;
}

setReferenceDetails(details);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch (e) {
        return '-';
    }
};

const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
        return '-';
    }
};

const getCertInitials = (certId) => {
    if (!certId) return 'QC';
    const parts = certId.split('-');
    if (parts.length >= 2) {
        return `${parts[0]}${parts[1]}`.toUpperCase();
    }
    return certId.substring(0, 2).toUpperCase();
};

const getAvatarColor = () => {
    return COLORS.primary;
};

const getResultColor = (result) => {
    return COLORS.status[result] || COLORS.text.secondary;
};

const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
};

const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
};

// Helper function to get readable reference value
const getReferenceLabel = (ref) => {
    if (!ref) return '-';
    if (typeof ref === 'object') {
        return ref.so_number || ref.wo_number || ref.dc_number || ref._id;
    }
    return ref;
};

const renderStepContent = (step) => {
    if (!certData) return null;

    switch (step) {
        case 0:
            return (
                <Stack spacing={2}>
                    {/* Status Banner */}
                    <Paper sx={{
                        p: 1.5,
                        bgcolor: COLORS.primaryLight,
                        borderRadius: 2,
                        border: `1px solid ${COLORS.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <DescriptionIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.primary }}>
                                Quality Certificate
                            </Typography>
                        </Stack>
                    </Paper>

                    {/* Header Section */}
                    <Paper sx={{
                        p: 2,
                        bgcolor: COLORS.background.light,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`
                    }}>
                        <Typography sx={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: COLORS.primary,
                            mb: 1.5
                        }}>
                            <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Certificate Header
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Certificate Number</Typography>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                                            {certData.cert_id}
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box>
                                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Issue Date</Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                            {formatDateOnly(certData.issue_date)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Certificate Type:</Typography>
                                    <Chip
                                        label={certData.cert_type}
                                        size="small"
                                        sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 500,
                                            bgcolor: `${COLORS.primary}15`,
                                            color: COLORS.primary
                                        }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Item Details */}
                    <Paper sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        bgcolor: COLORS.background.white
                    }}>
                        <Typography sx={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: COLORS.primary,
                            mb: 1.5
                        }}>
                            <CategoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Item Details
                        </Typography>
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                    {certData.part_no || '-'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Name</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                    {certData.part_name || '-'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lot/Batch Number</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                    {certData.lot_no || '-'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Quantity</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                    {certData.quantity || 0} units
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Material Grade</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                    {certData.material_grade || '-'}
                                </Typography>
                            </Grid>
                            {certData.heat_no && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Heat Number</Typography>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                        {certData.heat_no}
                                    </Typography>
                                </Grid>
                            )}
                            {certData.mill_cert_ref && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Mill Certificate Reference</Typography>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: COLORS.text.primary }}>
                                        {certData.mill_cert_ref}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>

                    {/* Reference Documents - Only show if IDs are available and not null */}
                   {/* Reference Documents - Only show if references exist */}
{(certData.so_id || certData.wo_id || certData.dc_id || certData.customer_po_number) && (
  <Paper sx={{ 
    p: 2, 
    borderRadius: 1.5, 
    border: `1px solid ${COLORS.border}`,
    bgcolor: COLORS.background.white
  }}>
    <Typography sx={{ 
      fontSize: '0.8rem', 
      fontWeight: 600, 
      color: COLORS.primary, 
      mb: 1.5 
    }}>
      <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
      Reference Documents
    </Typography>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {referenceDetails.so_number && (
        <Chip 
          icon={<LocalShippingIcon sx={{ fontSize: '0.7rem' }} />}
          label={`SO: ${referenceDetails.so_number}`}
          size="small"
          sx={{ fontSize: '0.65rem', height: 24 }}
        />
      )}
      {referenceDetails.wo_number && (
        <Chip 
          icon={<QrCodeIcon sx={{ fontSize: '0.7rem' }} />}
          label={`WO: ${referenceDetails.wo_number}`}
          size="small"
          sx={{ fontSize: '0.65rem', height: 24 }}
        />
      )}
      {referenceDetails.dc_number && (
        <Chip 
          icon={<DescriptionIcon sx={{ fontSize: '0.7rem' }} />}
          label={`DC: ${referenceDetails.dc_number}`}
          size="small"
          sx={{ fontSize: '0.65rem', height: 24 }}
        />
      )}
      {certData.customer_po_number && (
        <Chip 
          icon={<AssignmentIcon sx={{ fontSize: '0.7rem' }} />}
          label={`PO: ${certData.customer_po_number}`}
          size="small"
          sx={{ fontSize: '0.65rem', height: 24 }}
        />
      )}
    </Box>
  </Paper>
)}

                    {/* Declaration - Only show if declaration exists in backend */}
                    {certData.declaration && certData.declaration !== 'We hereby certify that the above goods conform to all specified requirements.' && (
                        <Paper sx={{
                            p: 2,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            bgcolor: COLORS.background.white
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1.5
                            }}>
                                <VerifiedIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Declaration
                            </Typography>
                            <Paper sx={{
                                p: 1.5,
                                bgcolor: COLORS.background.light,
                                borderRadius: 1.5,
                                border: `1px solid ${COLORS.border}`
                            }}>
                                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.6, fontStyle: 'italic' }}>
                                    {certData.declaration}
                                </Typography>
                            </Paper>
                        </Paper>
                    )}
                </Stack>
            );

        case 1:
            return (
                <Stack spacing={2}>
                    {/* Actual Measurements */}
                    <Paper sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        bgcolor: COLORS.background.white
                    }}>
                        <Typography sx={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: COLORS.primary,
                            mb: 2
                        }}>
                            <RuleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Actual Measurements
                        </Typography>

                        {certData.actual_values && certData.actual_values.length > 0 ? (
                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1.5 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: COLORS.background.light }}>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Characteristic</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Specification</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Nominal</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Tolerance (±)</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Measured</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {certData.actual_values.map((item, idx) => {
                                            const tolerance = item.usl && item.lsl
                                                ? `${item.lsl} to ${item.usl}`
                                                : item.nominal
                                                    ? `±${(item.usl - item.nominal) / 2}`
                                                    : '-';

                                            return (
                                                <TableRow key={idx} hover>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.characteristic}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.specification || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.nominal || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{tolerance}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{item.measured_value || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit || '-'}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={item.result || 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.6rem',
                                                                height: 20,
                                                                bgcolor: `${getResultColor(item.result)}20`,
                                                                color: getResultColor(item.result)
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Paper sx={{
                                p: 3,
                                textAlign: 'center',
                                bgcolor: COLORS.background.light,
                                borderRadius: 1.5,
                                border: `1px solid ${COLORS.border}`
                            }}>
                                <AssignmentIcon sx={{ fontSize: '2rem', color: COLORS.text.tertiary, mb: 1 }} />
                                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                                    No measurement data available
                                </Typography>
                            </Paper>
                        )}
                    </Paper>

                    {/* Summary Statistics */}
                    {certData.actual_values && certData.actual_values.length > 0 && (
                        <Paper sx={{
                            p: 2,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.border}`,
                            bgcolor: COLORS.background.white
                        }}>
                            <Typography sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1.5
                            }}>
                                <TimelineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Inspection Summary
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Total Checks</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.text.primary }}>
                                            {certData.actual_values.length}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Passed</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.status.Pass }}>
                                            {certData.actual_values.filter(i => i.result === 'Pass').length}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Failed</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.status.Fail }}>
                                            {certData.actual_values.filter(i => i.result === 'Fail').length}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Pass Rate</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                                            {Math.round((certData.actual_values.filter(i => i.result === 'Pass').length / certData.actual_values.length) * 100)}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Stack>
            );

        case 2:
            return (
                <Stack spacing={2}>
                    {/* Audit Information */}
                    <Paper sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        bgcolor: COLORS.background.white
                    }}>
                        <Typography sx={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: COLORS.primary,
                            mb: 1.5
                        }}>
                            <TimelineIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Audit Information
                        </Typography>
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Generated By</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                                        {certData.created_by?.Username || certData.created_by?.name || 'System'}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Generated At</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                                        {formatDate(certData.createdAt)}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Completion Note */}
                    <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            This certificate is officially generated by the quality management system.
                        </Typography>
                    </Alert>
                </Stack>
            );

        default:
            return null;
    }
};

if (!open) return null;

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
                overflow: 'hidden',
                maxHeight: '90vh'
            }
        }}
    >
        {/* Header */}
        <DialogTitle sx={{
            borderBottom: `1px solid ${COLORS.border}`,
            py: 1.5,
            px: 2.5,
            bgcolor: COLORS.background.white,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: getAvatarColor(),
                        fontSize: '0.8rem',
                        fontWeight: 600
                    }}
                >
                    {certData ? getCertInitials(certData.cert_id) : 'QC'}
                </Avatar>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    Quality Certificate Details
                </Typography>
                {certData && (
                    <Chip
                        label={certData.cert_id}
                        size="small"
                        sx={{
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary,
                            ml: 1,
                            fontFamily: 'monospace'
                        }}
                    />
                )}
            </Stack>
            <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
            </IconButton>
        </DialogTitle>

        {/* Stepper */}
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                                {label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>

        {/* Content */}
        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
                        Loading certificate details...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                    {error}
                </Alert>
            ) : certData ? (
                renderStepContent(activeStep)
            ) : null}
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white,
            justifyContent: 'space-between'
        }}>
            <Button
                onClick={handleBack}
                disabled={activeStep === 0}
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
                    Close
                </Button>

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={onClose}
                        size="small"
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
                        Done
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleNext}
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

export default ViewQualityCert;