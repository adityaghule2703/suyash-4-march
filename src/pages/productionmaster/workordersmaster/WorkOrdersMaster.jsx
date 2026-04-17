// WorkOrdersMaster.jsx (Complete with all buttons - Updated with new features)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, TextField, InputAdornment, Tooltip,
  Typography, Snackbar, TablePagination, Checkbox, Stack, Chip,
  Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Alert, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Autocomplete, Switch, FormControlLabel,
  Grid, Tabs, Tab, Card, CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  RocketLaunch as RocketLaunchIcon,
  Block as BlockIcon,
  PauseCircleOutline as HoldIcon,
  PlayCircleOutline as StartIcon,
  Replay as ResumeIcon,
  TaskAlt as CompleteOpIcon,
  FactCheck as CompleteWOIcon,
  WorkHistory as LabourIcon,
  Settings as SettingsIcon,
  MonetizationOn as JobCostingIcon,
  Receipt as JobCardIcon,
  Timeline as TimelineIcon,
  Assessment as WipReportIcon,
  Queue as AssemblyQueueIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddWorkOrder from './AddWorkOrder';
import EditWorkOrder from './EditWorkOrder';
import ViewWorkOrder from './ViewWorkOrder';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
};

// Status color mapping
const STATUS_COLORS = {
  'Planned': { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  'Released': { bg: '#E0E7FF', color: '#4338CA', border: '#C7D2FE' },
  'Components Kitted': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'In Progress': { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  'Partially Completed': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'On Hold': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  'Completed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
};

const PRIORITY_COLORS = {
  'Critical': { bg: '#FEE2E2', color: '#DC2626' },
  'High': { bg: '#FEF3C7', color: '#D97706' },
  'Medium': { bg: '#E0F2FE', color: '#0284C7' },
  'Low': { bg: '#D1FAE5', color: '#059669' }
};

// Job Costing Popup Component
const JobCostingPopup = ({ open, onClose, workOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [costingData, setCostingData] = useState(null);

  useEffect(() => {
    if (open && workOrder) {
      fetchJobCosting();
    }
  }, [open, workOrder]);

  const fetchJobCosting = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/${workOrder._id}/job-costing`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCostingData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load job costing data');
      }
    } catch (err) {
      console.error('Error fetching job costing:', err);
      setError(err.response?.data?.message || 'Failed to load job costing data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        alignItems: 'center',
        gap: 1
      }}>
        <JobCostingIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Job Costing Details
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : costingData ? (
          <Stack spacing={2.5}>
            {/* Work Order Info */}
            <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{costingData.wo_number}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part No:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{costingData.part_no}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Completed Qty:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{costingData.completed_qty}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Costing Date:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      {new Date(costingData.costing_date).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Actual Costs Section */}
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary, mt: 1 }}>
              Actual Costs
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mb: 0.5 }}>Raw Material Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_rm_cost)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mb: 0.5 }}>Process Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_process_cost)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mb: 0.5 }}>Overhead</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_overhead)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Totals */}
            <Paper sx={{ p: 1.5, bgcolor: '#F0FDF4', borderRadius: 1.5, border: `1px solid #A7F3D0` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Actual Total Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>
                      {formatCurrency(costingData.actual_total_cost)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Estimated Total Cost</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.estimated_total_cost)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Unit Cost</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formatCurrency(costingData.actual_unit_cost)} / pc
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Variance */}
            {(costingData.variance_amount !== 0 || costingData.variance_percent !== 0) && (
              <Paper sx={{ p: 1.5, bgcolor: costingData.variance_amount > 0 ? '#FEF3C7' : '#FEE2E2', borderRadius: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Variance Amount</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.variance_amount > 0 ? '#D97706' : '#DC2626' }}>
                        {formatCurrency(costingData.variance_amount)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Variance Percent</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.variance_percent > 0 ? '#D97706' : '#DC2626' }}>
                        {costingData.variance_percent > 0 ? '+' : ''}{costingData.variance_percent}%
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Profitability */}
            {costingData.selling_price_total > 0 && (
              <Paper sx={{ p: 1.5, bgcolor: costingData.gross_profit > 0 ? '#D1FAE5' : '#FEE2E2', borderRadius: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Selling Price</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{formatCurrency(costingData.selling_price_total)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Gross Profit</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.gross_profit > 0 ? '#059669' : '#DC2626' }}>
                        {formatCurrency(costingData.gross_profit)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Gross Margin</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: costingData.gross_margin_percent > 0 ? '#059669' : '#DC2626' }}>
                        {costingData.gross_margin_percent}%
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No costing data available</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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
      </DialogActions>
    </Dialog>
  );
};

// Timeline Popup Component
const TimelinePopup = ({ open, onClose, workOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timelineData, setTimelineData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (open && workOrder) {
      fetchTimeline();
    }
  }, [open, workOrder]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/timeline`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setTimelineData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load timeline data');
      }
    } catch (err) {
      console.error('Error fetching timeline:', err);
      setError(err.response?.data?.message || 'Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#059669';
      case 'In Progress': return '#0284C7';
      case 'Pending': return '#94A3B8';
      default: return '#94A3B8';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Completed': return '#D1FAE5';
      case 'In Progress': return '#E0F2FE';
      case 'Pending': return '#F1F5F9';
      default: return '#F1F5F9';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        alignItems: 'center',
        gap: 1
      }}>
        <TimelineIcon sx={{ color: COLORS.primary }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Operations Timeline
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : timelineData ? (
          <Stack spacing={2.5}>
            {/* Summary Cards */}
            <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>WO Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{timelineData.summary.wo_number}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Part</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{timelineData.summary.part_no}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Progress</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#059669' }}>{timelineData.summary.percent_complete}%</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Status</Typography>
                  <Chip 
                    label={timelineData.summary.wo_status} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.6rem', 
                      height: 20,
                      bgcolor: STATUS_COLORS[timelineData.summary.wo_status]?.bg || '#F1F5F9',
                      color: STATUS_COLORS[timelineData.summary.wo_status]?.color || '#475569'
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Time Summary */}
            <Paper sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Planned Total</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{timelineData.summary.total_planned_min} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Actual Total</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#D97706' }}>{timelineData.summary.total_actual_min} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Overall Yield</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>{timelineData.summary.overall_yield_percent}%</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Timeline View */}
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary, mt: 1 }}>
              Operation Timeline
            </Typography>

            <Box sx={{ position: 'relative' }}>
              {timelineData.operations.map((op, index) => (
                <Box key={op.op_sequence} sx={{ display: 'flex', mb: 2 }}>
                  {/* Timeline line */}
                  <Box sx={{ position: 'relative', width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: getStatusColor(op.status),
                        border: `2px solid ${getStatusBg(op.status)}`,
                        zIndex: 1
                      }} 
                    />
                    {index < timelineData.operations.length - 1 && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          width: 2, 
                          height: 'calc(100% + 8px)', 
                          bgcolor: '#E5E7EB',
                          zIndex: 0
                        }} 
                      />
                    )}
                  </Box>

                  {/* Operation Card */}
                  <Paper 
                    sx={{ 
                      flex: 1, 
                      ml: 1.5, 
                      p: 1.5, 
                      borderRadius: 2, 
                      border: `1px solid ${op.status === 'In Progress' ? COLORS.primary : COLORS.border}`,
                      bgcolor: op.status === 'In Progress' ? `${COLORS.primary}05` : COLORS.background.white
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.primary }}>
                          Op {op.op_sequence}
                        </Typography>
                        <Chip 
                          label={op.status} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.55rem', 
                            height: 18,
                            bgcolor: getStatusBg(op.status),
                            color: getStatusColor(op.status)
                          }}
                        />
                      </Stack>
                      {op.is_current && (
                        <Chip 
                          label="Current" 
                          size="small" 
                          sx={{ 
                            fontSize: '0.55rem', 
                            height: 18,
                            bgcolor: COLORS.primary,
                            color: '#FFFFFF'
                          }}
                        />
                      )}
                    </Stack>

                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {op.operation_name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 1 }}>
                      {op.work_centre}
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Planned Qty</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>{op.planned.qty}</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Output Qty</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>{op.output.output_qty}</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Yield</Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: '#059669' }}>{op.output.yield_percent}%</Typography>
                      </Grid>
                    </Grid>

                    {op.actual.start && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${COLORS.border}` }}>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 6 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Start</Typography>
                            <Typography sx={{ fontSize: '0.6rem' }}>{formatDate(op.actual.start)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>End</Typography>
                            <Typography sx={{ fontSize: '0.6rem' }}>{formatDate(op.actual.end)}</Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ mt: 0.5 }}>
                          <Grid size={{ xs: 6 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Setup (min)</Typography>
                            <Typography sx={{ fontSize: '0.6rem' }}>{op.actual.setup_min}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Run (min/pc)</Typography>
                            <Typography sx={{ fontSize: '0.6rem' }}>{op.actual.run_min_per_pc}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                </Box>
              ))}
            </Box>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No timeline data available</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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
      </DialogActions>
    </Dialog>
  );
};

