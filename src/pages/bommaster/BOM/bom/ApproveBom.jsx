import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ThumbUp as ThumbUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Verified as VerifiedIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS, STATUS_COLORS } from '../constants';
import PendingIcon from '@mui/icons-material/Pending';

const ApproveBom = ({ open, onClose, bomId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [approvalData, setApprovalData] = useState(null);
  const [bomDetails, setBomDetails] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Fetch BOM details when dialog opens
  React.useEffect(() => {
    if (open && bomId) {
      fetchBomDetails();
    }
  }, [open, bomId]);

  const fetchBomDetails = async () => {
    setFetchingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setBomDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching BOM details:', err);
      setError('Failed to load BOM details');
    } finally {
      setFetchingDetails(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/boms/${bomId}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setApprovalData(response.data.data);
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to approve BOM');
      }
    } catch (err) {
      console.error('Error approving BOM:', err);
      setError(err.response?.data?.message || 'Failed to approve BOM. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setApprovalData(null);
    setBomDetails(null);
    onClose();
  };

  const totalComponents = bomDetails?.components?.length || 0;
  const statusColors = getStatusColor(bomDetails?.status);
  const isAlreadyApproved = bomDetails?.status === 'Approved';

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
            Approve BOM
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetchingDetails ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, flexDirection: 'column' }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ mt: 2, color: COLORS.text.secondary, fontSize: '0.75rem' }}>
              Loading BOM details...
            </Typography>
          </Box>
        ) : success && approvalData ? (
          // Success State
          <Stack spacing={2.5}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                BOM approved successfully!
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
                    BOM ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {approvalData.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <CheckCircleIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Status
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: '0.7rem' }} />}
                    label={approvalData.status}
                    size="small"
                    sx={{ bgcolor: '#D1FAE5', color: '#059669', fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    <PersonIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Approved By
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {typeof approvalData.approved_by === 'object' 
                      ? approvalData.approved_by?.username || approvalData.approved_by?.id 
                      : approvalData.approved_by}
                  </Typography>
                </Grid>
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
        ) : isAlreadyApproved ? (
          // Already Approved State
          <Stack spacing={2.5}>
            <Alert 
              severity="warning" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                This BOM is already approved!
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Only pending BOMs can be approved.
              </Typography>
            </Alert>
          </Stack>
        ) : bomDetails ? (
          // Confirmation State
          <Stack spacing={2.5}>
            <Alert 
              severity="warning" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<WarningIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Are you sure you want to approve this BOM?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                Once approved, this BOM will be marked as approved and can be used in production.
              </Typography>
            </Alert>

            {/* BOM Information */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                BOM Information
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM ID</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                    {bomDetails.bom_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Name</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {bomDetails.bom_name || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Parent Part No</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {bomDetails.parent_part_no || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Version</Typography>
                  <Chip
                    label={bomDetails.bom_version}
                    size="small"
                    sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>BOM Type</Typography>
                  <Chip
                    label={bomDetails.bom_type}
                    size="small"
                    sx={{ bgcolor: COLORS.background.white, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Status</Typography>
                  <Chip
                    icon={getStatusIcon(bomDetails.status)}
                    label={bomDetails.status || 'Pending'}
                    size="small"
                    sx={{
                      bgcolor: statusColors.bg,
                      color: statusColors.color,
                      fontSize: '0.7rem',
                      mt: 0.5,
                      '& .MuiChip-icon': { fontSize: '0.7rem' }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Operations Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Components</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    {totalComponents}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Effective From</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(bomDetails.effective_from)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(bomDetails.created_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Component List Preview */}
            {bomDetails.components && bomDetails.components.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  Components
                </Typography>
                <Stack spacing={1}>
                  {bomDetails.components.slice(0, 3).map((comp, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem' }}>{comp.component_part_no}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Qty: {comp.quantity_per} {comp.unit}
                      </Typography>
                    </Box>
                  ))}
                  {bomDetails.components.length > 3 && (
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, textAlign: 'center' }}>
                      + {bomDetails.components.length - 3} more components
                    </Typography>
                  )}
                </Stack>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </Stack>
        ) : null}
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
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && !isAlreadyApproved && bomDetails && bomDetails.status !== 'Approved' && (
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={loading || fetchingDetails}
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
            {loading ? 'Approving...' : 'Approve BOM'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};


export default ApproveBom;