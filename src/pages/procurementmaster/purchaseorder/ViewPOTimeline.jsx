// ViewPOTimeline.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Close as CloseIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
  EventNote as EventIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warehouse as WarehouseIcon,
  Category as CategoryIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIconComponent,
  Summarize as SummarizeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const timelineSteps = ['Overview', 'Timeline Events', 'Receipt Tracking'];

// Event type configuration
const EVENT_CONFIG = {
  PO_CREATED: { icon: <ReceiptIcon />, color: '#3B82F6', label: 'PO Created' },
  PO_APPROVED: { icon: <CheckCircleIcon />, color: '#10B981', label: 'PO Approved' },
  GRN_CREATED: { icon: <LocalShippingIcon />, color: '#8B5CF6', label: 'GRN Created' },
  QC_COMPLETED: { icon: <ScienceIcon />, color: '#F59E0B', label: 'QC Completed' },
  STOCK_UPDATED: { icon: <InventoryIcon />, color: '#06B6D4', label: 'Stock Updated' },
  BATCH_RECEIVED: { icon: <QrCodeIcon />, color: '#EC4899', label: 'Batch Received' }
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = () => {
    if (status === 'Accepted' || status === 'Approved') {
      return { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> };
    }
    if (status === 'Rejected') {
      return { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> };
    }
    if (status === 'Pending' || status === 'Partially Received') {
      return { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> };
    }
    return { bg: '#F1F5F9', color: '#475569', icon: null };
  };

  const config = getStatusConfig();
  return (
    <Chip
      icon={config.icon}
      label={status}
      size="small"
      sx={{
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 24,
        bgcolor: config.bg,
        color: config.color,
        '& .MuiChip-icon': { fontSize: '0.7rem' }
      }}
    />
  );
};

// Batch Card Component
const BatchCard = ({ batch }) => {
  const [expanded, setExpanded] = useState(false);
  const isExpiring = batch.expiry_date && new Date(batch.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card sx={{ mb: 1.5, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
              <QrCodeIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                Batch: {batch.batch_number || '-'}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                Quantity: {batch.received_qty || batch.qty || 0} units
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {isExpiring && (
              <Tooltip title="Batch nearing expiration">
                <WarningIcon sx={{ fontSize: '1rem', color: COLORS.warning }} />
              </Tooltip>
            )}
            <StatusChip status={batch.qc_status || (batch.accepted_qty > 0 ? 'Accepted' : 'Pending')} />
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={expanded}>
          <Divider sx={{ my: 1.5 }} />
          <Grid container spacing={1.5}>
            {(batch.warehouse || batch.bin_location) && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarehouseIcon sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Storage Location</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {batch.warehouse || '-'} {batch.bin_location ? `/ ${batch.bin_location}` : ''}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {batch.qc_results && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScienceIcon sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>QC Results</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip label={`Accepted: ${batch.accepted_qty || 0}`} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: '#D1FAE5', color: '#065F46' }} />
                      <Chip label={`Rejected: ${batch.rejected_qty || 0}`} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: '#FEE2E2', color: '#991B1B' }} />
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            )}
            {batch.expiry_date && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Expiry Date</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: isExpiring ? COLORS.warning : COLORS.text.primary }}>
                      {formatDate(batch.expiry_date)}
                      {isExpiring && ' (Expiring soon!)'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {batch.transaction_id && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Transaction ID</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>{batch.transaction_id}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {batch.rejection_reason && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelIcon sx={{ fontSize: '0.8rem', color: COLORS.error }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Rejection Reason</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.error }}>{batch.rejection_reason}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

// Main Timeline Component
const ViewPOTimeline = ({ open, onClose, poId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timelineData, setTimelineData] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open && poId) {
      fetchTimeline();
    }
  }, [open, poId]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${BASE_URL}/api/grns/po/${poId}/timeline?include_rejected=true&include_pending=true`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTimelineData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load timeline data');
      }
    } catch (err) {
      console.error('Error fetching PO timeline:', err);
      setError(err.response?.data?.message || 'Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getEventIcon = (eventType) => {
    const config = EVENT_CONFIG[eventType];
    if (config) {
      return (
        <Avatar sx={{ width: 32, height: 32, bgcolor: `${config.color}20`, color: config.color }}>
          {config.icon}
        </Avatar>
      );
    }
    return <HistoryIcon />;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (!open) return null;

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ color: COLORS.primary }} />
          <Typography sx={{ mt: 2, color: COLORS.text.secondary }}>Loading PO Timeline...</Typography>
        </Box>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Dialog>
    );
  }

  const { po, overall_summary, po_timeline, item_timeline, pending_items, rejected_items } = timelineData || {};

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Overview
        return (
          <Stack spacing={2}>
            {/* Overall Summary Cards */}
            {overall_summary && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <AssessmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Overall Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Ordered Qty</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
                        {overall_summary.total_ordered_qty}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Received Qty</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.success }}>
                        {overall_summary.total_received_qty}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Accepted</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.success }}>
                        {overall_summary.total_accepted_qty || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2.4 }}>
                    <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rejected</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.error }}>
                        {overall_summary.total_rejected_qty || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2.4 }}>
                    <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: COLORS.background.light, borderRadius: 2 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Completion</Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary }}>
                        {overall_summary.completion_percentage || '0%'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* PO Information */}
            {po && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Purchase Order Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, minWidth: 100 }}>PO Number:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{po.po_number}</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, minWidth: 100 }}>PO Date:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{formatDate(po.po_date)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, minWidth: 100 }}>Vendor:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>{po.vendor?.vendor_name || po.vendor_name}</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, minWidth: 100 }}>Status:</Typography>
                      <StatusChip status={po.status} />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Pending & Rejected Summary */}
            <Grid container spacing={2}>
              {pending_items && pending_items.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.warning, mb: 1.5 }}>
                      <PendingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Pending Items ({pending_items.length})
                    </Typography>
                    <Stack spacing={1}>
                      {pending_items.slice(0, 5).map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.7rem' }}>{item.part_no} - {item.description}</Typography>
                          <Chip label={`Pending: ${item.pending_qty}`} size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                        </Box>
                      ))}
                      {pending_items.length > 5 && (
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, textAlign: 'center' }}>
                          +{pending_items.length - 5} more items
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              )}
              {rejected_items && rejected_items.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.error, mb: 1.5 }}>
                      <CancelIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Rejected Items ({rejected_items.length})
                    </Typography>
                    <Stack spacing={1}>
                      {rejected_items.slice(0, 5).map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.7rem' }}>{item.part_no} - Batch: {item.batch_number || 'N/A'}</Typography>
                          <Chip label={`Rejected: ${item.rejected_qty}`} size="small" sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.error + '20', color: COLORS.error }} />
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Stack>
        );

      case 1: // Timeline Events
        return (
          <Stack spacing={2}>
            {/* PO Timeline Events */}
            {po_timeline && po_timeline.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  <TimelineIconComponent sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  PO Timeline Events
                </Typography>
                <Timeline position="alternate">
                  {po_timeline.map((event, idx) => (
                    <TimelineItem key={event.event_id || idx}>
                      <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {formatDate(event.event_date)}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: event.color === 'green' ? COLORS.success : COLORS.info }}>
                          {event.icon === '✓' ? <CheckCircleIcon sx={{ fontSize: '0.8rem' }} /> : 
                           event.icon === '📄' ? <ReceiptIcon sx={{ fontSize: '0.8rem' }} /> : 
                           <EventIcon sx={{ fontSize: '0.8rem' }} />}
                        </TimelineDot>
                        {idx < po_timeline.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ m: 'auto 0' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {event.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {event.description}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>
            )}

            {/* Item Events Summary */}
            {item_timeline && item_timeline.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <HistoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Recent Item Events
                </Typography>
                <Stack spacing={1.5}>
                  {item_timeline.slice(0, 3).map((item, itemIdx) => (
                    item.events && item.events.slice(0, 2).map((event, eventIdx) => (
                      <Paper key={`${itemIdx}-${eventIdx}`} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          {getEventIcon(event.event_type)}
                          <Box flex={1}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {item.part_no} - {event.title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              {event.description}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {formatDate(event.event_date)}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>
        );

      case 2: // Receipt Tracking
        return (
          <Stack spacing={2}>
            {/* Item-wise Receipt Tracking */}
            {item_timeline && item_timeline.map((item) => (
              <Paper key={item.po_item_id} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                {/* Item Header */}
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  sx={{ mb: 2, cursor: 'pointer' }}
                  onClick={() => toggleItemExpand(item.po_item_id)}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                      <CategoryIcon />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                        {item.part_no} - {item.description}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Ordered: {item.ordered_qty} {item.unit} | Received: {item.received_qty} | Pending: {item.pending_qty}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box>
                    <Chip 
                      label={`Acceptance Rate: ${item.summary?.acceptance_rate || 0}%`}
                      size="small"
                      sx={{ fontSize: '0.65rem', mr: 1, bgcolor: COLORS.background.light }}
                    />
                    {expandedItems[item.po_item_id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                </Stack>

                <Collapse in={expandedItems[item.po_item_id]}>
                  {/* Batches */}
                  {item.batches && item.batches.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                        Batch-wise Receipt Tracking
                      </Typography>
                      {item.batches.map((batch, idx) => (
                        <BatchCard key={idx} batch={batch} />
                      ))}
                    </Box>
                  )}

                  {/* Events */}
                  {item.events && item.events.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                        Item Events
                      </Typography>
                      <Stack spacing={1}>
                        {item.events.map((event, idx) => (
                          <Paper key={idx} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              {getEventIcon(event.event_type)}
                              <Box flex={1}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                  {event.title}
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                                  {event.description}
                                </Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {formatDate(event.event_date)}
                              </Typography>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Collapse>
              </Paper>
            ))}

            {/* Full Pending Items Table */}
            {pending_items && pending_items.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.warning, mb: 1.5 }}>
                  Pending Items for Future Receipt
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Ordered</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Received</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Pending</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pending_items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.ordered_qty}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">{item.received_qty || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                            <Chip label={item.pending_qty} size="small" sx={{ bgcolor: COLORS.warning + '20', color: COLORS.warning, fontWeight: 600 }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Full Rejected Items Table */}
            {rejected_items && rejected_items.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.error, mb: 1.5 }}>
                  Rejected Items Summary
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Batch No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Rejected Qty</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Reason</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>QC Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rejected_items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.part_no}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.batch_number || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="center">
                            <Chip label={item.rejected_qty} size="small" sx={{ bgcolor: COLORS.error + '20', color: COLORS.error, fontWeight: 600 }} />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{item.rejection_reason || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(item.qc_date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ background: HEADER_GRADIENT, py: 1.5, px: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ReceiptIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>
              Purchase Order Timeline
            </Typography>
          </Stack>
          <Chip
            label={`PO: ${po?.po_number || 'Loading...'}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '10px',
              height: '24px',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ 
            mt: 0.5,
            '& .MuiStepLabel-label': {
              color: '#FFFFFF !important',
              opacity: 0.8,
              fontSize: '0.7rem !important',
              '&.Mui-active': {
                color: '#FFFFFF !important',
                opacity: 1,
                fontWeight: 600
              },
              '&.Mui-completed': {
                color: '#FFFFFF !important',
                opacity: 1
              }
            }
          }}
        >
          {timelineSteps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.7rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ 
        p: 2.5, 
        overflow: 'auto', 
        maxHeight: 'calc(90vh - 140px)',
        backgroundColor: '#F8FFFC'
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid #E3E8EF',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          size="small"
          sx={{ 
            color: '#64748B', 
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#F1F5F9' }
          }}
        >
          Close
        </Button>

        <Stack direction="row" spacing={1}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              size="small"
              startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                color: '#64748B', 
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < timelineSteps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                backgroundColor: PRIMARY_DARK,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#05292B',
                  boxShadow: 'none'
                }
              }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewPOTimeline;