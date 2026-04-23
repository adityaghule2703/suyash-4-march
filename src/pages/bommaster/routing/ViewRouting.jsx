import React, { useState, useEffect } from 'react';
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
  Info as InfoIcon,
  Science as ScienceIcon,
  Bolt as BoltIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E3E8EF',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    light: '#F8FFFC',
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
  const [vendors, setVendors] = useState([]);

  // Fetch vendors to get names
  useEffect(() => {
    if (open && routing) {
      fetchVendors();
    }
  }, [open, routing]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

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

  const getVendorName = (vendorId) => {
    if (!vendorId) return 'Yes';
    if (typeof vendorId === 'object') {
      return vendorId.vendor_name || vendorId.name || 'Yes';
    }
    const vendor = vendors.find(v => v._id === vendorId);
    return vendor?.vendor_name || vendor?.name || vendorId;
  };

  // Function to get status display configuration
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
      case 'approved':
        return {
          label: 'Approved',
          icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} />,
          bgColor: '#D1FAE5',
          color: '#059669'
        };
      case 'active':
        return {
          label: 'Active',
          icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} />,
          bgColor: '#DBEAFE',
          color: '#2563EB'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: <CancelIcon sx={{ fontSize: '0.8rem' }} />,
          bgColor: '#FEE2E2',
          color: '#DC2626'
        };
      case 'draft':
        return {
          label: 'Draft',
          icon: <PendingIcon sx={{ fontSize: '0.8rem' }} />,
          bgColor: '#FEF3C7',
          color: '#D97706'
        };
      case 'inactive':
        return {
          label: 'Inactive',
          icon: <WarningIcon sx={{ fontSize: '0.8rem' }} />,
          bgColor: '#F3F4F6',
          color: '#6B7280'
        };
      default:
        return {
          label: status || 'Draft',
          icon: <PendingIcon sx={{ fontSize: '0.8rem' }} />,
          bgColor: '#FEF3C7',
          color: '#D97706'
        };
    }
  };

  // Determine the actual status (priority: status field, then approved field, then is_active)
  const getActualStatus = () => {
    // If status field exists, use it
    if (routing.status) {
      return routing.status;
    }
    // If approved flag exists, use it
    if (routing.approved === true) {
      return 'Approved';
    }
    if (routing.approved === false) {
      return 'Rejected';
    }
    // Fallback to is_active
    if (routing.is_active === true) {
      return 'Active';
    }
    if (routing.is_active === false) {
      return 'Inactive';
    }
    return 'Draft';
  };

  const actualStatus = getActualStatus();
  const statusConfig = getStatusConfig(actualStatus);

  const totalSetupTime = routing.operations?.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0) || 0;
  const totalRunTime = routing.operations?.reduce((sum, op) => sum + (op.planned_run_min || 0), 0) || 0;
  const torqueOpsCount = routing.operations?.filter(op => op.requires_torque_recording).length || 0;
  const testOpsCount = routing.operations?.filter(op => op.requires_functional_test).length || 0;

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
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: statusConfig.bgColor,
                          color: statusConfig.color,
                          '& .MuiChip-icon': {
                            fontSize: '0.8rem',
                            color: statusConfig.color
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
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Type</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{routing.routing_type || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Cycle Time</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>
                    {routing.total_cycle_time_min || totalRunTime} min
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Quality Requirements</Typography>
                  <Stack direction="row" spacing={1}>
                    {torqueOpsCount > 0 && (
                      <Chip
                        icon={<BoltIcon sx={{ fontSize: '0.7rem' }} />}
                        label={`${torqueOpsCount} Torque`}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.primary, color: '#fff' }}
                      />
                    )}
                    {testOpsCount > 0 && (
                      <Chip
                        icon={<ScienceIcon sx={{ fontSize: '0.7rem' }} />}
                        label={`${testOpsCount} Test`}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.success, color: '#fff' }}
                      />
                    )}
                    {torqueOpsCount === 0 && testOpsCount === 0 && (
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>None</Typography>
                    )}
                  </Stack>
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
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Operations</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    {routing.operations?.length || 0}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{totalSetupTime} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{totalRunTime} min/unit</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Torque Recording Ops</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.primary }}>{torqueOpsCount}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Approval/Rejection Information (if applicable) */}
            {(routing.approved_by || routing.rejected_by) && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Approval Information
                </Typography>
                <Grid container spacing={1.5}>
                  {routing.approved_by && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Approved By</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {typeof routing.approved_by === 'object' 
                            ? routing.approved_by?.username || routing.approved_by?.name || '-'
                            : routing.approved_by}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Approved At</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {formatDateTime(routing.approved_at) || '-'}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {routing.rejected_by && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rejected By</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {typeof routing.rejected_by === 'object'
                            ? routing.rejected_by?.username || routing.rejected_by?.name || '-'
                            : routing.rejected_by}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rejected At</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {formatDateTime(routing.rejected_at) || '-'}
                        </Typography>
                      </Grid>
                      {routing.rejection_reason && (
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Rejection Reason</Typography>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.error }}>
                            {routing.rejection_reason}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </Paper>
            )}
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
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Torque</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Test</TableCell>
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
                            {op.requires_torque_recording ? (
                              <Tooltip title={op.expected_joints?.join(', ') || 'No joints specified'}>
                                <Chip
                                  icon={<BoltIcon sx={{ fontSize: '0.65rem' }} />}
                                  label={`${op.expected_joints?.length || 0} joints`}
                                  size="small"
                                  sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.primary, color: '#fff' }}
                                />
                              </Tooltip>
                            ) : (
                              <Chip
                                label="No"
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {op.requires_functional_test ? (
                              <Chip
                                icon={<ScienceIcon sx={{ fontSize: '0.65rem' }} />}
                                label="Yes"
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.success, color: '#fff' }}
                              />
                            ) : (
                              <Chip
                                label="No"
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {op.is_subcontract ? (
                              <Chip
                                label={getVendorName(op.subcontract_vendor)}
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

            {/* Expected Joints Summary for Torque Recording Operations */}
            {routing.operations?.some(op => op.requires_torque_recording && op.expected_joints?.length > 0) && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <BoltIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Torque Recording Joints Details
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Operation</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Expected Joints</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {routing.operations
                        .filter(op => op.requires_torque_recording && op.expected_joints?.length > 0)
                        .map((op, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              Op {op.op_sequence}: {typeof op.operation_id === 'object' ? op.operation_id?.process_name : op.operation_name}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                {op.expected_joints.map((joint, idx) => (
                                  <Chip
                                    key={idx}
                                    label={joint}
                                    size="small"
                                    sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.background.white }}
                                  />
                                ))}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
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

            {/* Quality Requirements Summary Card */}
            {(torqueOpsCount > 0 || testOpsCount > 0) && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <ScienceIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Quality Requirements Summary
                </Typography>
                <Grid container spacing={2}>
                  {torqueOpsCount > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BoltIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          Torque Recording Operations
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Total operations requiring torque recording: {torqueOpsCount}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Total joints to be recorded: {routing.operations?.reduce((sum, op) => sum + (op.expected_joints?.length || 0), 0) || 0}
                      </Typography>
                    </Grid>
                  )}
                  {testOpsCount > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ScienceIcon sx={{ fontSize: '1rem', color: COLORS.success }} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success }}>
                          Functional Test Operations
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Total operations requiring functional test: {testOpsCount}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
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