// WIP Report Popup Component
const WipReportPopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wipData, setWipData] = useState(null);

  useEffect(() => {
    if (open) {
      fetchWipReport();
    }
  }, [open]);

  const fetchWipReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/wip-report`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setWipData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load WIP report');
      }
    } catch (err) {
      console.error('Error fetching WIP report:', err);
      setError(err.response?.data?.message || 'Failed to load WIP report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        alignItems: 'center',
        gap: 1
      }}>
        <WipReportIcon sx={{ color: COLORS.primary }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Work In Progress (WIP) Report
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : wipData ? (
          <Stack spacing={2.5}>
            {/* Summary Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Open Work Orders</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>{wipData.open_wo_count}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Machining WIP Value</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>{formatCurrency(wipData.machining_wip_value)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Assembly WIP Value</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>{formatCurrency(wipData.assembly_wip_value)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Total WIP Value */}
            <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>Total WIP Value</Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: COLORS.primary }}>{formatCurrency(wipData.total_wip_value)}</Typography>
              </Stack>
            </Paper>

            {/* Work Orders Table */}
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary, mt: 1 }}>
              Work Orders in Progress
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>WO Number</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: COLORS.text.light, fontSize: '0.65rem', fontWeight: 600 }}>Planned Start</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wipData.work_orders?.map((wo) => {
                    const statusColors = STATUS_COLORS[wo.status] || { bg: '#F1F5F9', color: '#475569' };
                    const completionPercent = wo.planned_qty > 0 ? (wo.completed_qty / wo.planned_qty) * 100 : 0;
                    return (
                      <TableRow key={wo._id} hover>
                        <TableCell><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.wo_number}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.7rem' }}>{wo.part_no}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.7rem' }}>{wo.customer_name}</Typography></TableCell>
                        <TableCell><Chip label={wo.wo_type || 'N/A'} size="small" sx={{ fontSize: '0.6rem', height: 20 }} /></TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.completed_qty} / {wo.planned_qty}</Typography>
                          <Box sx={{ width: 60, mt: 0.5, bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
                            <Box sx={{ width: `${completionPercent}%`, bgcolor: COLORS.primary, height: 2 }} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={wo.status} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: statusColors.bg, color: statusColors.color }} />
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.65rem' }}>{formatDate(wo.planned_start)}</Typography></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No WIP data available</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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
      </DialogActions>
    </Dialog>
  );
};

// Assembly Queue Popup Component
const AssemblyQueuePopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assemblyData, setAssemblyData] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAssemblyQueue();
    }
  }, [open]);

  const fetchAssemblyQueue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/assembly-queue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setAssemblyData(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load assembly queue');
      }
    } catch (err) {
      console.error('Error fetching assembly queue:', err);
      setError(err.response?.data?.message || 'Failed to load assembly queue');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#059669';
      case 'In Progress': return '#0284C7';
      case 'Released': return '#4338CA';
      case 'On Hold': return '#DC2626';
      default: return '#94A3B8';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Completed': return '#D1FAE5';
      case 'In Progress': return '#E0F2FE';
      case 'Released': return '#E0E7FF';
      case 'On Hold': return '#FEE2E2';
      default: return '#F1F5F9';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        alignItems: 'center',
        gap: 1
      }}>
        <AssemblyQueueIcon sx={{ color: COLORS.primary }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Assembly Queue
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : assemblyData.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>No assembly work orders in queue</Alert>
        ) : (
          <Stack spacing={2}>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Total Assembly Orders: <strong>{assemblyData.length}</strong>
            </Typography>

            {assemblyData.map((wo) => {
              const inProgressOps = wo.operations?.filter(op => op.status === 'In Progress').length || 0;
              const completedOps = wo.operations?.filter(op => op.status === 'Completed').length || 0;
              const totalOps = wo.operations?.length || 0;
              const progressPercent = totalOps > 0 ? (completedOps / totalOps) * 100 : 0;
              const statusColors = { bg: getStatusBg(wo.status), color: getStatusColor(wo.status) };

              return (
                <Paper
                  key={wo._id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    bgcolor: COLORS.background.white,
                    '&:hover': { borderColor: COLORS.primary }
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.primary }}>
                          {wo.wo_number}
                        </Typography>
                        <Chip 
                          label={wo.wo_type} 
                          size="small" 
                          sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                        />
                        <Chip 
                          label={wo.status} 
                          size="small" 
                          sx={{ fontSize: '0.6rem', height: 20, bgcolor: statusColors.bg, color: statusColors.color }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        SO: {wo.so_number || 'N/A'}
                      </Typography>
                    </Stack>

                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Part</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.part_no} - {wo.part_name}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Planned Qty</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.planned_qty}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Completed</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.completed_qty}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Assembly Line</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{wo.assembly_line || 'Not Assigned'}</Typography>
                      </Grid>
                    </Grid>

                    {/* Operation Progress */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Operation Progress</Typography>
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 500 }}>
                          {completedOps}/{totalOps} operations
                        </Typography>
                      </Stack>
                      <Box sx={{ width: '100%', bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ width: `${progressPercent}%`, bgcolor: COLORS.primary, height: 4 }} />
                      </Box>
                    </Box>

                    {/* Current Operation Status */}
                    {inProgressOps > 0 && (
                      <Box sx={{ p: 1, bgcolor: '#E0F2FE', borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#0284C7' }}>
                          ⚡ {inProgressOps} operation(s) currently in progress
                        </Typography>
                      </Box>
                    )}

                    {/* Dates */}
                    <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        Planned: {formatDate(wo.planned_start)} → {formatDate(wo.planned_end)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                        Required By: {formatDate(wo.required_by)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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
      </DialogActions>
    </Dialog>
  );
};

// Add Operations Popup Component (UPDATED with improved layout)
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
      planned_start: ''
    }
  ]);

  // Fetch Routings
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
      const response = await axios.get(`${BASE_URL}/api/routings?page=1&limit=50`, {
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
      const response = await axios.get(`${BASE_URL}/api/machines?page=1&limit=50`, {
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
      const response = await axios.get(`${BASE_URL}/api/vendors?page=1&limit=50`, {
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

  // Handle routing selection
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
        subcontract_vendor: op.subcontract_vendor
      }));
      setAvailableOperations(ops);
      
      // Reset operations with first operation from routing
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
          planned_start: ''
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
        planned_start: ''
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
        planned_start: ''
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
        planned_start: op.planned_start || undefined
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
        planned_start: ''
      }
    ]);
    setError('');
    onClose();
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
                  sx={{
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
                  }}
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
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          OP SEQUENCE <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.op_sequence}
                          onChange={(e) => handleOperationChange(index, 'op_sequence', e.target.value)}
                          placeholder="e.g., 10"
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 9 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          OPERATION <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={availableOperations}
                          getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name}`}
                          value={availableOperations.find(o => o._id === op.operation_id) || null}
                          onChange={(event, newValue) => {
                            handleOperationChange(index, 'operation_id', newValue?._id || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select operation"
                              sx={{
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
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Row 2: Work Centre and Required Skill */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          WORK CENTRE
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={op.work_centre}
                          onChange={(e) => handleOperationChange(index, 'work_centre', e.target.value)}
                          placeholder="Work centre"
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          REQUIRED SKILL
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={op.required_skill}
                          onChange={(e) => handleOperationChange(index, 'required_skill', e.target.value)}
                          placeholder="e.g., PRESS-OPS"
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Row 3: Machine and Employee */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          MACHINE
                        </Typography>
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
                              sx={{
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
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          EMPLOYEE
                        </Typography>
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
                              sx={{
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
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Row 4: Planned Times */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          PLANNED SETUP (min)
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.planned_setup_min}
                          onChange={(e) => handleOperationChange(index, 'planned_setup_min', e.target.value)}
                          placeholder="e.g., 15"
                          inputProps={{ min: 0, step: 0.5 }}
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          PLANNED RUN (min)
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.planned_run_min}
                          onChange={(e) => handleOperationChange(index, 'planned_run_min', e.target.value)}
                          placeholder="e.g., 1.5"
                          inputProps={{ min: 0, step: 0.1 }}
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          PLANNED QTY
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={op.planned_qty}
                          onChange={(e) => handleOperationChange(index, 'planned_qty', e.target.value)}
                          placeholder="Planned quantity"
                          inputProps={{ min: 0 }}
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Row 5: Subcontract and Planned Start */}
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
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                            SUBCONTRACT VENDOR
                          </Typography>
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
                                sx={{
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
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Grid>
                    )}

                    <Grid size={{ xs: 12, sm: op.is_subcontract ? 4 : 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          PLANNED START DATE
                        </Typography>
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          value={op.planned_start}
                          onChange={(e) => handleOperationChange(index, 'planned_start', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{
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
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem' }
              }}
            >
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
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? 'Adding...' : 'Add Operations'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Complete Operation Popup Component (UPDATED - Auto-selects In Progress operation)
const CompleteOperationPopup = ({ open, onClose, workOrder, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formData, setFormData] = useState({
    output_qty: '',
    rejection_qty: '',
    rejection_reason: '',
    actual_setup_min: '',
    actual_run_min: ''
  });

  const operations = workOrder?.operations || [];
  
  // Find the operation with status "In Progress"
  const inProgressOperation = operations.find(op => op.status === 'In Progress');

  // Auto-select the In Progress operation when component opens or workOrder changes
  useEffect(() => {
    if (open && workOrder && inProgressOperation) {
      setSelectedOperation(inProgressOperation);
      setFormData(prev => ({
        ...prev,
        output_qty: inProgressOperation.planned_qty || workOrder?.planned_qty || ''
      }));
      setError('');
    } else if (open && workOrder && !inProgressOperation) {
      setError('No operation is currently In Progress. Please start an operation first.');
    }
  }, [open, workOrder, inProgressOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedOperation) {
      setError('Please select an operation');
      return;
    }
    if (!formData.output_qty || formData.output_qty <= 0) {
      setError('Output quantity is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/${selectedOperation.op_sequence}/complete`,
        {
          output_qty: Number(formData.output_qty),
          rejection_qty: Number(formData.rejection_qty) || 0,
          rejection_reason: formData.rejection_reason || '',
          actual_setup_min: Number(formData.actual_setup_min) || 0,
          actual_run_min: Number(formData.actual_run_min) || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onComplete(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to complete operation');
      }
    } catch (err) {
      console.error('Error completing operation:', err);
      setError(err.response?.data?.message || 'Failed to complete operation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedOperation(null);
    setFormData({
      output_qty: '',
      rejection_qty: '',
      rejection_reason: '',
      actual_setup_min: '',
      actual_run_min: ''
    });
    setError('');
    onClose();
  };

  const maxOutputQty = selectedOperation?.planned_qty || workOrder?.planned_qty || 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CompleteOpIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Complete Operation
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Work Order Info */}
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Operation Selection - Auto-selected and Read-only */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OPERATION <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            {inProgressOperation ? (
              <Paper 
                sx={{ 
                  p: 1.5, 
                  bgcolor: `${COLORS.primary}10`, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.primary}`,
                  cursor: 'not-allowed'
                }}
              >
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Sequence:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      {inProgressOperation.op_sequence}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Operation Name:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      {inProgressOperation.operation_name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Centre:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {inProgressOperation.work_centre}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Qty:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {inProgressOperation.planned_qty || workOrder?.planned_qty}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography>
                    <Chip 
                      label={inProgressOperation.status} 
                      size="small"
                      sx={{ 
                        fontSize: '0.6rem', 
                        height: 20,
                        bgcolor: STATUS_COLORS['In Progress']?.bg || '#E0F2FE',
                        color: STATUS_COLORS['In Progress']?.color || '#0284C7'
                      }}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ) : (
              <Autocomplete
                fullWidth
                options={operations}
                getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name} - ${option.work_centre} (Planned: ${option.planned_qty})`}
                value={selectedOperation}
                onChange={(event, newValue) => {
                  setSelectedOperation(newValue);
                  if (newValue) {
                    setFormData(prev => ({
                      ...prev,
                      output_qty: newValue.planned_qty || workOrder?.planned_qty || ''
                    }));
                  }
                  setError('');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select operation"
                    error={!!error && !selectedOperation}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary }
                      }
                    }}
                  />
                )}
              />
            )}
          </Box>

          {/* Output Quantity */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OUTPUT QUANTITY <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="output_qty"
              value={formData.output_qty}
              onChange={handleChange}
              placeholder={`Max: ${maxOutputQty}`}
              inputProps={{ max: maxOutputQty, min: 0 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Max allowed: {maxOutputQty}
            </Typography>
          </Box>

          {/* Rejection Quantity */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              REJECTION QUANTITY
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="rejection_qty"
              value={formData.rejection_qty}
              onChange={handleChange}
              placeholder="e.g., 10"
              inputProps={{ min: 0 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
          </Box>

          {/* Rejection Reason - shown only if rejection_qty > 0 */}
          {formData.rejection_qty > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                REJECTION REASON
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                name="rejection_reason"
                value={formData.rejection_reason}
                onChange={handleChange}
                placeholder="e.g., Dimensional OOT"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '&:hover fieldset': { borderColor: COLORS.primary }
                  }
                }}
              />
            </Box>
          )}

          {/* Actual Setup Min */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              ACTUAL SETUP TIME (minutes)
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="actual_setup_min"
              value={formData.actual_setup_min}
              onChange={handleChange}
              placeholder="e.g., 18"
              inputProps={{ min: 0, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
          </Box>

          {/* Actual Run Min */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              ACTUAL RUN TIME (minutes)
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="actual_run_min"
              value={formData.actual_run_min}
              onChange={handleChange}
              placeholder="e.g., 1.6"
              inputProps={{ min: 0, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
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
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedOperation}
          startIcon={<CompleteOpIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#059669',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#047857' }
          }}
        >
          {loading ? 'Processing...' : 'Complete Operation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Labour Entry Popup Component
const LabourEntryPopup = ({ open, onClose, workOrder, onLabour }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formData, setFormData] = useState({
    operator_id: '',
    hours_booked: '',
    start_time: '',
    end_time: ''
  });

  const operations = workOrder?.operations || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedOperation) {
      setError('Please select an operation');
      return;
    }
    if (!formData.operator_id.trim()) {
      setError('Operator ID is required');
      return;
    }
    if (!formData.hours_booked || formData.hours_booked <= 0) {
      setError('Hours booked is required');
      return;
    }
    if (!formData.start_time) {
      setError('Start time is required');
      return;
    }
    if (!formData.end_time) {
      setError('End time is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/labour`,
        {
          operator_id: formData.operator_id,
          operation_seq: selectedOperation.op_sequence,
          hours_booked: Number(formData.hours_booked),
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onLabour(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add labour entry');
      }
    } catch (err) {
      console.error('Error adding labour entry:', err);
      setError(err.response?.data?.message || 'Failed to add labour entry');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedOperation(null);
    setFormData({ operator_id: '', hours_booked: '', start_time: '', end_time: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <LabourIcon sx={{ color: '#F59E0B' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Labour Entry
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography>
              </Stack>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OPERATION <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <Autocomplete
              fullWidth
              options={operations}
              getOptionLabel={(option) => `${option.op_sequence}. ${option.operation_name} - ${option.work_centre}`}
              value={selectedOperation}
              onChange={(event, newValue) => {
                setSelectedOperation(newValue);
                setError('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select operation"
                  error={!!error && !selectedOperation}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.primary }
                    }
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              OPERATOR ID <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="operator_id"
              value={formData.operator_id}
              onChange={handleChange}
              placeholder="Enter operator ID"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              HOURS BOOKED <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="hours_booked"
              value={formData.hours_booked}
              onChange={handleChange}
              placeholder="e.g., 4"
              inputProps={{ min: 0, step: 0.5 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              START TIME <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              size="small"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                },
                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              END TIME <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              size="small"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary }
                },
                '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
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
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<LabourIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#F59E0B',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#D97706' }
          }}
        >
          {loading ? 'Processing...' : 'Add Labour Entry'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Complete Work Order Popup Component
const CompleteWorkOrderPopup = ({ open, onClose, workOrder, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    completed_qty: '',
    rejected_qty: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.completed_qty || formData.completed_qty <= 0) {
      setError('Completed quantity is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/complete`,
        {
          completed_qty: Number(formData.completed_qty),
          rejected_qty: Number(formData.rejected_qty) || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onComplete(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to complete work order');
      }
    } catch (err) {
      console.error('Error completing work order:', err);
      setError(err.response?.data?.message || 'Failed to complete work order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ completed_qty: '', rejected_qty: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CompleteWOIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Complete Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Qty:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.planned_qty}</Typography>
              </Stack>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>COMPLETED QUANTITY <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth type="number" size="small" name="completed_qty" value={formData.completed_qty} onChange={handleChange} placeholder="e.g., 490" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>REJECTED QUANTITY</Typography>
            <TextField fullWidth type="number" size="small" name="rejected_qty" value={formData.rejected_qty} onChange={handleChange} placeholder="e.g., 10" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<CompleteWOIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#059669', fontSize: '0.7rem', '&:hover': { bgcolor: '#047857' } }}>
          {loading ? 'Processing...' : 'Complete Work Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Hold Work Order Popup Component
const HoldWorkOrderPopup = ({ open, onClose, workOrder, onHold }) => {
  const [holdReason, setHoldReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!holdReason.trim()) {
      setError('Hold reason is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/hold`, { hold_reason: holdReason }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        onHold(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to hold work order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to hold work order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHoldReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HoldIcon sx={{ color: '#D97706' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Hold Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography></Stack>
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>HOLD REASON <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth multiline rows={4} size="small" value={holdReason} onChange={(e) => setHoldReason(e.target.value)} placeholder="Please provide the reason for putting work order on hold..." error={!!error} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<HoldIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#D97706', fontSize: '0.7rem', '&:hover': { bgcolor: '#B45309' } }}>{loading ? 'Processing...' : 'Hold Work Order'}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Resume Work Order Popup Component
const ResumeWorkOrderPopup = ({ open, onClose, workOrder, onResume }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!resolutionNotes.trim()) { setError('Resolution notes are required'); return; }
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/resume`, { resolution_notes: resolutionNotes }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { onResume(response.data.data); handleClose(); } 
      else { setError(response.data.message || 'Failed to resume work order'); }
    } catch (err) { setError(err.response?.data?.message || 'Failed to resume work order'); } 
    finally { setLoading(false); }
  };

  const handleClose = () => { setResolutionNotes(''); setError(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5,mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ResumeIcon sx={{ color: '#059669' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Resume Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography></Stack>
              {workOrder?.hold_reason && <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Previous Hold Reason:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#DC2626', maxWidth: '60%', textAlign: 'right' }}>{workOrder?.hold_reason}</Typography></Stack>}
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>RESOLUTION NOTES <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth multiline rows={4} size="small" value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} placeholder="Please provide resolution notes explaining how the issue was resolved..." error={!!error} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<ResumeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#059669', fontSize: '0.7rem', '&:hover': { bgcolor: '#047857' } }}>{loading ? 'Processing...' : 'Resume Work Order'}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Cancel Work Order Popup Component
const CancelWorkOrderPopup = ({ open, onClose, workOrder, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!cancelReason.trim()) { setError('Cancel reason is required'); return; }
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/cancel`, { cancel_reason: cancelReason }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { onCancel(response.data.data); handleClose(); } 
      else { setError(response.data.message || 'Failed to cancel work order'); }
    } catch (err) { setError(err.response?.data?.message || 'Failed to cancel work order'); } 
    finally { setLoading(false); }
  };

  const handleClose = () => { setCancelReason(''); setError(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BlockIcon sx={{ color: '#DC2626' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Cancel Work Order</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography></Stack>
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>CANCEL REASON <span style={{ color: '#EF4444' }}>*</span></Typography>
            <TextField fullWidth multiline rows={4} size="small" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Please provide the reason for cancellation..." error={!!error} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<BlockIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#DC2626', fontSize: '0.7rem', '&:hover': { bgcolor: '#B91C1C' } }}>{loading ? 'Cancelling...' : 'Cancel Work Order'}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Updated Action Menu Component (with new buttons)
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onRelease, onCancel, onHold, onStart, onResume, onCompleteOp, onCompleteWO, onLabour, onOperations, onJobCosting, onJobCard, onTimeline }) => {
  const isPlanned = item?.status === 'Planned';
  const isReleased = item?.status === 'Released';
  const isOnHold = item?.status === 'On Hold';
  const isInProgress = item?.status === 'In Progress';
  const isPartiallyCompleted = item?.status === 'Partially Completed';
  
  const menuItem = (onClick, icon, label, color = COLORS.text.primary, disabled = false, tooltipMsg = '') => {
    const el = (
      <MenuItem onClick={() => { if (!disabled) { onClick(); onClose(); } }} sx={{ py: 1.5, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer', pointerEvents: disabled ? 'none' : 'auto' }}>
        <ListItemIcon sx={{ color, minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText><Typography variant="body2" fontWeight={500} sx={{ color, fontSize: '0.75rem' }}>{label}</Typography></ListItemText>
      </MenuItem>
    );
    return disabled && tooltipMsg ? <Tooltip key={label} title={tooltipMsg} placement="left">{el}</Tooltip> : <React.Fragment key={label}>{el}</React.Fragment>;
  };

  return (
    <>
      <Tooltip title="Actions"><IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}><MoreVertIcon fontSize="small" /></IconButton></Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 220, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' } }}>
        {menuItem(() => onView(item), <ViewIcon fontSize="small" />, 'View details')}
        {menuItem(() => onEdit(item), <EditIcon fontSize="small" />, 'Edit')}
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        {menuItem(() => onJobCosting(item), <JobCostingIcon fontSize="small" />, 'Job Costing', '#8B5CF6')}
        {menuItem(() => onJobCard(item), <JobCardIcon fontSize="small" />, 'Job Card', '#F59E0B')}
        {menuItem(() => onTimeline(item), <TimelineIcon fontSize="small" />, 'Timeline', COLORS.primary)}
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        {isPlanned && menuItem(() => onRelease(item), <RocketLaunchIcon fontSize="small" />, 'Release Work Order', '#059669')}
        {isPlanned && menuItem(() => onCancel(item), <BlockIcon fontSize="small" />, 'Cancel Work Order', '#DC2626')}
        
        {/* For Released status - Show Start and Operations buttons */}
        {isReleased && menuItem(() => onStart(item), <StartIcon fontSize="small" />, 'Start', '#059669')}
        {isReleased && menuItem(() => onOperations(item), <SettingsIcon fontSize="small" />, 'Operations', COLORS.primary)}
        
        {isOnHold && menuItem(() => onResume(item), <ResumeIcon fontSize="small" />, 'Resume Work Order', '#059669')}
        {isInProgress && menuItem(() => onHold(item), <HoldIcon fontSize="small" />, 'Hold Work Order', '#D97706')}
        {isInProgress && menuItem(() => onCompleteOp(item), <CompleteOpIcon fontSize="small" />, 'Complete Operation', '#8B5CF6')}
        {isInProgress && menuItem(() => onCompleteWO(item), <CompleteWOIcon fontSize="small" />, 'Complete Work Order', '#059669')}
        {isInProgress && menuItem(() => onLabour(item), <LabourIcon fontSize="small" />, 'Labour Entry', '#F59E0B')}

        {isPartiallyCompleted && menuItem(() => onCompleteWO(item), <CompleteWOIcon fontSize="small" />, 'Complete Work Order', '#059669')}
      </Menu>
    </>
  );
};

// Main Component
const WorkOrdersMaster = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedWorkOrderForMenu, setSelectedWorkOrderForMenu] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openHold, setOpenHold] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openResume, setOpenResume] = useState(false);
  const [openCompleteOp, setOpenCompleteOp] = useState(false);
  const [openCompleteWO, setOpenCompleteWO] = useState(false);
  const [openLabour, setOpenLabour] = useState(false);
  const [openOperations, setOpenOperations] = useState(false);
  const [openJobCosting, setOpenJobCosting] = useState(false);
  const [openJobCardLoading, setOpenJobCardLoading] = useState(false);
  const [openTimeline, setOpenTimeline] = useState(false);
  const [openWipReport, setOpenWipReport] = useState(false);
  const [openAssemblyQueue, setOpenAssemblyQueue] = useState(false);

  useEffect(() => { const t = setTimeout(() => { setSearchTerm(searchInput); setPage(0); }, 500); return () => clearTimeout(t); }, [searchInput]);

  const fetchWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (searchTerm) params.append('search', searchTerm);
      const res = await axios.get(`${BASE_URL}/api/work-orders?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { setWorkOrders(res.data.data || []); setTotalItems(res.data.pagination?.total || 0); } 
      else { notify('Failed to load work orders', 'error'); }
    } catch (err) { notify('Failed to load work orders', 'error'); } 
    finally { setLoading(false); }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => { fetchWorkOrders(); }, [fetchWorkOrders]);

  const notify = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const openModal = (setter, workOrder = null) => { if (workOrder) setSelectedWorkOrder(workOrder); setter(true); setActionMenuAnchor(null); setSelectedWorkOrderForMenu(null); };
  const closeModal = (setter) => { setter(false); setSelectedWorkOrder(null); };
  const afterAction = (setter, message) => () => { closeModal(setter); fetchWorkOrders(); notify(message); };

  const handleRelease = async (workOrder) => {
    try { 
      const token = localStorage.getItem('token'); 
      const response = await axios.post(`${BASE_URL}/api/work-orders/${workOrder._id}/release`, {}, { headers: { Authorization: `Bearer ${token}` } }); 
      if (response.data.success) { 
        notify(`Work Order ${workOrder.wo_number} released successfully!`); 
        fetchWorkOrders(); 
      } else { 
        notify(response.data.message || 'Failed to release work order', 'error'); 
      } 
    } 
    catch (err) { 
      notify(err.response?.data?.message || 'Failed to release work order', 'error'); 
    }
  };

  const handleStart = async (workOrder) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        notify(`Work Order ${workOrder.wo_number} started successfully!`);
        fetchWorkOrders();
      } else {
        notify(response.data.message || 'Failed to start work order', 'error');
      }
    } catch (err) {
      console.error('Error starting work order:', err);
      notify(err.response?.data?.message || 'Failed to start work order', 'error');
    } finally {
      setLoading(false);
      setActionMenuAnchor(null);
      setSelectedWorkOrderForMenu(null);
    }
  };

  const handleOpenOperations = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setOpenOperations(true);
    setActionMenuAnchor(null);
    setSelectedWorkOrderForMenu(null);
  };

  const handleOperationsAdded = (updatedWorkOrder) => {
    notify(`Operations added to Work Order ${updatedWorkOrder.wo_number} successfully!`);
    fetchWorkOrders();
    setOpenOperations(false);
    setSelectedWorkOrder(null);
  };

  // NEW: Job Costing handler
  const handleJobCosting = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setOpenJobCosting(true);
    setActionMenuAnchor(null);
    setSelectedWorkOrderForMenu(null);
  };

  // NEW: Job Card handler - downloads PDF
  const handleJobCard = async (workOrder) => {
    try {
      setOpenJobCardLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/${workOrder._id}/job-card`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `JobCard_${workOrder.wo_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      notify(`Job Card for ${workOrder.wo_number} downloaded successfully!`);
    } catch (err) {
      console.error('Error downloading job card:', err);
      notify(err.response?.data?.message || 'Failed to download job card', 'error');
    } finally {
      setOpenJobCardLoading(false);
      setActionMenuAnchor(null);
      setSelectedWorkOrderForMenu(null);
    }
  };

  // NEW: Timeline handler
  const handleTimeline = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setOpenTimeline(true);
    setActionMenuAnchor(null);
    setSelectedWorkOrderForMenu(null);
  };

  // NEW: WIP Report handler
  const handleWipReport = () => {
    setOpenWipReport(true);
  };

  // NEW: Assembly Queue handler
  const handleAssemblyQueue = () => {
    setOpenAssemblyQueue(true);
  };

  const handleCancel = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenCancel(true); };
  const handleCancelSubmit = async (cancelledWorkOrder) => { notify(`Work Order ${cancelledWorkOrder.wo_number} cancelled successfully!`); fetchWorkOrders(); setOpenCancel(false); setSelectedWorkOrder(null); };

  const handleHold = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenHold(true); };
  const handleHoldSubmit = async (heldWorkOrder) => { notify(`Work Order ${heldWorkOrder.wo_number} placed on hold successfully!`); fetchWorkOrders(); setOpenHold(false); setSelectedWorkOrder(null); };

  const handleResume = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenResume(true); };
  const handleResumeSubmit = async (resumedWorkOrder) => { notify(`Work Order ${resumedWorkOrder.wo_number} resumed successfully!`); fetchWorkOrders(); setOpenResume(false); setSelectedWorkOrder(null); };

  const handleCompleteOp = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenCompleteOp(true); };
  const handleCompleteOpSubmit = async (completedWorkOrder) => { notify(`Operation completed successfully!`); fetchWorkOrders(); setOpenCompleteOp(false); setSelectedWorkOrder(null); };

  const handleCompleteWO = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenCompleteWO(true); };
  const handleCompleteWOSubmit = async (completedWorkOrder) => { notify(`Work Order ${completedWorkOrder.wo_number} completed successfully!`); fetchWorkOrders(); setOpenCompleteWO(false); setSelectedWorkOrder(null); };

  const handleLabour = (workOrder) => { setSelectedWorkOrder(workOrder); setOpenLabour(true); };
  const handleLabourSubmit = async (labourEntry) => { notify(`Labour entry added successfully!`); fetchWorkOrders(); setOpenLabour(false); setSelectedWorkOrder(null); };

  const handleSelectAll = (e) => setSelected(e.target.checked ? workOrders.map(wo => wo._id) : []);
  const handleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleChangePage = (_, newPage) => { setPage(newPage); setSelected([]); };
  const handleChangeRows = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); setSelected([]); };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon sx={{ fontSize: '0.875rem' }} />;
      case 'Cancelled': return <CancelIcon sx={{ fontSize: '0.875rem' }} />;
      case 'On Hold': return <HoldIcon sx={{ fontSize: '0.875rem' }} />;
      case 'In Progress': return <StartIcon sx={{ fontSize: '0.875rem' }} />;
      case 'Released': return <RocketLaunchIcon sx={{ fontSize: '0.875rem' }} />;
      default: return <AssignmentIcon sx={{ fontSize: '0.875rem' }} />;
    }
  };
  const getInitials = (wo) => wo.customer_name ? wo.customer_name.substring(0, 2).toUpperCase() : 'WO';
  const getAvatarColor = (wo) => { const colors = [COLORS.primary, '#074346', '#0D696C', '#128C7E', '#1A9C8F']; return colors[(wo.customer_name?.charCodeAt(0) || 0) % colors.length]; };

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>Work Orders Master</Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Manage production work orders, track progress, and monitor completion status</Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <TextField placeholder="Search by WO number, SO number, customer, part number..." size="small" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={loading} sx={{ width: { xs: '100%', sm: 450 }, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} /></InputAdornment>, sx: { height: 36, bgcolor: COLORS.background.light, '& input': { padding: '6px 12px', fontSize: '0.75rem' } } }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && <Button variant="outlined" color="error" startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem' }} disabled={loading}>Delete ({selected.length})</Button>}
            
            {/* NEW: WIP Report Button */}
            <Button 
              variant="outlined" 
              startIcon={<WipReportIcon sx={{ fontSize: '1rem' }} />} 
              onClick={handleWipReport}
              sx={{ 
                height: 36, 
                borderRadius: 1.5, 
                textTransform: 'none', 
                fontSize: '0.75rem',
                borderColor: COLORS.primary,
                color: COLORS.primary,
                '&:hover': { borderColor: COLORS.primaryDark, bgcolor: `${COLORS.primary}10` }
              }}
            >
              WIP Report
            </Button>
            
            {/* NEW: Assembly Queue Button */}
            <Button 
              variant="outlined" 
              startIcon={<AssemblyQueueIcon sx={{ fontSize: '1rem' }} />} 
              onClick={handleAssemblyQueue}
              sx={{ 
                height: 36, 
                borderRadius: 1.5, 
                textTransform: 'none', 
                fontSize: '0.75rem',
                borderColor: COLORS.primary,
                color: COLORS.primary,
                '&:hover': { borderColor: COLORS.primaryDark, bgcolor: `${COLORS.primary}10` }
              }}
            >
              Assembly Queue
            </Button>
            
            <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} onClick={() => setOpenAdd(true)} sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none', '&:hover': { bgcolor: COLORS.primaryDark } }} disabled={loading}>Add Work Order</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}><Checkbox indeterminate={selected.length > 0 && selected.length < workOrders.length} checked={workOrders.length > 0 && selected.length === workOrders.length} onChange={handleSelectAll} disabled={loading || workOrders.length === 0} sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }} /></TableCell>
                {['WO / Customer', 'Item Details', 'Qty', 'Dates', 'Priority', 'Status', 'Actions'].map(h => (<TableCell key={h} align={h === 'Actions' ? 'center' : 'left'} sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>{h}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress size={32} sx={{ color: COLORS.primary }} /><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading work orders...</Typography></TableCell></TableRow>)
              : workOrders.length === 0 ? (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><AssignmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} /><Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>{searchTerm ? 'No work orders found' : 'No work orders available'}</Typography><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>{searchTerm ? 'Try adjusting your search terms' : 'Add your first work order to get started'}</Typography></TableCell></TableRow>)
              : workOrders.map((wo) => {
                const isSelected = selected.includes(wo._id);
                const menuOpen = Boolean(actionMenuAnchor) && selectedWorkOrderForMenu?._id === wo._id;
                const statusColors = STATUS_COLORS[wo.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                const priorityColors = PRIORITY_COLORS[wo.priority] || { bg: '#F1F5F9', color: '#475569' };
                const completionPercent = wo.planned_qty > 0 ? (wo.completed_qty / wo.planned_qty) * 100 : 0;
                return (
                  <TableRow key={wo._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10`, '&:hover': { bgcolor: `${COLORS.primary}20` } }, '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border } }}>
                    <TableCell padding="checkbox"><Checkbox checked={isSelected} onChange={() => handleSelect(wo._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }} /></TableCell>
                    <TableCell><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(wo), fontSize: '0.7rem', fontWeight: 600 }}>{getInitials(wo)}</Avatar><Box><Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{wo.wo_number}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{wo.customer_name}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>SO: {wo.so_number}</Typography></Box></Stack></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{wo.part_no}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, maxWidth: 200 }}>{wo.part_name?.substring(0, 40)}{wo.part_name?.length > 40 ? '...' : ''}</Typography>{wo.drawing_no && <Chip label={`DRG: ${wo.drawing_no}${wo.drawing_revision ? ` Rev ${wo.drawing_revision}` : ''}`} size="small" sx={{ mt: 0.5, height: 18, fontSize: '0.55rem', bgcolor: COLORS.primaryLight, color: COLORS.primary }} />}</TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{wo.completed_qty.toLocaleString()} / {wo.planned_qty.toLocaleString()}</Typography><Box sx={{ width: 100, mt: 0.5, bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}><Box sx={{ width: `${completionPercent}%`, bgcolor: completionPercent === 100 ? '#059669' : COLORS.primary, height: 3, borderRadius: 1 }} /></Box><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>{Math.round(completionPercent)}% complete</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned: {formatDate(wo.planned_start)} - {formatDate(wo.planned_end)}</Typography><Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Required: {formatDate(wo.required_by)}</Typography></TableCell>
                    <TableCell><Chip label={wo.priority || 'Medium'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: priorityColors.bg, color: priorityColors.color }} /></TableCell>
                    <TableCell><Chip icon={getStatusIcon(wo.status)} label={wo.status || 'Planned'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: statusColors.bg, color: statusColors.color, border: `1px solid ${statusColors.border}` }} /></TableCell>
                    <TableCell align="center"><ActionMenu 
                      item={wo} 
                      anchorEl={menuOpen ? actionMenuAnchor : null} 
                      onOpen={(e) => { setActionMenuAnchor(e.currentTarget); setSelectedWorkOrderForMenu(wo); }} 
                      onClose={() => { setActionMenuAnchor(null); setSelectedWorkOrderForMenu(null); }} 
                      onView={(w) => openModal(setOpenView, w)} 
                      onEdit={(w) => openModal(setOpenEdit, w)} 
                      onRelease={(w) => handleRelease(w)} 
                      onCancel={(w) => handleCancel(w)} 
                      onHold={(w) => handleHold(w)} 
                      onStart={(w) => handleStart(w)}
                      onResume={(w) => handleResume(w)} 
                      onCompleteOp={(w) => handleCompleteOp(w)} 
                      onCompleteWO={(w) => handleCompleteWO(w)} 
                      onLabour={(w) => handleLabour(w)}
                      onOperations={(w) => handleOpenOperations(w)}
                      onJobCosting={(w) => handleJobCosting(w)}
                      onJobCard={(w) => handleJobCard(w)}
                      onTimeline={(w) => handleTimeline(w)}
                    /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={totalItems} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRows} sx={{ borderTop: `1px solid ${COLORS.border}`, '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.7rem', color: COLORS.text.secondary }, '& .MuiTablePagination-select': { fontSize: '0.7rem' }, '& .MuiTablePagination-actions button': { color: COLORS.primary } }} />
      </Paper>

      <AddWorkOrder open={openAdd} onClose={() => setOpenAdd(false)} onAdd={afterAction(setOpenAdd, 'Work order created successfully!')} />
      {selectedWorkOrder && (<>
        <EditWorkOrder open={openEdit} onClose={() => closeModal(setOpenEdit)} workOrder={selectedWorkOrder} onUpdate={afterAction(setOpenEdit, 'Work order updated successfully!')} />
        <ViewWorkOrder open={openView} onClose={() => closeModal(setOpenView)} workOrder={selectedWorkOrder} onEdit={() => { setOpenView(false); setOpenEdit(true); }} />
        <CancelWorkOrderPopup open={openCancel} onClose={() => setOpenCancel(false)} workOrder={selectedWorkOrder} onCancel={handleCancelSubmit} />
        <HoldWorkOrderPopup open={openHold} onClose={() => setOpenHold(false)} workOrder={selectedWorkOrder} onHold={handleHoldSubmit} />
        <ResumeWorkOrderPopup open={openResume} onClose={() => setOpenResume(false)} workOrder={selectedWorkOrder} onResume={handleResumeSubmit} />
        <CompleteOperationPopup open={openCompleteOp} onClose={() => setOpenCompleteOp(false)} workOrder={selectedWorkOrder} onComplete={handleCompleteOpSubmit} />
        <CompleteWorkOrderPopup open={openCompleteWO} onClose={() => setOpenCompleteWO(false)} workOrder={selectedWorkOrder} onComplete={handleCompleteWOSubmit} />
        <LabourEntryPopup open={openLabour} onClose={() => setOpenLabour(false)} workOrder={selectedWorkOrder} onLabour={handleLabourSubmit} />
        <AddOperationsPopup open={openOperations} onClose={() => setOpenOperations(false)} workOrder={selectedWorkOrder} onOperationsAdded={handleOperationsAdded} />
        <JobCostingPopup open={openJobCosting} onClose={() => setOpenJobCosting(false)} workOrder={selectedWorkOrder} />
        <TimelinePopup open={openTimeline} onClose={() => setOpenTimeline(false)} workOrder={selectedWorkOrder} />
      </>)}
      
      {/* WIP Report Popup */}
      <WipReportPopup open={openWipReport} onClose={() => setOpenWipReport(false)} />
      
      {/* Assembly Queue Popup */}
      <AssemblyQueuePopup open={openAssemblyQueue} onClose={() => setOpenAssemblyQueue(false)} />
      
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
};

export default WorkOrdersMaster;