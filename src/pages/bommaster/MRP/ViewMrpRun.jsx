// ViewMrpRun.jsx - Restyled with Stepper UI
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Factory as FactoryIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  ProductionQuantityLimits as ProductionIcon
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
  border: '#E3E8EF',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#3B82F6'
};

const steps = [
  'Run Information',
  'Configuration Details',
  'MRP Results',
  'Recommendations'
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

// Helper function to safely get display value
const getDisplayValue = (value) => {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.name || value.username || value.userName || value._id || '-';
  }
  return String(value);
};

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Completed':
        return { bg: '#D1FAE5', color: '#059669', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'Running':
        return { bg: '#DBEAFE', color: '#2563EB', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'Failed':
        return { bg: '#FEE2E2', color: '#DC2626', icon: <ErrorIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'Queued':
        return { bg: '#FEF3C7', color: '#D97706', icon: <ScheduleIcon sx={{ fontSize: '0.7rem' }} /> };
      default:
        return { bg: '#F1F5F9', color: '#475569', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> };
    }
  };

  const config = getStatusConfig();
  return (
    <Chip
      icon={config.icon}
      label={status}
      size="small"
      sx={{ fontSize: '0.7rem', fontWeight: 500, bgcolor: config.bg, color: config.color }}
    />
  );
};

// Run Type Chip Component
const RunTypeChip = ({ runType }) => {
  const getTypeConfig = () => {
    switch (runType) {
      case 'Full':
        return { bg: '#E8F0F1', color: COLORS.primary };
      case 'Incremental':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Item-Specific':
        return { bg: '#DBEAFE', color: '#2563EB' };
      default:
        return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const config = getTypeConfig();
  return (
    <Chip
      label={runType}
      size="small"
      sx={{ fontSize: '0.7rem', fontWeight: 500, bgcolor: config.bg, color: config.color }}
    />
  );
};

// Action Chip Component
const ActionChip = ({ action }) => {
  const getActionColor = () => {
    switch (action) {
      case 'Create PO':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Create WO':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Reschedule':
        return { bg: '#E0E7FF', color: '#4F46E5' };
      default:
        return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const colorConfig = getActionColor();
  return (
    <Chip
      label={action}
      size="small"
      sx={{ fontSize: '0.65rem', height: 24, bgcolor: colorConfig.bg, color: colorConfig.color }}
    />
  );
};

// Source Chip Component
const SourceChip = ({ source }) => {
  const getSourceColor = () => {
    switch (source) {
      case 'Purchase':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Manufacture':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Subcontract':
        return { bg: '#E0E7FF', color: '#4F46E5' };
      default:
        return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const colorConfig = getSourceColor();
  return (
    <Chip
      label={source}
      size="small"
      sx={{ fontSize: '0.65rem', height: 22, bgcolor: colorConfig.bg, color: colorConfig.color }}
    />
  );
};

const ViewMrpRun = ({ open, onClose, mrpRunId, onRerun }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mrpRun, setMrpRun] = useState(null);
  const [triggeredByUser, setTriggeredByUser] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (open && mrpRunId) {
      fetchMrpRunDetails();
      setActiveStep(0);
    }
  }, [open, mrpRunId]);

  useEffect(() => {
    if (mrpRun) {
      fetchRelatedData();
    }
  }, [mrpRun]);

  const fetchMrpRunDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/mrp/runs/${mrpRunId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMrpRun(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load MRP run details');
      }
    } catch (err) {
      console.error('Error fetching MRP run details:', err);
      setError(err.response?.data?.message || 'Failed to load MRP run details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    if (!mrpRun) return;
    
    setLoadingDetails(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const triggeredById = mrpRun.triggered_by?._id || mrpRun.triggered_by;
      if (triggeredById && triggeredById !== 'system') {
        try {
          const userResponse = await axios.get(
            `${BASE_URL}/api/users/${triggeredById}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (userResponse.data.success) {
            setTriggeredByUser(userResponse.data.data);
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
        }
      }
      
      if (mrpRun.job_id) {
        try {
          const jobResponse = await axios.get(
            `${BASE_URL}/api/jobs/${mrpRun.job_id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (jobResponse.data.success) {
            setJobDetails(jobResponse.data.data);
          }
        } catch (err) {
          console.error('Error fetching job details:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching related data:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRerun = () => {
    if (onRerun && mrpRun) {
      onRerun(mrpRun);
      onClose();
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getSummaryStats = () => {
    if (!mrpRun?.mrp_lines) {
      return {
        totalItems: 0,
        itemsWithShortfall: 0,
        totalPurchase: 0,
        totalManufacture: 0,
        totalNetRequirement: 0
      };
    }

    const lines = mrpRun.mrp_lines;
    const itemsWithShortfall = lines.filter(l => l.net_requirement > 0).length;
    const totalPurchase = lines.filter(l => l.source === 'Purchase').length;
    const totalManufacture = lines.filter(l => l.source === 'Manufacture').length;
    const totalNetRequirement = lines.reduce((sum, l) => sum + (l.net_requirement > 0 ? l.net_requirement : 0), 0);

    return {
      totalItems: lines.length,
      itemsWithShortfall,
      totalPurchase,
      totalManufacture,
      totalNetRequirement
    };
  };

  const stats = getSummaryStats();

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
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
                MRP Run Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>MRP Run ID</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                        {getDisplayValue(mrpRun?.mrp_run_id)}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Run Type</Typography>
                      <RunTypeChip runType={mrpRun?.run_type} />
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    <StatusChip status={mrpRun?.status} />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Run Details */}
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
                <ScheduleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Run Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Run Date</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(mrpRun?.run_date)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Completed At</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {mrpRun?.completed_at ? formatDateTime(mrpRun.completed_at) : 'In Progress'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planning Horizon</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{mrpRun?.planning_horizon} days</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Last Run Reference</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{getDisplayValue(mrpRun?.last_run_reference) || 'N/A'}</Typography>
                </Grid>
                {mrpRun?.status === 'Running' && (
                  <Grid size={{ xs: 12 }}>
                    <LinearProgress sx={{ height: 4, borderRadius: 2, mt: 1 }} />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
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
                <ProductionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Configuration Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sales Orders</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {mrpRun?.so_ids?.length || 0} order(s) selected
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(mrpRun?.createdAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Triggered By</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {loadingDetails ? (
                      <CircularProgress size={12} />
                    ) : triggeredByUser ? (
                      getDisplayValue(triggeredByUser.name || triggeredByUser.username)
                    ) : (
                      getDisplayValue(mrpRun?.triggered_by?.name || mrpRun?.triggered_by?.username || 'System')
                    )}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Job Reference</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {loadingDetails ? (
                      <CircularProgress size={12} />
                    ) : jobDetails ? (
                      jobDetails.job_name || jobDetails.name || jobDetails.job_type || 'Unknown Job'
                    ) : (
                      getDisplayValue(mrpRun?.job_id)
                    )}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status Message</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
                    {mrpRun?.status === 'Completed' && 'MRP run completed successfully'}
                    {mrpRun?.status === 'Running' && 'MRP run is currently in progress'}
                    {mrpRun?.status === 'Queued' && 'MRP run is queued and waiting to start'}
                    {mrpRun?.status === 'Failed' && 'MRP run failed. Please check logs for details'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Summary Cards */}
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
                <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Total Items</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>{stats.totalItems}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Shortages</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.error }}>{stats.itemsWithShortfall}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Purchase Orders</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.info }}>{stats.totalPurchase}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.secondary }}>Work Orders</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.warning }}>{stats.totalManufacture}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        if (!mrpRun?.mrp_lines || mrpRun.mrp_lines.length === 0) {
          return (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              No MRP calculation results available
            </Alert>
          );
        }

        return (
          <Stack spacing={2}>
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
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                MRP Results ({mrpRun.mrp_lines.length} items)
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Gross Req</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Net Req</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Planned Order</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Req Date</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Action</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Source</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mrpRun.mrp_lines.slice(0, 50).map((line, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{line.part_no}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatNumber(line.gross_requirement)}</TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: line.net_requirement > 0 ? COLORS.error : COLORS.success }}>
                            {formatNumber(line.net_requirement)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatNumber(line.planned_order_qty)}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(line.requirement_date)}</TableCell>
                        <TableCell><ActionChip action={line.action} /></TableCell>
                        <TableCell><SourceChip source={line.source} /></TableCell>
                      </TableRow>
                    ))}
                    {mrpRun.mrp_lines.length > 50 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            + {mrpRun.mrp_lines.length - 50} more items
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>PR Count</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{mrpRun?.pr_count || 0}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Count</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{mrpRun?.wo_count || 0}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lines Count</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{mrpRun?.lines_count || 0}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Updated At</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{formatDateTime(mrpRun?.updatedAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Log</Typography>
                  <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, maxHeight: 150, overflow: 'auto' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {mrpRun?.log || 'No logs available'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
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
          overflow: 'hidden',
          height: '85vh',
          maxHeight: '85vh'
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
          MRP Run Details
        </Typography>
        <IconButton onClick={onClose} size="small">
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading MRP run details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {error}
          </Alert>
        ) : (
          renderStepContent(activeStep)
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

export default ViewMrpRun;