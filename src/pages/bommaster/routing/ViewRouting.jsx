import React, { useState } from 'react';
import {
  Box,
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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Route as RouteIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  DateRange as DateIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  List as ListIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF'
  }
};

const steps = [
  'Routing Information',
  'Applicable Items',
  'Operations Details',
  'Additional Info'
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

const ViewRouting = ({ open, onClose, routing }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!routing) return null;

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

  const totalSetupTime = routing.operations?.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0) || 0;
  const totalRunTime = routing.operations?.reduce((sum, op) => sum + (op.planned_run_min || 0), 0) || 0;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

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
                Routing Header
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Name</Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                        {routing.routing_name}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing ID</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary }}>
                        {routing.routing_id}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '0.8rem' }} />}
                        label={routing.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          bgcolor: routing.is_active ? '#D1FAE5' : '#FEE2E2',
                          color: routing.is_active ? '#059669' : '#DC2626',
                          '& .MuiChip-icon': {
                            fontSize: '0.8rem',
                            color: routing.is_active ? '#059669' : '#DC2626'
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version</Typography>
                      <Chip
                        label={routing.version || '1.0'}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          bgcolor: COLORS.background.light,
                          color: COLORS.text.primary
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Basic Information */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <RouteIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Type</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{routing.routing_type || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Cycle Time</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>
                    {routing.total_cycle_time_min || totalRunTime} min
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Operations Summary */}
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <SettingsIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Operations Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Operations</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    {routing.operations?.length || 0}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{totalSetupTime} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{totalRunTime} min/unit</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Applicable Items ({routing.applicable_items?.length || 0})
              </Typography>
              {routing.applicable_items && routing.applicable_items.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Category</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {routing.applicable_items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {item.part_no || item._id || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {item.part_description || '-'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {item.item_category || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No applicable items specified
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Operations Details ({routing.operations?.length || 0})
              </Typography>
              {routing.operations && routing.operations.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Seq</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Operation</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Work Centre</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Setup (min)</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Run (min)</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Scrap %</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Subcontract</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {routing.operations.map((op, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            {op.op_sequence}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {typeof op.operation_id === 'object' ? op.operation_id?.process_name : op.operation_name}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{op.work_centre || '-'}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{op.planned_setup_min}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{op.planned_run_min}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>{op.scrap_pct || 0}%</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {op.is_subcontract ? (
                              <Chip
                                label={op.subcontract_vendor?.vendor_name || op.subcontract_vendor || 'Yes'}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20, bgcolor: '#FEF3C7', color: '#D97706' }}
                              />
                            ) : (
                              <Chip
                                label="No"
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No operations defined
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ListIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <TimelineIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Routing ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {routing.routing_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Created At
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {formatDateTime(routing.created_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Updated At
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {formatDateTime(routing.updated_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Approved At
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {formatDateTime(routing.approved_at) || '-'}
                  </Typography>
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
          Routing Details
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

export default ViewRouting;