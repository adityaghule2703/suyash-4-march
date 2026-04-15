// ViewWorkOrder.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Stack, Chip, Paper, Divider, Grid
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  DateRange as DateRangeIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';

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
  'Planned': { bg: '#E0F2FE', color: '#0284C7' },
  'Released': { bg: '#E0E7FF', color: '#4338CA' },
  'Components Kitted': { bg: '#FEF3C7', color: '#D97706' },
  'In Progress': { bg: '#E0F2FE', color: '#0284C7' },
  'Partially Completed': { bg: '#FEF3C7', color: '#D97706' },
  'On Hold': { bg: '#FEE2E2', color: '#DC2626' },
  'Completed': { bg: '#D1FAE5', color: '#059669' },
  'Cancelled': { bg: '#F3F4F6', color: '#6B7280' }
};

const PRIORITY_COLORS = {
  'Critical': '#DC2626',
  'High': '#D97706',
  'Medium': '#0284C7',
  'Low': '#059669'
};

const ViewWorkOrder = ({ open, onClose, workOrder, onEdit }) => {
  if (!workOrder) return null;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon sx={{ fontSize: '1rem' }} />;
      case 'Cancelled': return <CancelIcon sx={{ fontSize: '1rem' }} />;
      case 'On Hold': return <PauseIcon sx={{ fontSize: '1rem' }} />;
      case 'In Progress': return <PlayArrowIcon sx={{ fontSize: '1rem' }} />;
      default: return <AssignmentIcon sx={{ fontSize: '1rem' }} />;
    }
  };

  const statusColors = STATUS_COLORS[workOrder.status] || { bg: '#F1F5F9', color: '#475569' };
  const priorityColor = PRIORITY_COLORS[workOrder.priority] || '#475569';
  const completionPercent = workOrder.planned_qty > 0 ? (workOrder.completed_qty / workOrder.planned_qty) * 100 : 0;

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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Work Order Details
        </Typography>
        <Chip
          icon={getStatusIcon(workOrder.status)}
          label={workOrder.status || 'Planned'}
          size="small"
          sx={{ fontSize: '0.7rem', fontWeight: 500, height: 28, bgcolor: statusColors.bg, color: statusColors.color }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Header Info */}
          <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssignmentIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Order Number</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.primary }}>
                      {workOrder.wo_number}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 32, color: COLORS.primary }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {workOrder.customer_name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                      SO: {workOrder.so_number}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Item Details */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Item Details
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Number</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.part_no}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Name</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.part_name}
                </Typography>
              </Grid>
              {workOrder.drawing_no && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Drawing No / Revision</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {workOrder.drawing_no} {workOrder.drawing_revision ? `(Rev ${workOrder.drawing_revision})` : ''}
                  </Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM / Routing</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.bom_version} / {workOrder.routing_id}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Quantity & Progress */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Production Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
                  {workOrder.planned_qty.toLocaleString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Completed Quantity</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                  {workOrder.completed_qty.toLocaleString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rejected / Scrap</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#DC2626' }}>
                  {workOrder.rejected_qty} / {workOrder.scrap_qty}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Completion</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                  {Math.round(completionPercent)}%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${completionPercent}%`,
                    bgcolor: completionPercent === 100 ? '#059669' : COLORS.primary,
                    height: 6,
                    borderRadius: 1
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Dates */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Schedule Dates
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned Start</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(workOrder.planned_start)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Planned End</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(workOrder.planned_end)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Required By</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(workOrder.required_by)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Date</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(workOrder.wo_date)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Priority & Status */}
          <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <PriorityHighIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Priority & Status
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Priority</Typography>
                <Chip
                  label={workOrder.priority || 'Medium'}
                  size="small"
                  sx={{ mt: 0.5, fontSize: '0.7rem', fontWeight: 500, bgcolor: `${priorityColor}20`, color: priorityColor }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Order Type</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {workOrder.wo_type || 'Machining'}
                </Typography>
              </Grid>
              {workOrder.assembly_line && (
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Assembly Line</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {workOrder.assembly_line}
                  </Typography>
                </Grid>
              )}
              {workOrder.hold_reason && (
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Hold Reason</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.primary }}>
                    {workOrder.hold_reason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Operations */}
          {workOrder.operations && workOrder.operations.length > 0 && (
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Operations
              </Typography>
              <Stack spacing={1}>
                {workOrder.operations.map((op, idx) => (
                  <Box key={idx} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {op.op_sequence}. {op.operation_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          Work Centre: {op.work_centre}
                          {op.is_subcontract && ` | Vendor: ${op.subcontract_vendor}`}
                        </Typography>
                      </Box>
                      <Chip
                        label={op.status || 'Pending'}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 22 }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Qty: {op.output_qty || 0} / {op.planned_qty}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Rej: {op.rejection_qty || 0}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
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
          onClick={onClose}
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
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            onEdit();
          }}
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
          Edit Work Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewWorkOrder;