import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Autorenew as ReviseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS } from '../constants';

const CreateRevision = ({ open, onClose, bomId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [revisionData, setRevisionData] = useState(null);
  const [formData, setFormData] = useState({
    change_description: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;



    setFieldErrors(errors);
    return isValid;
  };

  const handleCreateRevision = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const submitData = {
        change_description: formData.change_description.trim()
      };

      const response = await axios.post(
        `${BASE_URL}/api/boms/${bomId}/revisions/revise`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setRevisionData(response.data.data);
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to create revision');
      }
    } catch (err) {
      console.error('Error creating revision:', err);
      setError(err.response?.data?.message || 'Failed to create revision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setRevisionData(null);
    setBomDetails(null);
    setFormData({ change_description: '' });
    setFieldErrors({});
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalComponents = bomDetails?.components?.length || 0;

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
          <ReviseIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Create New Revision
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
        ) : success && revisionData ? (
          // Success State
          <Stack spacing={2.5}>
            <Alert 
              severity="success" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<CheckCircleIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Revision created successfully!
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success, mb: 1.5 }}>
                Revision Details
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Revision No
                  </Typography>
                  <Chip
                    label={`Revision ${revisionData.revision_no}`}
                    size="small"
                    sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Revision ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                    {revisionData.revision_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Change Description
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {revisionData.change_description}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Created At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(revisionData.created_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        ) : bomDetails ? (
          // Confirmation State
          <Stack spacing={2.5}>
            <Alert 
              severity="info" 
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
              icon={<ReviseIcon />}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Create a new revision for this BOM
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                This will create a new version of the BOM with the changes you specify.
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
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Version</Typography>
                  <Chip
                    label={bomDetails.bom_version}
                    size="small"
                    sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Summary */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Summary
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Components</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                    {totalComponents}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Current Revision</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {bomDetails.current_revision || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ borderColor: COLORS.border }} />

            {/* Change Description Input */}
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Change Description <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                name="change_description"
                value={formData.change_description}
                onChange={handleChange}
                placeholder="Describe the changes made in this revision..."
                error={!!fieldErrors.change_description}
                helperText={fieldErrors.change_description || "Please provide a detailed description of the changes (minimum 10 characters)"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '&:hover fieldset': { borderColor: COLORS.primary },
                    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                  },
                  '& .MuiInputBase-input': {
                    py: 1,
                    px: 1.5,
                    fontSize: '0.75rem',
                    color: COLORS.text.primary
                  }
                }}
              />
            </Box>

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
        {!success && bomDetails && (
          <Button
            variant="contained"
            onClick={handleCreateRevision}
            disabled={loading || fetchingDetails || !formData.change_description.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <ReviseIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Creating...' : 'Create Revision'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateRevision;