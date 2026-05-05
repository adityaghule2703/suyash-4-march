// ViewWorkOrder.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  IconButton,
  Divider,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  DateRange as DateRangeIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

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
  border: '#E3E8EF'
};

const steps = ['Overview', 'Production', 'Operations'];

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

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? COLORS.primary : '#ccc',
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
    backgroundColor: COLORS.primary,
    boxShadow: '0 4px 10px 0 rgba(6,60,63,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: COLORS.primary,
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

const ViewWorkOrder = ({ open, onClose, workOrder }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!workOrder) return null;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Cancelled': return <CancelIcon sx={{ fontSize: '0.7rem' }} />;
      case 'On Hold': return <PauseIcon sx={{ fontSize: '0.7rem' }} />;
      case 'In Progress': return <PlayArrowIcon sx={{ fontSize: '0.7rem' }} />;
      default: return <AssignmentIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const statusColors = STATUS_COLORS[workOrder.status] || { bg: '#F1F5F9', color: '#475569' };
  const priorityColor = PRIORITY_COLORS[workOrder.priority] || '#475569';
  const completionPercent = workOrder.planned_qty > 0 ? (workOrder.completed_qty / workOrder.planned_qty) * 100 : 0;

  // Helper function to render field
  const renderField = (label, value, monospace = false, highlight = false) => (
    <Box>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ 
        fontSize: '0.8rem', 
        fontWeight: highlight ? 700 : 500, 
        color: highlight ? COLORS.primary : COLORS.text.primary,
        fontFamily: monospace ? 'monospace' : 'inherit',
        wordBreak: 'break-word'
      }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Overview
        return (
          <Stack spacing={2}>
            {/* Header Section - Work Order Overview */}
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
                <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Work Order Overview
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {workOrder.wo_number}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    WO ID: {workOrder._id?.slice(-8) || 'N/A'}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={getStatusIcon(workOrder.status)}
                    label={workOrder.status || 'Planned'}
                    size="small"
                    sx={{ fontSize: '0.7rem', fontWeight: 500, bgcolor: statusColors.bg, color: statusColors.color }}
                  />
                  <Chip
                    label={workOrder.priority || 'Medium'}
                    size="small"
                    sx={{ fontSize: '0.7rem', fontWeight: 500, bgcolor: `${priorityColor}20`, color: priorityColor }}
                  />
                </Stack>
              </Stack>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('WO Date', formatDate(workOrder.wo_date))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Work Order Type', workOrder.wo_type)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('SO Number', workOrder.so_number)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Customer Name', workOrder.customer_name, false, true)}
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
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Item Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Part Number', workOrder.part_no, true, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Part Name', workOrder.part_name)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Drawing No / Revision', `${workOrder.drawing_no || '-'} ${workOrder.drawing_revision ? `(Rev ${workOrder.drawing_revision})` : ''}`)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('BOM / Routing', `${workOrder.bom_version} / ${workOrder.routing_id || '-'}`)}
                </Grid>
                {workOrder.assembly_line && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Assembly Line', typeof workOrder.assembly_line === 'object' ? workOrder.assembly_line.line_name : workOrder.assembly_line)}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Schedule Dates */}
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
                <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Schedule Dates
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Planned Start', formatDate(workOrder.planned_start))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Planned End', formatDate(workOrder.planned_end))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Required By', formatDate(workOrder.required_by))}
                </Grid>
                {workOrder.actual_start && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Actual Start', formatDateTime(workOrder.actual_start))}
                  </Grid>
                )}
                {workOrder.actual_end && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField('Actual End', formatDateTime(workOrder.actual_end))}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Hold Reason */}
            {workOrder.hold_reason && (
              <Paper sx={{ 
                p: 2, 
                borderRadius: 1.5, 
                border: '1px solid #FDE68A',
                bgcolor: '#FEF3C7'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: '#92400E', 
                  mb: 1.5 
                }}>
                  <PauseIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Hold Reason
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#92400E' }}>
                  {workOrder.hold_reason}
                </Typography>
              </Paper>
            )}
          </Stack>
        );

      case 1: // Production
        return (
          <Stack spacing={2}>
            {/* Production Progress */}
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
                Production Progress
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Planned Quantity', workOrder.planned_qty.toLocaleString(), false, true)}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Completed Quantity', workOrder.completed_qty.toLocaleString())}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  {renderField('Rejected / Scrap', `${workOrder.rejected_qty} / ${workOrder.scrap_qty}`)}
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
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

            {/* System Information */}
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
                <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                System Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created At', formatDateTime(workOrder.createdAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Last Updated', formatDateTime(workOrder.updatedAt))}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField('Created By', workOrder.created_by?.username || workOrder.created_by?.email || '-' )}
                </Grid>
              </Grid>
            </Paper>

            {/* Rework Info */}
            {workOrder.rework_qty > 0 && (
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
                  Rework Information
                </Typography>
                {renderField('Rework Quantity', workOrder.rework_qty)}
              </Paper>
            )}
          </Stack>
        );

      case 2: // Operations
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
                <AssignmentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Operations ({workOrder.operations?.length || 0})
              </Typography>
              
              {workOrder.operations && workOrder.operations.length > 0 ? (
                <Stack spacing={1.5}>
                  {workOrder.operations.map((op, idx) => {
                    const opStatusColors = STATUS_COLORS[op.status] || { bg: '#F1F5F9', color: '#475569' };
                    return (
                      <Paper 
                        key={idx} 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: COLORS.background.light, 
                          borderRadius: 1.5,
                          border: `1px solid ${COLORS.border}`
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.text.primary }}>
                              {op.op_sequence}. {op.operation_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mt: 0.5 }}>
                              Work Centre: {op.work_centre}
                              {op.is_subcontract && ` | Vendor: ${op.subcontract_vendor || 'N/A'}`}
                            </Typography>
                          </Box>
                          <Chip
                            icon={getStatusIcon(op.status)}
                            label={op.status || 'Pending'}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: 22, bgcolor: opStatusColors.bg, color: opStatusColors.color }}
                          />
                        </Stack>
                        
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Qty: {op.output_qty || 0} / {op.planned_qty}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Rej: {op.rejection_qty || 0}
                          </Typography>
                          {op.actual_setup_min > 0 && (
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Setup: {op.actual_setup_min} min
                            </Typography>
                          )}
                          {op.actual_run_min > 0 && (
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Run: {op.actual_run_min} min
                            </Typography>
                          )}
                        </Stack>
                        
                        {op.actual_start && (
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                              Started: {formatDateTime(op.actual_start)}
                            </Typography>
                            {op.actual_end && (
                              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                                Ended: {formatDateTime(op.actual_end)}
                              </Typography>
                            )}
                          </Stack>
                        )}
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, textAlign: 'center', py: 3 }}>
                  No operations defined for this work order
                </Typography>
              )}
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Work Order Details
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
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
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

export default ViewWorkOrder;