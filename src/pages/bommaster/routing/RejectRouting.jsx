import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  ThumbDown as ThumbDownIcon,
  Route as RouteIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Comment as CommentIcon,
  Build as BuildIcon,
  Science as ScienceIcon,
  Bolt as BoltIcon,
  Inventory as InventoryIcon
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

const RejectRouting = ({ open, onClose, routing, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [rejectionData, setRejectionData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!routing) return null;

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

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/routings/${routing._id}/reject`,
        { rejection_reason: rejectionReason },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setRejectionData(response.data.data);
        
        if (onReject) {
          onReject(response.data.data);
        }
        
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to reject routing');
      }
    } catch (err) {
      console.error('Error rejecting routing:', err);
      setError(err.response?.data?.message || 'Failed to reject routing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setRejectionData(null);
    setRejectionReason('');
    onClose();
  };

  const totalOperations = routing.operations?.length || 0;
  const totalSetupTime = routing.operations?.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0) || 0;
  const totalRunTime = routing.operations?.reduce((sum, op) => sum + (op.planned_run_min || 0), 0) || 0;
  const torqueOpsCount = routing.operations?.filter(op => op.requires_torque_recording).length || 0;
  const testOpsCount = routing.operations?.filter(op => op.requires_functional_test).length || 0;
  const totalJoints = routing.operations?.reduce((sum, op) => sum + (op.expected_joints?.length || 0), 0) || 0;

  const getRejectedByName = () => {
    if (!rejectionData?.rejected_by) return '-';
    if (typeof rejectionData.rejected_by === 'object') {
      return rejectionData.rejected_by.username || rejectionData.rejected_by.id || '-';
    }
    return rejectionData.rejected_by;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CancelIcon sx={{ fontSize: '1.2rem', color: COLORS.error }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Reject Routing
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && rejectionData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="warning" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Routing Rejected Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                The routing has been rejected and requires revision.
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 1.5 }}>
                Rejection Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <RouteIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Routing ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {rejectionData.routing_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Routing Name
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {rejectionData.routing_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Status
                  </Typography>
                  <Chip
                    label={rejectionData.status}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      mt: 0.5,
                      bgcolor: '#FEE2E2',
                      color: '#DC2626',
                      fontWeight: 600
                    }}
                  />
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <PersonIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Rejected By
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {getRejectedByName()}
                  </Typography>
                </Grid> */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Rejected At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDateTime(rejectionData.rejected_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <CommentIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Rejection Reason
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.error }}>
                    {rejectionData.rejection_reason}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        ) : (
          // Confirmation State
          <Stack spacing={2.5}>
            <Alert 
              severity="error" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Are you sure you want to reject this routing?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Please provide a reason for rejection. This will help the creator understand what needs to be revised.
              </Typography>
            </Alert>

            {/* Routing Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <RouteIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Routing Information
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Name</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {routing.routing_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing ID</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {routing.routing_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Type</Typography>
                  <Chip
                    label={routing.routing_type}
                    size="small"
                    sx={{ fontSize: '0.7rem', mt: 0.5, bgcolor: COLORS.background.white }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version</Typography>
                  <Chip
                    label={routing.version || '1.0'}
                    size="small"
                    sx={{ fontSize: '0.7rem', mt: 0.5, bgcolor: COLORS.background.white }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Status</Typography>
                  <Chip
                    label={routing.status || (routing.is_active ? 'Active' : 'Draft')}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      mt: 0.5,
                      bgcolor: routing.status === 'Approved' ? '#D1FAE5' : (routing.is_active ? '#DBEAFE' : '#FEF3C7'),
                      color: routing.status === 'Approved' ? '#059669' : (routing.is_active ? '#2563EB' : '#D97706')
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Quality Requirements Summary */}
            {(torqueOpsCount > 0 || testOpsCount > 0) && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <ScienceIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Quality Requirements
                </Typography>
                <Grid container spacing={1.5}>
                  {torqueOpsCount > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <BoltIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          Torque Recording
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Operations: {torqueOpsCount} | Joints: {totalJoints}
                      </Typography>
                    </Grid>
                  )}
                  {testOpsCount > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <ScienceIcon sx={{ fontSize: '0.9rem', color: COLORS.success }} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success }}>
                          Functional Test
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Operations: {testOpsCount}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Operations Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Operations Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Operations</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    {totalOperations}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{totalSetupTime} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{totalRunTime} min/unit</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Torque Ops</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary }}>{torqueOpsCount}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Operations List Preview */}
            {routing.operations && routing.operations.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <BuildIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Operation Sequence
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                  {routing.operations
                    .sort((a, b) => a.op_sequence - b.op_sequence)
                    .map((op, index) => {
                      const hasTorque = op.requires_torque_recording;
                      const hasTest = op.requires_functional_test;
                      return (
                        <Tooltip
                          key={index}
                          title={
                            <Box>
                              <Typography variant="caption" display="block">
                                Setup: {op.planned_setup_min} min | Run: {op.planned_run_min} min
                              </Typography>
                              {hasTorque && (
                                <Typography variant="caption" display="block" sx={{ color: '#FFD700' }}>
                                  🔩 Torque: {op.expected_joints?.join(', ') || 'No joints'}
                                </Typography>
                              )}
                              {hasTest && (
                                <Typography variant="caption" display="block" sx={{ color: '#90EE90' }}>
                                  🧪 Functional Test Required
                                </Typography>
                              )}
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <Chip
                            label={`${op.op_sequence}. ${typeof op.operation_id === 'object' ? op.operation_id.process_name : op.operation_name}`}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem', 
                              bgcolor: COLORS.background.white,
                              border: `1px solid ${COLORS.border}`,
                              ...(hasTorque && {
                                borderLeft: `3px solid ${COLORS.primary}`,
                              }),
                              ...(hasTest && {
                                borderRight: `3px solid ${COLORS.success}`,
                              })
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                </Stack>
                {(torqueOpsCount > 0 || testOpsCount > 0) && (
                  <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {torqueOpsCount > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BoltIcon sx={{ fontSize: '0.7rem', color: COLORS.primary }} />
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                          Blue border = Torque Recording
                        </Typography>
                      </Box>
                    )}
                    {testOpsCount > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScienceIcon sx={{ fontSize: '0.7rem', color: COLORS.success }} />
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                          Green border = Functional Test
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            )}

            {/* Expected Joints Details (if any) */}
            {torqueOpsCount > 0 && routing.operations?.some(op => op.expected_joints?.length > 0) && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <BoltIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Torque Recording Joints
                </Typography>
                <Stack spacing={1}>
                  {routing.operations
                    .filter(op => op.requires_torque_recording && op.expected_joints?.length > 0)
                    .map((op, idx) => (
                      <Box key={idx}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Op {op.op_sequence}: {typeof op.operation_id === 'object' ? op.operation_id.process_name : op.operation_name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                          {op.expected_joints.map((joint, jIdx) => (
                            <Chip
                              key={jIdx}
                              label={joint}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 22, bgcolor: COLORS.background.white }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                </Stack>
              </Paper>
            )}

            {/* Applicable Items Preview */}
            {routing.applicable_items && routing.applicable_items.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Applicable Items ({routing.applicable_items.length})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                  {routing.applicable_items.slice(0, 5).map((item, index) => (
                    <Chip
                      key={index}
                      label={item.part_no || item.item_id || 'Item'}
                      size="small"
                      sx={{ fontSize: '0.65rem', bgcolor: COLORS.background.white }}
                    />
                  ))}
                  {routing.applicable_items.length > 5 && (
                    <Chip
                      label={`+${routing.applicable_items.length - 5} more`}
                      size="small"
                      sx={{ fontSize: '0.65rem', bgcolor: COLORS.background.white }}
                    />
                  )}
                </Stack>
              </Paper>
            )}

            {/* Rejection Reason Input */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 1.5 }}>
                <CommentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Rejection Reason <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide detailed reason for rejection..."
                error={!!error && !rejectionReason.trim()}
                helperText={error && !rejectionReason.trim() ? error : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Paper>

            {error && rejectionReason.trim() && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          size="small"
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
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && (
          <Button
            variant="contained"
            onClick={handleReject}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <ThumbDownIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.error,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#B71C1C' }
            }}
          >
            {loading ? 'Rejecting...' : 'Reject Routing'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RejectRouting;