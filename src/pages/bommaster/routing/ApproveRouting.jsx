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
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ThumbUp as ThumbUpIcon,
  Route as RouteIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Verified as VerifiedIcon
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

const ApproveRouting = ({ open, onClose, routing, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [approvalData, setApprovalData] = useState(null);

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

  const handleApprove = async () => {
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

      const response = await axios.post(`${BASE_URL}/api/routings/${routing._id}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        setApprovalData(response.data.data);
        
        // Call onApprove callback if provided
        if (onApprove) {
          onApprove(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to approve routing');
      }
    } catch (err) {
      console.error('Error approving routing:', err);
      setError(err.response?.data?.message || 'Failed to approve routing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setApprovalData(null);
    onClose();
  };

  const totalOperations = routing.operations?.length || 0;
  const totalSetupTime = routing.operations?.reduce((sum, op) => sum + (op.planned_setup_min || 0), 0) || 0;
  const totalRunTime = routing.operations?.reduce((sum, op) => sum + (op.planned_run_min || 0), 0) || 0;

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
          <VerifiedIcon sx={{ fontSize: '1rem', color: COLORS.success }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Approve Routing
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {success && approvalData ? (
          // Success State
          <Stack spacing={2}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Routing approved successfully!
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
                Approval Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <VerifiedIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Routing ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {approvalData.routing_id}
                  </Typography>
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <PersonIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Approved By
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {typeof approvalData.approved_by === 'object' 
                      ? approvalData.approved_by?.username || approvalData.approved_by?.id 
                      : approvalData.approved_by}
                  </Typography>
                </Grid> */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <DateIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Approved At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDateTime(approvalData.approved_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        ) : (
          // Confirmation State
          <Stack spacing={2.5}>
            <Alert 
              severity="warning" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Are you sure you want to approve this routing?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Once approved, this routing can be used in production.
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
                    label={routing.is_active ? 'Active' : 'Draft'}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      mt: 0.5,
                      bgcolor: routing.is_active ? '#D1FAE5' : '#FEF3C7',
                      color: routing.is_active ? '#059669' : '#D97706'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDateTime(routing.created_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Operations Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Operations Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Operations</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    {totalOperations}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Setup Time</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{totalSetupTime} min</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Run Time</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{totalRunTime} min/unit</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Operations List Preview */}
            {routing.operations && routing.operations.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  Operation Sequence
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {routing.operations
                    .sort((a, b) => a.op_sequence - b.op_sequence)
                    .map((op, index) => (
                      <Chip
                        key={index}
                        label={`${op.op_sequence}. ${typeof op.operation_id === 'object' ? op.operation_id.process_name : op.operation_name}`}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem', 
                          bgcolor: COLORS.background.white,
                          border: `1px solid ${COLORS.border}`
                        }}
                      />
                    ))}
                </Stack>
              </Paper>
            )}

            {error && (
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
            onClick={handleApprove}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <ThumbUpIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.success,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1E5A2A' }
            }}
          >
            {loading ? 'Approving...' : 'Approve Routing'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApproveRouting;