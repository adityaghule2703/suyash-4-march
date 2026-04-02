// MrpRunStatus.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
  Divider,
  Paper,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ShoppingCart as ShoppingCartIcon,
  Factory as FactoryIcon,
  BugReport as BugReportIcon,
  Terminal as TerminalIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import axios from 'axios';
import { COLORS, MRP_STATUS_COLORS, formatDateTime } from './constants';
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
      size="medium"
      sx={{
        fontSize: '0.8rem',
        fontWeight: 600,
        height: 32,
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

// Queue Status Component
const QueueStatusDisplay = ({ queueStatus }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!queueStatus) return null;

  const getStateIcon = () => {
    switch (queueStatus.state) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#059669' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: '#DC2626' }} />;
      case 'active':
        return <PendingIcon sx={{ color: '#D97706' }} />;
      case 'waiting':
        return <ScheduleIcon sx={{ color: '#4F46E5' }} />;
      default:
        return <InfoIcon sx={{ color: COLORS.text.secondary }} />;
    }
  };

  const getStateColor = () => {
    switch (queueStatus.state) {
      case 'completed':
        return { bg: '#D1FAE5', color: '#059669' };
      case 'failed':
        return { bg: '#FEE2E2', color: '#DC2626' };
      case 'active':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'waiting':
        return { bg: '#E0E7FF', color: '#4F46E5' };
      default:
        return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  const stateColor = getStateColor();

  return (
    <Card sx={{ 
      borderRadius: 1.5, 
      border: `1px solid ${COLORS.border}`,
      bgcolor: COLORS.background.white,
      mb: 2
    }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
            Queue Status
          </Typography>
          <Chip
            icon={getStateIcon()}
            label={queueStatus.state?.toUpperCase()}
            size="small"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 500,
              height: 24,
              bgcolor: stateColor.bg,
              color: stateColor.color
            }}
          />
        </Stack>

        {/* Progress Bar */}
        {queueStatus.progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                Progress
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.primary }}>
                {queueStatus.progress}%
              </Typography>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={queueStatus.progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: COLORS.border,
                '& .MuiLinearProgress-bar': {
                  bgcolor: queueStatus.state === 'failed' ? '#DC2626' : COLORS.primary,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}

        {/* Failed Reason */}
        {queueStatus.failedReason && (
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                fontSize: '0.65rem',
                color: '#DC2626',
                textTransform: 'none',
                p: 0,
                mb: 1,
                '&:hover': { bgcolor: 'transparent' }
              }}
              startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expanded ? 'Hide Error Details' : 'Show Error Details'}
            </Button>
            
            <Collapse in={expanded}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: '#FEF2F2',
                  borderColor: '#FECACA',
                  borderRadius: 1,
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <BugReportIcon sx={{ fontSize: '0.8rem', color: '#DC2626', mt: 0.2 }} />
                  <Typography 
                    sx={{ 
                      fontSize: '0.7rem', 
                      color: '#991B1B',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {queueStatus.failedReason}
                  </Typography>
                </Stack>
              </Paper>
            </Collapse>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Log Tail Component
const LogTailDisplay = ({ logTail }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!logTail) return null;

  const lines = logTail.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return null;

  const displayLines = expanded ? lines : lines.slice(0, 5);

  return (
    <Card sx={{ 
      borderRadius: 1.5, 
      border: `1px solid ${COLORS.border}`,
      bgcolor: COLORS.background.white
    }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TerminalIcon sx={{ fontSize: '0.9rem', color: COLORS.text.secondary }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
              Log Output
            </Typography>
          </Stack>
          {lines.length > 5 && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                fontSize: '0.65rem',
                textTransform: 'none',
                color: COLORS.primary
              }}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expanded ? 'Show Less' : `Show All (${lines.length})`}
            </Button>
          )}
        </Stack>
        
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            bgcolor: '#0A0A0A',
            borderRadius: 1,
            maxHeight: expanded ? 400 : 200,
            overflow: 'auto',
            fontFamily: 'monospace'
          }}
        >
          {displayLines.map((line, index) => {
            // Color-code different log levels
            let color = '#A0A0A0';
            if (line.includes('ERROR') || line.includes('Failed')) color = '#FF6B6B';
            else if (line.includes('WARNING')) color = '#FFB347';
            else if (line.includes('SUCCESS') || line.includes('Completed')) color = '#6BCB77';
            else if (line.includes('INFO')) color = '#4D96FF';
            else if (line.includes('PROCESSING')) color = '#FF9F4A';
            
            return (
              <Typography 
                key={index}
                sx={{ 
                  fontSize: '0.65rem', 
                  color: color,
                  fontFamily: 'monospace',
                  lineHeight: 1.4,
                  mb: 0.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {line}
              </Typography>
            );
          })}
        </Paper>
      </CardContent>
    </Card>
  );
};

// Info Card Component
const InfoCard = ({ title, value, icon, color }) => (
  <Card sx={{ 
    borderRadius: 1.5, 
    border: `1px solid ${COLORS.border}`,
    bgcolor: COLORS.background.white,
    height: '100%'
  }}>
    <CardContent sx={{ p: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ color: color, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// Main Component
const MrpRunStatus = ({ open, onClose, mrpRunId, onRerun, autoRefresh = true, refreshInterval = 3000 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(autoRefresh);

  const fetchStatus = useCallback(async (showRefreshing = false) => {
    if (!mrpRunId) return;
    
    if (showRefreshing) {
      setRefreshing(true);
    } else if (!statusData) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/mrp/runs/${mrpRunId}/status`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStatusData(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch status');
      }
    } catch (err) {
      console.error('Error fetching MRP status:', err);
      setError(err.response?.data?.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mrpRunId, statusData]);

  // Initial fetch
  useEffect(() => {
    if (open && mrpRunId) {
      fetchStatus();
    }
  }, [open, mrpRunId, fetchStatus]);

  // Auto-refresh for running jobs
  useEffect(() => {
    if (!open || !autoRefreshEnabled || !statusData) return;
    
    // Auto-refresh only for non-terminal statuses
    const shouldAutoRefresh = statusData.status === 'Running' || statusData.status === 'Queued';
    
    if (shouldAutoRefresh) {
      const interval = setInterval(() => {
        fetchStatus(true);
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [open, autoRefreshEnabled, statusData, fetchStatus, refreshInterval]);

  const handleRefresh = () => {
    fetchStatus(true);
  };

  const handleRerun = () => {
    if (onRerun && statusData) {
      onRerun(statusData);
      onClose();
    }
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
  };

  const isTerminalStatus = () => {
    return statusData?.status === 'Completed' || statusData?.status === 'Failed';
  };

  const getProgressValue = () => {
    if (!statusData) return 0;
    if (statusData.status === 'Completed') return 100;
    if (statusData.status === 'Failed') return 100;
    if (statusData.queue_status?.progress) return statusData.queue_status.progress;
    
    // Estimate based on counts
    if (statusData.pr_count > 0 || statusData.wo_count > 0) return 50;
    return 25;
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
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
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
          <ScheduleIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              MRP Run Status
            </Typography>
            {statusData && (
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                {statusData.mrp_run_id}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={autoRefreshEnabled ? 'Auto-refresh ON' : 'Auto-refresh OFF'}>
            <IconButton 
              onClick={handleAutoRefreshToggle} 
              size="small"
              sx={{ 
                color: autoRefreshEnabled ? COLORS.primary : COLORS.text.secondary,
                bgcolor: autoRefreshEnabled ? `${COLORS.primary}10` : 'transparent'
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.secondary }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={48} sx={{ color: COLORS.primary, mb: 2 }} />
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading status...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-message': { fontSize: '0.75rem' }
            }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : statusData ? (
          <>
            {/* Overall Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  Overall Progress
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {getProgressValue()}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={getProgressValue()} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: COLORS.border,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: statusData.status === 'Failed' ? '#DC2626' : COLORS.primary,
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Status Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <StatusChip status={statusData.status} />
              {refreshing && (
                <CircularProgress size={20} sx={{ color: COLORS.primary }} />
              )}
            </Stack>

            {/* Info Cards Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <InfoCard
                  title="Run Type"
                  value={statusData.run_type}
                  icon={<PlayArrowIcon sx={{ fontSize: '1rem' }} />}
                  color={COLORS.primary}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <InfoCard
                  title="Run Date"
                  value={formatDateTime(statusData.run_date)}
                  icon={<ScheduleIcon sx={{ fontSize: '1rem' }} />}
                  color={COLORS.text.secondary}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <InfoCard
                  title="Purchase Reqs"
                  value={statusData.pr_count || 0}
                  icon={<ShoppingCartIcon sx={{ fontSize: '1rem' }} />}
                  color="#1E40AF"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <InfoCard
                  title="Work Orders"
                  value={statusData.wo_count || 0}
                  icon={<FactoryIcon sx={{ fontSize: '1rem' }} />}
                  color="#D97706"
                />
              </Grid>
            </Grid>

            {/* Completion Time */}
            {statusData.completed_at && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 1.5,
                  '& .MuiAlert-message': { fontSize: '0.7rem' }
                }}
                icon={<CheckCircleIcon fontSize="small" />}
              >
                Completed at: {formatDateTime(statusData.completed_at)}
              </Alert>
            )}

            {/* Queue Status */}
            <QueueStatusDisplay queueStatus={statusData.queue_status} />

            {/* Log Tail */}
            <LogTailDisplay logTail={statusData.log_tail} />

            {/* Warning for failed status */}
            {statusData.status === 'Failed' && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  borderRadius: 1.5,
                  '& .MuiAlert-message': { fontSize: '0.7rem' }
                }}
                icon={<WarningIcon />}
              >
                MRP run failed. Please check the error details above and try again.
              </Alert>
            )}

            {/* Refresh button for manual refresh */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                disabled={refreshing}
                startIcon={<RefreshIcon />}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  borderRadius: 1.5
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Status'}
              </Button>
            </Box>
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
        {isTerminalStatus() && (
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

export default MrpRunStatus;