// Timeline.jsx
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
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
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

const STATUS_COLORS = {
  'Planned': { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  'In Progress': { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  'Completed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
};

const TimelinePopup = ({ open, onClose, workOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timelineData, setTimelineData] = useState(null);

  useEffect(() => {
    if (open && workOrder) {
      fetchTimeline();
    }
  }, [open, workOrder]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/work-orders/${workOrder._id}/operations/timeline`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const data = response.data.data;
        // Check if it's the "no operations" case
        if (data.message === "No operations defined on this Work Order" || (!data.summary && data.operations?.length === 0)) {
          setTimelineData({
            hasOperations: false,
            message: data.message || "No operations defined on this Work Order"
          });
        } 
        // Valid data with operations
        else if (data && data.summary && data.operations && data.operations.length > 0) {
          setTimelineData({
            hasOperations: true,
            summary: data.summary,
            operations: data.operations
          });
        }
        // Fallback for empty operations but with summary
        else if (data && data.summary && data.operations && data.operations.length === 0) {
          setTimelineData({
            hasOperations: false,
            message: "No operations found for this Work Order",
            summary: data.summary
          });
        }
        else {
          console.error('Invalid timeline data structure:', data);
          setError('Invalid data structure received from server');
          setTimelineData(null);
        }
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
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <TimelineIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Operations Timeline
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : timelineData && !timelineData.hasOperations ? (
          // No operations case - show friendly message
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            {timelineData.message || "No operations defined on this Work Order"}
          </Alert>
        ) : timelineData && timelineData.hasOperations && timelineData.summary ? (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>WO Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{timelineData.summary.wo_number || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Part</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{timelineData.summary.part_no || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Progress</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#059669' }}>{timelineData.summary.percent_complete || 0}%</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Status</Typography>
                  <Chip 
                    label={timelineData.summary.wo_status || 'Unknown'} 
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

            <Paper sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Planned Total</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{timelineData.summary.total_planned_min || 0} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Actual Total</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#D97706' }}>{timelineData.summary.total_actual_min || 0} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Overall Yield</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>{timelineData.summary.overall_yield_percent || 0}%</Typography>
                </Grid>
              </Grid>
            </Paper>

            {timelineData.operations && timelineData.operations.length > 0 ? (
              <>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary, mt: 1 }}>
                  Operation Timeline
                </Typography>

                <Box sx={{ position: 'relative' }}>
                  {timelineData.operations.map((op, index) => (
                    <Box key={op.op_sequence || index} sx={{ display: 'flex', mb: 2 }}>
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
                              Op {op.op_sequence || '—'}
                            </Typography>
                            <Chip 
                              label={op.status || 'Pending'} 
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
                          {op.operation_name || 'Unknown Operation'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 1 }}>
                          {op.work_centre || '—'}
                        </Typography>

                        <Grid container spacing={1}>
                          <Grid size={{ xs: 4 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Planned Qty</Typography>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>{op.planned?.qty || 0}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Output Qty</Typography>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>{op.output?.output_qty || 0}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Yield</Typography>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: '#059669' }}>{op.output?.yield_percent || 0}%</Typography>
                          </Grid>
                        </Grid>

                        {op.actual?.start && (
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
                                <Typography sx={{ fontSize: '0.6rem' }}>{op.actual.setup_min || 0}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography sx={{ fontSize: '0.55rem', color: COLORS.text.tertiary }}>Run (min/pc)</Typography>
                                <Typography sx={{ fontSize: '0.6rem' }}>{op.actual.run_min_per_pc || 0}</Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 1.5, mt: 2 }}>
                No operations found for this Work Order
              </Alert>
            )}
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            No timeline data available
          </Alert>
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

export default TimelinePopup;