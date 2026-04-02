// ViewMrpRun.jsx
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
  Card,
  CardContent,
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
  Tab,
  Tabs,
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
  LocalShipping as ShippingIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import {
  COLORS,
  MRP_STATUS_COLORS,
  MRP_RUN_TYPE_COLORS,
  formatDate,
  formatDateTime,
  formatNumber,
  getMRPStatusMessage
} from './constants';
import BASE_URL from '../../../config/Config';

// Status Chip Component
const StatusChip = ({ status }) => {
  const statusConfig = MRP_STATUS_COLORS[status] || MRP_STATUS_COLORS['Queued'];
  const getIcon = () => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem' }} />;
      case 'Running':
        return <PendingIcon sx={{ fontSize: '0.8rem' }} />;
      case 'Failed':
        return <ErrorIcon sx={{ fontSize: '0.8rem' }} />;
      default:
        return <ScheduleIcon sx={{ fontSize: '0.8rem' }} />;
    }
  };

  return (
    <Chip
      icon={getIcon()}
      label={status}
      size="small"
      sx={{
        fontSize: '0.7rem',
        fontWeight: 500,
        height: 28,
        bgcolor: statusConfig.bg,
        color: statusConfig.color,
        border: `1px solid ${statusConfig.border}`,
        '& .MuiChip-icon': {
          color: statusConfig.color
        }
      }}
    />
  );
};

// Run Type Chip Component
const RunTypeChip = ({ runType }) => {
  const typeConfig = MRP_RUN_TYPE_COLORS[runType] || MRP_RUN_TYPE_COLORS['Full'];
  return (
    <Chip
      label={runType}
      size="small"
      sx={{
        fontSize: '0.7rem',
        fontWeight: 500,
        height: 26,
        bgcolor: typeConfig.bg,
        color: typeConfig.color,
        border: `1px solid ${typeConfig.border}`
      }}
    />
  );
};

// Action Chip Component
const ActionChip = ({ action }) => {
  const getActionColor = () => {
    switch (action) {
      case 'Create PO':
        return { bg: '#DBEAFE', color: '#1E40AF', icon: <ShoppingCartIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'Create WO':
        return { bg: '#FEF3C7', color: '#D97706', icon: <FactoryIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'Reschedule':
        return { bg: '#E0E7FF', color: '#4F46E5', icon: <ScheduleIcon sx={{ fontSize: '0.7rem' }} /> };
      default:
        return { bg: '#F1F5F9', color: '#475569', icon: null };
    }
  };

  const colorConfig = getActionColor();
  return (
    <Chip
      icon={colorConfig.icon}
      label={action}
      size="small"
      sx={{
        fontSize: '0.65rem',
        height: 24,
        bgcolor: colorConfig.bg,
        color: colorConfig.color,
        border: `1px solid ${colorConfig.bg}`
      }}
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
      sx={{
        fontSize: '0.65rem',
        height: 22,
        bgcolor: colorConfig.bg,
        color: colorConfig.color
      }}
    />
  );
};

// MRP Line Item Component
const MRPLineItem = ({ line, index }) => {
  const isShortfall = line.net_requirement > 0;

  return (
    <TableRow hover>
      <TableCell sx={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{line.part_no}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{line.item_id?.substring(0, 8) || '-'}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatNumber(line.gross_requirement)}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatNumber(line.scheduled_receipt)}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatNumber(line.opening_stock)}</TableCell>
      <TableCell align="right">
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: isShortfall ? '#DC2626' : '#059669'
          }}
        >
          {formatNumber(line.net_requirement)}
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
        {formatNumber(line.planned_order_qty)}
      </TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>
        {line.planned_order_release_date ? formatDate(line.planned_order_release_date) : '-'}
      </TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>
        {formatDate(line.requirement_date)}
      </TableCell>
      <TableCell>
        <ActionChip action={line.action} />
      </TableCell>
      <TableCell>
        <SourceChip source={line.source} />
      </TableCell>
      <TableCell>
        <Tooltip title={line.so_references?.join(', ') || 'No SO references'}>
          <Chip
            label={line.so_references?.length || 0}
            size="small"
            icon={<ShippingIcon sx={{ fontSize: '0.7rem' }} />}
            sx={{ fontSize: '0.65rem', height: 22 }}
          />
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

// Info Row Component
const InfoRow = ({ label, value, icon }) => (
  <Box sx={{ mb: 1.5 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
      {icon && <Box sx={{ color: COLORS.text.tertiary, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </Typography>
    </Stack>
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary, ml: icon ? 3.5 : 0 }}>
      {value || '-'}
    </Typography>
  </Box>
);

// Helper function to format MongoDB ID to readable format
const formatMongoId = (id) => {
  if (!id) return '-';
  // If it's a MongoDB ObjectId, take last 6 characters
  if (typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
    return id.slice(-6);
  }
  // If it's already a formatted string or has name property
  if (typeof id === 'object' && id.name) {
    return id.name;
  }
  // If it's a string but not ObjectId, return as is or truncate
  if (typeof id === 'string') {
    return id.length > 12 ? `${id.slice(0, 8)}...` : id;
  }
  return String(id);
};

// Main Component
const ViewMrpRun = ({ open, onClose, mrpRunId, onRerun }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mrpRun, setMrpRun] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterAction, setFilterAction] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [triggeredByUser, setTriggeredByUser] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (open && mrpRunId) {
      fetchMrpRunDetails();
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
      
      // Fetch user details if triggered_by exists
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
      
      // Fetch job details if job_id exists
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

  const getFilteredMRPLines = () => {
    if (!mrpRun?.mrp_lines) return [];

    let filtered = [...mrpRun.mrp_lines];

    if (filterAction !== 'all') {
      filtered = filtered.filter(line => line.action === filterAction);
    }

    if (filterSource !== 'all') {
      filtered = filtered.filter(line => line.source === filterSource);
    }

    return filtered;
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

  const getUniqueActions = () => {
    if (!mrpRun?.mrp_lines) return [];
    const actions = new Set(mrpRun.mrp_lines.map(l => l.action));
    return ['all', ...Array.from(actions)];
  };

  const getUniqueSources = () => {
    if (!mrpRun?.mrp_lines) return [];
    const sources = new Set(mrpRun.mrp_lines.map(l => l.source));
    return ['all', ...Array.from(sources)];
  };

  const stats = getSummaryStats();
  const filteredLines = getFilteredMRPLines();
  const uniqueActions = getUniqueActions();
  const uniqueSources = getUniqueSources();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh',
          bgcolor: COLORS.background.light
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
        <Stack direction="row" spacing={1.5} alignItems="center">
          <InventoryIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              MRP Run Details
            </Typography>
            {mrpRun && (
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                {mrpRun.mrp_run_id}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.secondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} sx={{ color: COLORS.primary, mb: 2 }} />
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading MRP run details...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                '& .MuiAlert-message': { fontSize: '0.75rem' }
              }}
            >
              {error}
            </Alert>
          </Box>
        ) : mrpRun ? (
          <>
            {/* Header Section with Status */}
            <Box sx={{
              p: 2.5,
              bgcolor: COLORS.background.white,
              borderBottom: `1px solid ${COLORS.border}`
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <StatusChip status={mrpRun.status} />
                    <RunTypeChip runType={mrpRun.run_type} />
                    {mrpRun.status === 'Running' && (
                      <LinearProgress sx={{ flex: 1, height: 4, borderRadius: 2 }} />
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Run Date"
                        value={formatDateTime(mrpRun.run_date)}
                        icon={<CalendarIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Completed At"
                        value={mrpRun.completed_at ? formatDateTime(mrpRun.completed_at) : 'In Progress'}
                        icon={<CheckCircleIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Planning Horizon"
                        value={`${mrpRun.planning_horizon} days`}
                        icon={<ScheduleIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InfoRow
                        label="Status Message"
                        value={getMRPStatusMessage(mrpRun.status)}
                        icon={<InfoIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Job ID"
                        value={
                          loadingDetails ? (
                            <CircularProgress size={12} />
                          ) : jobDetails ? (
                            <Tooltip 
                              title={
                                <Stack spacing={0.5}>
                                  <Typography sx={{ fontSize: '0.7rem' }}>Job ID: {jobDetails.job_id || jobDetails._id}</Typography>
                                  <Typography sx={{ fontSize: '0.7rem' }}>Type: {jobDetails.job_type}</Typography>
                                  <Typography sx={{ fontSize: '0.7rem' }}>Status: {jobDetails.status}</Typography>
                                  {jobDetails.description && (
                                    <Typography sx={{ fontSize: '0.7rem' }}>Description: {jobDetails.description}</Typography>
                                  )}
                                </Stack>
                              }
                              arrow
                              placement="top"
                            >
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary }}>
                                  {jobDetails.job_name || jobDetails.name || jobDetails.job_type || 'Unknown Job'}
                                </Typography>
                                <Chip
                                  label={jobDetails.job_id?.slice(-6) || jobDetails._id?.slice(-6)}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.6rem',
                                    bgcolor: COLORS.background.light,
                                    color: COLORS.text.secondary
                                  }}
                                />
                              </Stack>
                            </Tooltip>
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                              {formatMongoId(mrpRun.job_id)}
                            </Typography>
                          )
                        }
                        icon={<AssessmentIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Triggered By"
                        value={
                          loadingDetails ? (
                            <CircularProgress size={12} />
                          ) : triggeredByUser ? (
                            <Tooltip 
                              title={
                                <Stack spacing={0.5}>
                                  <Typography sx={{ fontSize: '0.7rem' }}>ID: {triggeredByUser.employee_id || triggeredByUser._id}</Typography>
                                  <Typography sx={{ fontSize: '0.7rem' }}>Email: {triggeredByUser.email}</Typography>
                                  <Typography sx={{ fontSize: '0.7rem' }}>Role: {triggeredByUser.role}</Typography>
                                </Stack>
                              }
                              arrow
                              placement="top"
                            >
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary }}>
                                  {triggeredByUser.name || triggeredByUser.username || 'Unknown User'}
                                </Typography>
                                {triggeredByUser.employee_id && (
                                  <Chip
                                    label={triggeredByUser.employee_id}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.6rem',
                                      bgcolor: COLORS.background.light,
                                      color: COLORS.text.secondary
                                    }}
                                  />
                                )}
                              </Stack>
                            </Tooltip>
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                              {mrpRun.triggered_by?.name || mrpRun.triggered_by?.username || formatMongoId(mrpRun.triggered_by?._id || mrpRun.triggered_by) || 'System'}
                            </Typography>
                          )
                        }
                        icon={<PersonIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Created At"
                        value={formatDateTime(mrpRun.createdAt)}
                        icon={<CalendarIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Updated At"
                        value={formatDateTime(mrpRun.updatedAt)}
                        icon={<CalendarIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="PR Count"
                        value={mrpRun.pr_count}
                        icon={<ShoppingCartIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="WO Count"
                        value={mrpRun.wo_count}
                        icon={<FactoryIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <InfoRow
                        label="Lines Count"
                        value={mrpRun.lines_count}
                        icon={<InventoryIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <InfoRow
                        label="Last Run Reference"
                        value={mrpRun.last_run_reference || 'N/A'}
                        icon={<InfoIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <InfoRow
                        label="Log"
                        value={mrpRun.log || 'No logs available'}
                        icon={<InfoIcon sx={{ fontSize: '0.8rem' }} />}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center" sx={{ height: '100%' }}>
                    {mrpRun.status !== 'Running' && mrpRun.status !== 'Queued' && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleRerun}
                        sx={{
                          height: 36,
                          px: 2,
                          borderRadius: 1.5,
                          bgcolor: COLORS.primary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': { bgcolor: COLORS.primaryDark }
                        }}
                      >
                        Rerun MRP
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* MRP Lines Section */}
            {mrpRun.mrp_lines && mrpRun.mrp_lines.length > 0 && (
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    MRP Calculation Results
                  </Typography>
                  <Chip
                    label={`${filteredLines.length} items`}
                    size="small"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                </Stack>

                {/* Filters */}
                <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Filter by Action
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      {uniqueActions.map(action => (
                        <Chip
                          key={action}
                          label={action === 'all' ? 'All' : action}
                          size="small"
                          onClick={() => setFilterAction(action)}
                          sx={{
                            fontSize: '0.7rem',
                            height: 28,
                            bgcolor: filterAction === action ? COLORS.primary : 'transparent',
                            color: filterAction === action ? 'white' : COLORS.text.secondary,
                            border: `1px solid ${filterAction === action ? COLORS.primary : COLORS.border}`,
                            '&:hover': {
                              bgcolor: filterAction === action ? COLORS.primaryDark : COLORS.background.hover
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.5 }}>
                      Filter by Source
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      {uniqueSources.map(source => (
                        <Chip
                          key={source}
                          label={source === 'all' ? 'All' : source}
                          size="small"
                          onClick={() => setFilterSource(source)}
                          sx={{
                            fontSize: '0.7rem',
                            height: 28,
                            bgcolor: filterSource === source ? COLORS.primary : 'transparent',
                            color: filterSource === source ? 'white' : COLORS.text.secondary,
                            border: `1px solid ${filterSource === source ? COLORS.primary : COLORS.border}`,
                            '&:hover': {
                              bgcolor: filterSource === source ? COLORS.primaryDark : COLORS.background.hover
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>

                {/* MRP Lines Table */}
                <TableContainer component={Paper} sx={{ maxHeight: 400, borderRadius: 1.5 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No.</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Item ID</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Gross Req</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Sched Receipt</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Opening Stock</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Net Req</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Planned Order</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Release Date</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Req Date</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Action</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Source</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>SO Ref</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLines.length > 0 ? (
                        filteredLines.map((line, idx) => (
                          <MRPLineItem key={idx} line={line} index={idx} />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                              No MRP lines found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        ) : null}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
        {mrpRun?.status !== 'Running' && mrpRun?.status !== 'Queued' && (
          <Button
            variant="contained"
            onClick={handleRerun}
            startIcon={<PlayArrowIcon sx={{ fontSize: '0.8rem' }} />}
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
            Rerun MRP
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewMrpRun;